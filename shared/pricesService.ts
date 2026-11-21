import { buildMockPrices } from './mockPrices';
import type { PricesApiResponse, RealmSettings } from './types';
import {
  buildWowfahBaseUrl,
  mergeAhItems,
  parseWowfahCategoryHtml,
  WOWFAH_CATEGORY_PATHS,
  type ParsedWowfahPage,
} from './wowfah';

const FETCH_TIMEOUT_MS = 8500;

async function fetchCategoryPage(url: string): Promise<ParsedWowfahPage | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) {
      return null;
    }
    const html = await res.text();
    const parsed = parseWowfahCategoryHtml(html);
    if (parsed.items.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetches all 10 wowfah.com server-rendered category HTML pages in parallel,
 * normalizes prices to integer copper, and falls back to realistic Classic AH
 * market data if upstream is unavailable or returns no rows.
 */
export async function fetchRealmPrices(realm: RealmSettings): Promise<PricesApiResponse> {
  const upstreamBaseUrl = buildWowfahBaseUrl(realm);
  const urls = WOWFAH_CATEGORY_PATHS.map((path) => `${upstreamBaseUrl}${path}`);

  const results = await Promise.allSettled(urls.map((u) => fetchCategoryPage(u)));
  const parsedPages: ParsedWowfahPage[] = [];

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value && r.value.items.length > 0) {
      parsedPages.push(r.value);
    }
  }

  const fetchedAt = Date.now();
  const { items, snapshotAt } = mergeAhItems(parsedPages);
  const itemCount = Object.keys(items).length;

  if (itemCount > 0) {
    return {
      source: 'live',
      realm,
      upstreamBaseUrl,
      fetchedAt,
      snapshotAt: snapshotAt ?? Math.floor(fetchedAt / 1000),
      itemCount,
      items,
      categoriesFetched: parsedPages.length,
      categoriesTotal: WOWFAH_CATEGORY_PATHS.length,
    };
  }

  // Realistic Classic fallback when upstream is unreachable or blocks automated fetches
  const mockItems = buildMockPrices(realm);
  return {
    source: 'fallback',
    realm,
    upstreamBaseUrl,
    fetchedAt,
    snapshotAt: Math.floor(fetchedAt / 1000),
    itemCount: Object.keys(mockItems).length,
    items: mockItems,
    categoriesFetched: 0,
    categoriesTotal: WOWFAH_CATEGORY_PATHS.length,
    notice:
      'Live wowfah.com HTML pages were unavailable from the edge worker — showing calibrated Classic AH fallback prices. Tap any item or recipe scroll to enter local overrides.',
  };
}
