import { useEffect, useState } from 'react';
import { Database, Globe, Pencil, RefreshCw, RotateCcw, Trash2 } from 'lucide-react';
import type {
  AhItemPrice,
  AlchemyRecipe,
  Faction,
  PricesApiResponse,
  RealmSettings,
  Region,
  Ruleset,
} from '../../shared/types';
import { getBlizzardHouseId } from '../../shared/foreverAh';
import {
  VALID_FACTIONS,
  VALID_REGIONS,
  VALID_RULESETS,
} from '../../shared/wowfah';
import { getCatalogItemName, getVendorPrice } from '../data/items';
import { formatRelativeTime } from '../lib/currency';
import { CoinDisplay } from './CoinDisplay';
import type { PriceOverrideTarget } from './PriceOverrideModal';

interface SettingsTabProps {
  realm: RealmSettings;
  priceData: PricesApiResponse | null;
  priceMap: Record<number, AhItemPrice>;
  overrides: Record<number, number>;
  customRecipes: AlchemyRecipe[];
  isSyncing: boolean;
  onSaveRealmAndSync: (realm: RealmSettings) => void;
  onForceRefresh: () => void;
  onClearCache: () => void;
  onOpenOverride: (target: PriceOverrideTarget) => void;
  onClearOverride: (itemId: number) => void;
  onClearAllOverrides: () => void;
  onDeleteCustomRecipe: (id: string) => void;
}

const REGION_LABELS: Record<Region, string> = {
  eu: 'EU',
  us: 'US',
  kr: 'KR',
  tw: 'TW',
};

const RULESET_LABELS: Record<Ruleset, string> = {
  pvp: 'PvP',
  normal: 'Normal',
  rp: 'RP',
  'rp-pvp': 'RP-PvP',
};

const FACTION_LABELS: Record<Faction, string> = {
  horde: 'Horde',
  alliance: 'Alliance',
  blackwater: 'Blackwater',
};

