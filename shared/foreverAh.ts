import type { AhItemPrice, Faction, RealmSettings, Ruleset } from './types';

export const FOREVER_AH_BASE_URL = 'https://forever-ah.com';

/**
 * Blizzard WoW: Forever Auction House IDs per ruleset and faction
 * (consistent across EU, US, KR, and TW regions).
 */
export const RULESET_FACTION_HOUSE_ID: Record<Ruleset, Record<Faction, number>> = {
  pvp: { alliance: 110, horde: 113, blackwater: 116 },
  normal: { alliance: 111, horde: 114, blackwater: 117 },
  rp: { alliance: 119, horde: 120, blackwater: 121 },
  'rp-pvp': { alliance: 123, horde: 124, blackwater: 125 },
};

export interface ForeverAhHouse {
  house_key: number;
  region: string;
  ruleset_id: number;
  house_id: number;
  name: string;
  last_snapshot: string;
  house_type: 'real' | 'unified' | string;
}

export interface ForeverAhMarketRow {
  item: {
    item_id: number;
    name: string;
  };
  current?: {
    ts?: string;
    min_unit?: number | null;
    p10_unit?: number | null;
    median_unit?: number | null;
    mean_unit?: number | null;
    quantity?: number | null;
    listings?: number | null;
  } | null;
  stats?: {
    market_value?: number | null;
    historical_value?: number | null;
    sold_per_day?: number | null;
  } | null;
}

export interface ForeverAhMarketResponse {
  house?: ForeverAhHouse;
  as_of?: string;
  total?: number;
  rows?: ForeverAhMarketRow[];
}

export function getBlizzardHouseId(ruleset: Ruleset, faction: Faction): number {
  return RULESET_FACTION_HOUSE_ID[ruleset][faction];
}

export function findForeverAhHouse(
  houses: readonly ForeverAhHouse[],
  realm: RealmSettings
): ForeverAhHouse | null {
  const targetHouseId = getBlizzardHouseId(realm.ruleset, realm.faction);
  const exact = houses.find(
    (h) =>
      h.region.toLowerCase() === realm.region &&
      h.house_type === 'real' &&
      h.house_id === targetHouseId
  );
  if (exact) return exact;

  // Fallback to regional unified house if a specific house is temporarily missing
  return (
    houses.find(
      (h) => h.region.toLowerCase() === realm.region && h.house_type === 'unified'
    ) ?? null
  );
}

export function parseForeverAhMarketResponse(data: ForeverAhMarketResponse): {
  items: Record<number, AhItemPrice>;
  snapshotAt: number | null;
} {
  const items: Record<number, AhItemPrice> = {};
  const rows = Array.isArray(data.rows) ? data.rows : [];

  for (const row of rows) {
    const itemId = row.item?.item_id;
    if (!itemId || !Number.isFinite(itemId)) continue;

    const minBuyout = Math.max(0, Math.round(row.current?.min_unit ?? 0));
    const marketCandidate =
      row.stats?.market_value ??
      row.current?.median_unit ??
      row.current?.mean_unit ??
      row.current?.min_unit ??
      0;
    const marketPrice = Math.max(0, Math.round(marketCandidate));
    const listed = Math.max(0, Math.round(row.current?.quantity ?? 0));
    const sold24h = Math.max(0, Math.round(row.stats?.sold_per_day ?? 0));

    items[itemId] = {
      itemId,
      name: row.item.name || `Item #${itemId}`,
      minBuyout,
      marketPrice,
      listed,
      sold24h,
    };
  }

  let snapshotAt: number | null = null;
  const iso = data.as_of ?? data.house?.last_snapshot;
  if (iso) {
    const parsedMs = Date.parse(iso);
    if (Number.isFinite(parsedMs)) {
      snapshotAt = Math.floor(parsedMs / 1000);
    }
  }

  return { items, snapshotAt };
}

// In-memory house index cache (6h) to minimize requests to Forever AH
let cachedHouses: { expiresAt: number; list: ForeverAhHouse[] } | null = null;
const HOUSES_CACHE_MS = 6 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 9000;
const MAX_IDS_PER_REQUEST = 100;

async function fetchJsonWithTimeout<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ALCH.GG/1.0 (+https://github.com/Koffert13/alch-gg)',
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function getForeverAhHouses(): Promise<ForeverAhHouse[] | null> {
  const now = Date.now();
  if (cachedHouses && cachedHouses.expiresAt > now) {
    return cachedHouses.list;
  }
  const list = await fetchJsonWithTimeout<ForeverAhHouse[]>(`${FOREVER_AH_BASE_URL}/v1/houses`);
  if (Array.isArray(list) && list.length > 0) {
    cachedHouses = { expiresAt: now + HOUSES_CACHE_MS, list };
    return list;
  }
  return cachedHouses?.list ?? null;
}

export interface ForeverAhFetchResult {
  house: ForeverAhHouse;
  items: Record<number, AhItemPrice>;
  snapshotAt: number | null;
  upstreamUrl: string;
}

/**
 * Fetches live hourly Blizzard Battle.net AH prices via the free, documented
 * Forever AH JSON API (https://forever-ah.com/api/).
 */
export async function fetchForeverAhPrices(
  realm: RealmSettings,
  itemIds: readonly number[]
): Promise<ForeverAhFetchResult | null> {
  const houses = await getForeverAhHouses();
  if (!houses) return null;

  const house = findForeverAhHouse(houses, realm);
  if (!house) return null;

  const mergedItems: Record<number, AhItemPrice> = {};
  let latestSnapshot: number | null = null;
  const baseMarketUrl = `${FOREVER_AH_BASE_URL}/v1/houses/${house.house_key}/market`;

  // Batch in chunks of <= 180 IDs (163 tracked Alchemy IDs fit in 1 single HTTP request)
  for (let i = 0; i < itemIds.length; i += MAX_IDS_PER_REQUEST) {
    const chunk = itemIds.slice(i, i + MAX_IDS_PER_REQUEST);
    const url = `${baseMarketUrl}?ids=${chunk.join(',')}&limit=200`;
    const data = await fetchJsonWithTimeout<ForeverAhMarketResponse>(url);
    if (!data) continue;

    const parsed = parseForeverAhMarketResponse(data);
    if (parsed.snapshotAt && (latestSnapshot === null || parsed.snapshotAt > latestSnapshot)) {
      latestSnapshot = parsed.snapshotAt;
    }
    for (const [idStr, item] of Object.entries(parsed.items)) {
      mergedItems[Number(idStr)] = item;
    }
  }

  if (Object.keys(mergedItems).length === 0) {
    return null;
  }

  return {
    house,
    items: mergedItems,
    snapshotAt: latestSnapshot,
    upstreamUrl: `${FOREVER_AH_BASE_URL}/?house=${house.house_key}`,
  };
}
