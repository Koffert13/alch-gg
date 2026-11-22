import { fetchForeverAhPrices } from './foreverAh';
import { buildMockPrices, TRACKED_AH_ITEM_IDS } from './mockPrices';
import type { PricesApiResponse, RealmSettings } from './types';
import { buildWowfahBaseUrl } from './wowfah';

/**
 * Fetches live hourly WoW: Forever Auction House prices via the open,
 * documented Forever AH JSON API (sourced from Blizzard's Battle.net API),
 * and falls back cleanly to calibrated Classic AH data only if upstream is unreachable.
 */
export async function fetchRealmPrices(realm: RealmSettings): Promise<PricesApiResponse> {
  const fetchedAt = Date.now();

  const live = await fetchForeverAhPrices(realm, TRACKED_AH_ITEM_IDS);
  if (live) {
    const itemCount = Object.keys(live.items).length;
    return {
      source: 'live',
      provider: 'Forever AH (Blizzard Battle.net API)',
      houseId: live.house.house_id,
      realm,
      upstreamBaseUrl: live.upstreamUrl,
      fetchedAt,
      snapshotAt: live.snapshotAt ?? Math.floor(fetchedAt / 1000),
      itemCount,
      items: live.items,
      categoriesFetched: 1,
      categoriesTotal: 1,
    };
  }

  // Fallback only if upstream API is unreachable
  const mockItems = buildMockPrices(realm);
  return {
    source: 'fallback',
    provider: 'Calibrated Offline Fallback',
    realm,
    upstreamBaseUrl: buildWowfahBaseUrl(realm),
    fetchedAt,
    snapshotAt: Math.floor(fetchedAt / 1000),
    itemCount: Object.keys(mockItems).length,
    items: mockItems,
    categoriesFetched: 0,
    categoriesTotal: 1,
    notice:
      'Live Auction House feed is temporarily unreachable — showing calibrated fallback prices. Tap Sync to retry or tap any item to override.',
  };
}
