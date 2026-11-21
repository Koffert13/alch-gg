import type { AhItemPrice, Faction, RealmSettings, Region, Ruleset } from './types';

export const VALID_REGIONS: readonly Region[] = ['eu', 'us', 'kr', 'tw'] as const;
export const VALID_RULESETS: readonly Ruleset[] = ['pvp', 'normal', 'rp', 'rp-pvp'] as const;
export const VALID_FACTIONS: readonly Faction[] = ['horde', 'alliance', 'blackwater'] as const;

export const DEFAULT_REALM: RealmSettings = {
  region: 'eu',
  ruleset: 'pvp',
  faction: 'horde',
};

export const WOWFAH_CATEGORY_PATHS: readonly string[] = [
  '/category/trade-goods/herb?n=200',
  '/category/trade-goods/elemental?n=200',
  '/category/trade-goods/metal-stone?n=200',
  '/category/trade-goods/other?n=200',
  '/category/trade-goods/cooking?n=200',
  '/category/consumable/potions?n=200',
  '/category/consumable/elixirs?n=200',
  '/category/consumable/flasks?n=200',
  '/category/consumable/other?n=200',
  '/category/recipe/alchemy?n=200',
] as const;

export function normalizeRealmSettings(input: Partial<Record<keyof RealmSettings, string | null>>): RealmSettings {
  const region = VALID_REGIONS.includes(input.region as Region)
    ? (input.region as Region)
    : DEFAULT_REALM.region;
  const ruleset = VALID_RULESETS.includes(input.ruleset as Ruleset)
    ? (input.ruleset as Ruleset)
    : DEFAULT_REALM.ruleset;
  const faction = VALID_FACTIONS.includes(input.faction as Faction)
    ? (input.faction as Faction)
    : DEFAULT_REALM.faction;

  return { region, ruleset, faction };
}