export function SettingsTab({
  realm,
  priceData,
  priceMap,
  overrides,
  customRecipes,
  isSyncing,
  onSaveRealmAndSync,
  onForceRefresh,
  onClearCache,
  onOpenOverride,
  onClearOverride,
  onClearAllOverrides,
  onDeleteCustomRecipe,
}: SettingsTabProps) {
  const [draft, setDraft] = useState<RealmSettings>(realm);

  useEffect(() => {
    setDraft(realm);
  }, [realm]);

  const overrideEntries = Object.entries(overrides).map(([id, copper]) => ({
    itemId: Number(id),
    copper,
    name: getCatalogItemName(Number(id), priceMap[Number(id)]?.name),
  }));

  const hasRealmChanged =
    draft.region !== realm.region ||
    draft.ruleset !== realm.ruleset ||
    draft.faction !== realm.faction;

  return (
    <section className="space-y-4">
      {/* Upstream wowfah.com Realm Selector */}
      <div className="rounded-2xl border border-[#1e2c25] bg-[#111915] p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-400" />
          <div>
            <h2 className="text-sm font-semibold text-[#e7ece8]">Auction House Realm</h2>
            <p className="text-xs text-[#7a9083]">
              Live hourly Blizzard Battle.net AH snapshots via Forever AH API (auto-syncs every 30m)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#708578]">
              Region
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {VALID_REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, region: r }))}
                  className={`rounded-xl border py-2 text-xs font-semibold transition ${
                    draft.region === r
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                      : 'border-[#213028] bg-[#0b110e] text-[#8fa196] hover:text-[#e7ece8]'
                  }`}
                >
                  {REGION_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#708578]">
              Ruleset
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {VALID_RULESETS.map((rs) => (
                <button
                  key={rs}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, ruleset: rs }))}
                  className={`rounded-xl border py-2 text-xs font-semibold transition ${
                    draft.ruleset === rs
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                      : 'border-[#213028] bg-[#0b110e] text-[#8fa196] hover:text-[#e7ece8]'
                  }`}
                >
                  {RULESET_LABELS[rs]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#708578]">
              Faction
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {VALID_FACTIONS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, faction: f }))}
                  className={`rounded-xl border py-2 text-xs font-semibold transition ${
                    draft.faction === f
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                      : 'border-[#213028] bg-[#0b110e] text-[#8fa196] hover:text-[#e7ece8]'
                  }`}
                >
                  {FACTION_LABELS[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1d2b24] bg-[#0b110e] px-3 py-2 text-xs">
          <span className="text-[#6d8276]">Live Feed Target: </span>
          <span className="font-tabular break-all text-emerald-300">
            forever-ah.com · {draft.region.toUpperCase()} House #{getBlizzardHouseId(draft.ruleset, draft.faction)} ({RULESET_LABELS[draft.ruleset]} {FACTION_LABELS[draft.faction]})
          </span>
        </div>

        <button
          type="button"
          disabled={isSyncing}
          onClick={() => onSaveRealmAndSync(draft)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#05140d] transition hover:bg-emerald-400 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {hasRealmChanged ? 'Save Realm & Sync AH Prices' : 'Sync Selected Realm Now'}
        </button>
      </div>

      {/* Active Manual Overrides */}
      <div className="rounded-2xl border border-[#1e2c25] bg-[#111915] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#e7ece8]">
              Manual Price Overrides ({overrideEntries.length})
            </h2>
            <p className="text-xs text-[#7a9083]">
              Temporary G/S/C overrides saved locally in your browser
            </p>
          </div>
          {overrideEntries.length > 0 && (
            <button
              type="button"
              onClick={onClearAllOverrides}
              className="inline-flex items-center gap-1 rounded-lg border border-[#2a3b32] bg-[#16221c] px-2.5 py-1.5 text-xs font-medium text-[#c9d6ce] hover:border-rose-500/30 hover:text-rose-300"
            >
              <RotateCcw className="h-3 w-3" />
              Clear All
            </button>
          )}
        </div>

        {overrideEntries.length === 0 ? (
          <p className="rounded-xl bg-[#0b110e] px-3 py-3 text-xs text-[#6d8276]">
            No overrides active. Tap any herb, vial, output item, or AH recipe scroll to override
            its price.
          </p>
        ) : (
          <div className="divide-y divide-[#1a2620] overflow-hidden rounded-xl border border-[#1d2b24] bg-[#0b110e]">
            {overrideEntries.map((ovr) => (
              <div
                key={ovr.itemId}
                className="flex items-center justify-between gap-2 px-3 py-2 text-xs"
              >
                <span className="truncate font-medium text-[#e7ece8]">{ovr.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenOverride({
                        itemId: ovr.itemId,
                        name: ovr.name,
                        currentPrice: ovr.copper,
                        isOverridden: true,
                        isVendor: getVendorPrice(ovr.itemId) !== undefined,
                        vendorPrice: getVendorPrice(ovr.itemId),
                        ahRecord: priceMap[ovr.itemId],
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#141e19] px-2 py-1 hover:bg-[#1b2922]"
                  >
                    <CoinDisplay copper={ovr.copper} size="xs" />
                    <Pencil className="h-3 w-3 text-[#708578]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onClearOverride(ovr.itemId)}
                    className="rounded-lg p-1 text-[#6d8276] hover:bg-rose-500/10 hover:text-rose-400"
                    aria-label={`Remove override for ${ovr.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Recipes Management */}
      {customRecipes.length > 0 && (
        <div className="rounded-2xl border border-[#1e2c25] bg-[#111915] p-4 space-y-2.5">
          <h2 className="text-sm font-semibold text-[#e7ece8]">
            Custom Recipes ({customRecipes.length})
          </h2>
          <div className="divide-y divide-[#1a2620] overflow-hidden rounded-xl border border-[#1d2b24] bg-[#0b110e]">
            {customRecipes.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-2 px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-[#e7ece8]">{r.name}</div>
                  <div className="font-tabular text-[11px] text-[#708578]">
                    Skill {r.skillRequired} · Yield ×{r.yield}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteCustomRecipe(r.id)}
                  className="rounded-lg p-1.5 text-[#6d8276] hover:bg-rose-500/10 hover:text-rose-400"
                  aria-label={`Delete ${r.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sync & Local Cache Diagnostics */}
      <div className="rounded-2xl border border-[#1e2c25] bg-[#111915] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-[#e7ece8]">Price Cache &amp; Diagnostics</h2>
        </div>

        {priceData ? (
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#0b110e] p-3 text-xs">
            <div>
              <span className="text-[#6d8276]">Feed Source</span>
              <div className="mt-0.5 font-semibold">
                {priceData.source === 'live' ? (
                  <span className="text-emerald-400">
                    {priceData.provider ?? 'Live Forever AH'}
                    {priceData.houseId ? ` (#${priceData.houseId})` : ''}
                  </span>
                ) : (
                  <span className="text-amber-300">Calibrated Fallback</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-[#6d8276]">Items Cached</span>
              <div className="font-tabular mt-0.5 font-semibold text-[#e7ece8]">
                {priceData.itemCount.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-[#6d8276]">Last Synced</span>
              <div className="font-tabular mt-0.5 text-[#c9d6ce]">
                {formatRelativeTime(priceData.fetchedAt)}
              </div>
            </div>
            <div>
              <span className="text-[#6d8276]">AH Snapshot</span>
              <div className="font-tabular mt-0.5 text-[#c9d6ce]">
                {new Date(priceData.snapshotAt * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#708578]">No price cache stored yet.</p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSyncing}
            onClick={onForceRefresh}
            className="flex-1 rounded-xl border border-[#283a31] bg-[#16221c] px-3 py-2 text-xs font-medium text-[#d5e0d9] transition hover:border-emerald-500/40"
          >
            Force Bypass Edge Cache
          </button>
          <button
            type="button"
            onClick={onClearCache}
            className="rounded-xl border border-[#283a31] bg-[#111915] px-3 py-2 text-xs font-medium text-[#8fa196] transition hover:text-rose-300"
          >
            Clear Cache
          </button>
        </div>
      </div>
    </section>
  );
}