export function buildWowfahBaseUrl(realm: RealmSettings): string {
  return `https://wowfah.com/${realm.region}/${realm.ruleset}/${realm.faction}`;
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;|&#x27;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export function stripHtmlTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses a wowfah price cell (HTML or plain text) into integer copper (1g = 10000c, 1s = 100c).
 * Handles:
 *  - Plain or tag-interleaved text: "12g 34s 56c", "1,250g 5s", "<span>4</span>s <span>50</span>c"
 *  - Class-tagged spans without suffixes: `<span class="gold">12</span><span class="silver">34</span><span class="copper">56</span>`
 *  - Explicit data-copper / data-val attributes
 */
export function parseCopperPrice(cellHtml: string): number {
  if (!cellHtml) return 0;

  // 1. Direct data-copper attribute if present
  const dataCopperMatch = cellHtml.match(/data-copper=["'](\d+)["']/i);
  if (dataCopperMatch) {
    return parseInt(dataCopperMatch[1], 10) || 0;
  }

  // 2. Strip tags and parse explicit g/s/c suffixes (most common in wowfah SSR tables)
  const compactText = decodeHtmlEntities(cellHtml.replace(/<[^>]+>/g, ''))
    .replace(/,/g, '')
    .trim();

  if (!compactText || compactText === '-' || compactText === '—' || compactText.toLowerCase() === 'n/a') {
    return 0;
  }

  const gMatch = compactText.match(/(\d+)\s*g\b/i);
  const sMatch = compactText.match(/(\d+)\s*s\b/i);
  const cMatch = compactText.match(/(\d+)\s*c\b/i);

  if (gMatch || sMatch || cMatch) {
    const gold = gMatch ? parseInt(gMatch[1], 10) : 0;
    const silver = sMatch ? parseInt(sMatch[1], 10) : 0;
    const copper = cMatch ? parseInt(cMatch[1], 10) : 0;
    return gold * 10000 + silver * 100 + copper;
  }

  // 3. Fallback: class-based spans like <span class="g">12</span> or <span class="gold">12</span>
  const spanGold = cellHtml.match(/<[^>]*class=["'][^"']*\b(?:g|gold|money-g|money-gold)\b[^"']*["'][^>]*>\s*([\d,]+)\s*</i);
  const spanSilver = cellHtml.match(/<[^>]*class=["'][^"']*\b(?:s|silver|money-s|money-silver)\b[^"']*["'][^>]*>\s*([\d,]+)\s*</i);
  const spanCopper = cellHtml.match(/<[^>]*class=["'][^"']*\b(?:c|copper|money-c|money-copper)\b[^"']*["'][^>]*>\s*([\d,]+)\s*</i);

  if (spanGold || spanSilver || spanCopper) {
    const gold = spanGold ? parseInt(spanGold[1].replace(/,/g, ''), 10) : 0;
    const silver = spanSilver ? parseInt(spanSilver[1].replace(/,/g, ''), 10) : 0;
    const copper = spanCopper ? parseInt(spanCopper[1].replace(/,/g, ''), 10) : 0;
    return gold * 10000 + silver * 100 + copper;
  }

  // 4. Bare integer copper fallback
  if (/^\d+$/.test(compactText)) {
    return parseInt(compactText, 10);
  }

  return 0;
}

export function parseIntegerCell(cellHtml: string): number {
  const text = stripHtmlTags(cellHtml).replace(/[,~\s]/g, '');
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function extractTdByDataLabel(trHtml: string, label: string): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `<td\\b[^>]*data-label=["']${escaped}["'][^>]*>([\\s\\S]*?)<\\/td>`,
    'i'
  );
  const match = trHtml.match(regex);
  return match ? match[1] : '';
}

export interface ParsedWowfahPage {
  snapshotAt: number | null;
  items: AhItemPrice[];
}

/**
 * Parses a server-rendered wowfah.com category HTML page.
 * Extracts:
 *  - `<aside class="topbar" data-snap="<unix_sec>">`
 *  - Each `<tr>` in `<tbody>` with `data-star="<itemId>"`
 *  - `<a class="name ...">Name</a>`
 *  - `<td data-label="Min buyout">`, `<td data-label="Market price">`,
 *    `<td data-label="Listed">`, `<td data-label="Sold 24h">`
 */
export function parseWowfahCategoryHtml(html: string): ParsedWowfahPage {
  let snapshotAt: number | null = null;

  // Match <aside ... class="...topbar..." ... data-snap="12345"> in either attribute order
  const asideMatch = html.match(/<aside\b[^>]*\btopbar\b[^>]*>/i);
  if (asideMatch) {
    const snapMatch = asideMatch[0].match(/data-snap=["'](\d+)["']/i);
    if (snapMatch) {
      snapshotAt = parseInt(snapMatch[1], 10);
    }
  }
  if (snapshotAt === null) {
    const anySnapMatch = html.match(/data-snap=["'](\d+)["']/i);
    if (anySnapMatch) {
      snapshotAt = parseInt(anySnapMatch[1], 10);
    }
  }

  // Prefer scoping to <tbody>...</tbody> if present, else search entire HTML
  const tbodyMatch = html.match(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i);
  const rowsSource = tbodyMatch ? tbodyMatch[1] : html;

  const items: AhItemPrice[] = [];
  const trRegex = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/gi;
  let trMatch: RegExpExecArray | null;

  while ((trMatch = trRegex.exec(rowsSource)) !== null) {
    const trAttrs = trMatch[1];
    const trInner = trMatch[2];

    const starMatch = trAttrs.match(/data-star=["'](\d+)["']/i);
    if (!starMatch) continue;

    const itemId = parseInt(starMatch[1], 10);
    if (!Number.isFinite(itemId) || itemId <= 0) continue;

    // Extract item name from <a class="name ...">Name</a>
    const nameMatch = trInner.match(
      /<a\b[^>]*class=["'][^"']*\bname\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/i
    );
    const name = nameMatch ? stripHtmlTags(nameMatch[1]) : `Item #${itemId}`;

    const minBuyout = parseCopperPrice(extractTdByDataLabel(trInner, 'Min buyout'));
    const marketPrice = parseCopperPrice(extractTdByDataLabel(trInner, 'Market price'));
    const listed = parseIntegerCell(extractTdByDataLabel(trInner, 'Listed'));
    const sold24h = parseIntegerCell(extractTdByDataLabel(trInner, 'Sold 24h'));

    items.push({
      itemId,
      name,
      minBuyout,
      marketPrice,
      listed,
      sold24h,
    });
  }

  return { snapshotAt, items };
}

export function mergeAhItems(
  pages: ParsedWowfahPage[]
): { items: Record<number, AhItemPrice>; snapshotAt: number | null } {
  const merged: Record<number, AhItemPrice> = {};
  let latestSnap: number | null = null;

  for (const page of pages) {
    if (page.snapshotAt && (latestSnap === null || page.snapshotAt > latestSnap)) {
      latestSnap = page.snapshotAt;
    }
    for (const item of page.items) {
      const existing = merged[item.itemId];
      if (!existing) {
        merged[item.itemId] = item;
      } else {
        merged[item.itemId] = {
          itemId: item.itemId,
          name: item.name || existing.name,
          minBuyout: item.minBuyout > 0 ? item.minBuyout : existing.minBuyout,
          marketPrice: item.marketPrice > 0 ? item.marketPrice : existing.marketPrice,
          listed: Math.max(item.listed, existing.listed),
          sold24h: Math.max(item.sold24h, existing.sold24h),
        };
      }
    }
  }

  return { items: merged, snapshotAt: latestSnap };
}
