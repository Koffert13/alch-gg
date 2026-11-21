import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  ScrollText,
  Search,
  ShoppingBag,
  Star,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import type { AcquisitionType, AhItemPrice, QueueEntry, RecipeCategory } from '../../shared/types';
import { getVendorPrice } from '../data/items';
import {
  sortEvaluatedRecipes,
  type EvaluatedRecipe,
  type SortOption,
} from '../lib/alchemyMath';
import { CoinDisplay } from './CoinDisplay';
import type { PriceOverrideTarget } from './PriceOverrideModal';

interface FlipsTabProps {
  evaluatedRecipes: EvaluatedRecipe[];
  favorites: Set<string>;
  queue: QueueEntry[];
  priceMap: Record<number, AhItemPrice>;
  onToggleFavorite: (recipeId: string) => void;
  onAddToQueue: (recipeId: string, delta: number) => void;
  onOpenOverride: (target: PriceOverrideTarget) => void;
  onOpenCustomModal: () => void;
  onDeleteCustomRecipe: (recipeId: string) => void;
}

const CATEGORY_TABS: { value: 'all' | RecipeCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'potion', label: 'Potions' },
  { value: 'elixir', label: 'Elixirs' },
  { value: 'protection', label: 'Protection' },
  { value: 'oil', label: 'Oils' },
  { value: 'flask', label: 'Flasks' },
  { value: 'transmute', label: 'Transmutes' },
];

const ACQ_BADGE: Record<AcquisitionType, { label: string; style: string }> = {
  ah: {
    label: 'AH / Drop',
    style: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  vendor: {
    label: 'Vendor',
    style: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  },
  trainer: {
    label: 'Trainer',
    style: 'bg-[#1c2822] text-[#a5b7ac] border-[#293a31]',
  },
  reputation: {
    label: 'Reputation',
    style: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  },
  quest: {
    label: 'Quest',
    style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
};

export function FlipsTab({
  evaluatedRecipes,
  favorites,
  queue,
  priceMap,
  onToggleFavorite,
  onAddToQueue,
  onOpenOverride,
  onOpenCustomModal,
  onDeleteCustomRecipe,
}: FlipsTabProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | RecipeCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('profit');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [profitableOnly, setProfitableOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const queueQtyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of queue) {
      map.set(q.recipeId, q.quantity);
    }
    return map;
  }, [queue]);

  const summary = useMemo(() => {
    const profitable = evaluatedRecipes.filter((e) => e.netProfit > 0);
    const best = [...profitable].sort((a, b) => b.netProfit - a.netProfit)[0];
    const fastestBe = [...profitable]
      .filter((e) => e.recipeCost.costCopper > 0 && e.breakEvenCrafts !== null)
      .sort((a, b) => (a.breakEvenCrafts ?? 9999) - (b.breakEvenCrafts ?? 9999))[0];
    return {
      total: evaluatedRecipes.length,
      profitableCount: profitable.length,
      best,
      fastestBe,
    };
  }, [evaluatedRecipes]);

  const filteredRecipes = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = evaluatedRecipes.filter((item) => {
      if (category !== 'all' && item.recipe.category !== category) return false;
      if (favoritesOnly && !favorites.has(item.recipe.id)) return false;
      if (profitableOnly && item.netProfit <= 0) return false;
      if (q) {
        const nameMatch = item.recipe.name.toLowerCase().includes(q);
        const ingMatch = item.ingredients.some((i) => i.name.toLowerCase().includes(q));
        const srcMatch =
          item.recipe.acquisition.sourceLabel.toLowerCase().includes(q) ||
          item.recipe.acquisition.location.toLowerCase().includes(q);
        if (!nameMatch && !ingMatch && !srcMatch) return false;
      }
      return true;
    });
    return sortEvaluatedRecipes(list, sortBy);
  }, [evaluatedRecipes, category, favoritesOnly, profitableOnly, favorites, search, sortBy]);

  return (
    <section className="space-y-4">
      {/* Compact Market Pulse Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-[#1d2b24] bg-[#101814] px-3 py-2.5">
          <div className="text-[11px] text-[#7a9083]">Profitable</div>
          <div className="font-tabular mt-0.5 text-sm font-semibold text-emerald-400">
            {summary.profitableCount}
            <span className="text-xs font-normal text-[#63786c]">/{summary.total}</span>
          </div>
        </div>
        <div className="rounded-xl border border-[#1d2b24] bg-[#101814] px-3 py-2.5">
          <div className="truncate text-[11px] text-[#7a9083]">Top Margin</div>
          <div className="mt-0.5 truncate">
            {summary.best ? (
              <CoinDisplay copper={summary.best.netProfit} showSign tone="profit" size="sm" />
            ) : (
              <span className="font-tabular text-xs text-[#63786c]">—</span>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-[#1d2b24] bg-[#101814] px-3 py-2.5">
          <div className="truncate text-[11px] text-[#7a9083]">Fastest Payoff</div>
          <div className="font-tabular mt-0.5 truncate text-xs font-semibold text-[#e7ece8]">
            {summary.fastestBe ? (
              <>
                <span className="text-emerald-400">{summary.fastestBe.breakEvenCrafts}×</span>{' '}
                <span className="font-sans font-normal text-[#8fa196]">
                  {summary.fastestBe.recipe.name.replace(/^Elixir of (the )?/, '')}
                </span>
              </>
            ) : (
              '—'
            )}
          </div>
        </div>
      </div>

      {/* Search + Sort + Action Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#63786c]" />
          <input
            id="flips-search-input"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search potions, herbs, zones, vendors..."
            className="w-full rounded-xl border border-[#223029] bg-[#101814] py-2.5 pl-9 pr-3 text-sm text-[#e7ece8] placeholder:text-[#5d7166] focus:border-emerald-500/60 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7a9083]" />
            <select
              id="flips-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort recipes"
              className="w-full appearance-none rounded-xl border border-[#223029] bg-[#101814] py-2.5 pl-8 pr-7 text-xs font-medium text-[#d5e0d9] focus:border-emerald-500/60 focus:outline-none sm:w-44"
            >
              <option value="profit">Sort: Net Profit</option>
              <option value="roi">Sort: ROI %</option>
              <option value="breakEven">Sort: Break-Even</option>
              <option value="skill">Sort: Skill (High-Low)</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>
          </div>
          <button
            id="add-custom-recipe-btn"
            type="button"
            onClick={onOpenCustomModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#283a31] bg-[#15211b] px-3 py-2.5 text-xs font-medium text-emerald-300 transition hover:bg-[#1c2c24]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Custom</span>
          </button>
        </div>
      </div>

      {/* Category Pills + Quick Filter Toggles */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {CATEGORY_TABS.map((cat) => {
            const active = category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-[#101814] text-[#8fa196] hover:bg-[#17231d] hover:text-[#d5e0d9]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFavoritesOnly((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              favoritesOnly
                ? 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                : 'border-[#1f2e26] bg-[#101814] text-[#8fa196] hover:text-[#d5e0d9]'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${favoritesOnly ? 'fill-amber-300' : ''}`} />
            Favs
          </button>
          <button
            type="button"
            onClick={() => setProfitableOnly((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              profitableOnly
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                : 'border-[#1f2e26] bg-[#101814] text-[#8fa196] hover:text-[#d5e0d9]'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Profitable
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-[11px] text-[#6d8276]">
        <span>
          Showing <strong className="font-tabular text-[#b8c8be]">{filteredRecipes.length}</strong>{' '}
          recipes
        </span>
        <span>Tap any card to inspect mats &amp; override G/S/C</span>
      </div>

      {/* Recipe Cards List */}
      {filteredRecipes.length === 0 ? (
        <div className="rounded-2xl border border-[#1d2b24] bg-[#101814] p-8 text-center">
          <p className="text-sm font-medium text-[#c9d6ce]">No recipes match your current filters.</p>
          <p className="mt-1 text-xs text-[#708578]">
            Try clearing search or turning off Profitable / Favorites filters.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredRecipes.map((ev) => {
            const { recipe } = ev;
            const isExpanded = expandedId === recipe.id;
            const isFav = favorites.has(recipe.id);
            const queuedQty = queueQtyMap.get(recipe.id) ?? 0;
            const acqBadge = ACQ_BADGE[recipe.acquisition.type];
            const isProfitable = ev.netProfit > 0;
            const isLoss = ev.netProfit < 0;

            return (
              <article
                key={recipe.id}
                className="overflow-hidden rounded-2xl border border-[#1e2c25] bg-[#111915] transition hover:border-[#2a3d33]"
              >
                {/* Card Summary Header */}
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex min-w-0 items-start gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(recipe.id)}
                        className="mt-0.5 shrink-0 rounded-md p-1 text-[#5e7166] transition hover:bg-[#1c2822] hover:text-amber-300"
                        aria-label={isFav ? `Unfavorite ${recipe.name}` : `Favorite ${recipe.name}`}
                      >
                        <Star
                          className={`h-4 w-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                        className="min-w-0 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="truncate text-sm font-semibold text-[#e7ece8]">
                            {recipe.name}
                          </h3>
                          {recipe.yield > 1 && (
                            <span className="font-tabular rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                              ×{recipe.yield}
                            </span>
                          )}
                          {recipe.isCustom && (
                            <span className="rounded bg-[#1f2e27] px-1.5 py-0.5 text-[10px] font-medium text-[#9eb2a6]">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#7a9083]">
                          <span className="font-tabular">Skill {recipe.skillRequired}</span>
                          <span>·</span>
                          <span className="capitalize">{recipe.category}</span>
                          {recipe.cooldownHours && (
                            <>
                              <span>·</span>
                              <span className="font-tabular text-amber-300/90">
                                {recipe.cooldownHours >= 1
                                  ? `${recipe.cooldownHours}h CD`
                                  : '10m CD'}
                              </span>
                            </>
                          )}
                          {ev.sold24h > 0 && (
                            <>
                              <span>·</span>
                              <span className="font-tabular">{ev.sold24h} sold/24h</span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Profit & ROI right block */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                      className="shrink-0 text-right"
                    >
                      <div
                        className={`inline-flex items-center rounded-lg px-2 py-0.5 ${
                          isProfitable
                            ? 'bg-emerald-500/10'
                            : isLoss
                              ? 'bg-rose-500/10'
                              : 'bg-[#18231d]'
                        }`}
                      >
                        <CoinDisplay copper={ev.netProfit} showSign tone="auto" size="md" />
                      </div>
                      <div
                        className={`font-tabular mt-1 text-[11px] font-medium ${
                          isProfitable
                            ? 'text-emerald-400'
                            : isLoss
                              ? 'text-rose-400'
                              : 'text-[#8fa196]'
                        }`}
                      >
                        {ev.roiPercent >= 0 ? '+' : ''}
                        {ev.roiPercent.toFixed(1)}% ROI
                      </div>
                    </button>
                  </div>

                  {/* Cost / Return / Recipe Break-Even Metrics Bar */}
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#0b110e] px-2.5 py-2 sm:grid-cols-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-[#63786c]">
                        Craft Cost
                      </div>
                      <div className="mt-0.5">
                        <CoinDisplay copper={ev.craftCost} size="xs" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-[#63786c]">
                        Net AH (-5%)
                      </div>
                      <div className="mt-0.5">
                        <CoinDisplay copper={ev.netReturn} size="xs" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-[#63786c]">
                        <span>Recipe</span>
                        <span
                          className={`rounded border px-1 py-[1px] text-[9px] normal-case ${acqBadge.style}`}
                        >
                          {acqBadge.label}
                        </span>
                      </div>
                      <div className="mt-0.5">
                        {ev.recipeCost.costCopper > 0 ? (
                          <CoinDisplay copper={ev.recipeCost.costCopper} size="xs" />
                        ) : (
                          <span className="font-tabular text-[11px] text-emerald-400">Free</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-[#63786c]">
                        Break-Even
                      </div>
                      <div className="font-tabular mt-0.5 text-[11px] font-semibold">
                        {ev.breakEvenCrafts === 0 ? (
                          <span className="text-emerald-400">0 crafts (Free)</span>
                        ) : ev.breakEvenCrafts === null ? (
                          <span className="text-rose-400">No break-even</span>
                        ) : (
                          <span className="text-[#e7ece8]">
                            {ev.breakEvenCrafts.toLocaleString()}{' '}
                            {ev.breakEvenCrafts === 1 ? 'craft' : 'crafts'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Footer Row */}
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#8fa196] transition hover:text-[#e7ece8]"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3.5 w-3.5" />
                          Hide Breakdown
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3.5 w-3.5" />
                          Mats &amp; Recipe Source
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {queuedQty > 0 && (
                        <span className="font-tabular rounded-lg bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                          {queuedQty} queued
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => onAddToQueue(recipe.id, 1)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#26382f] bg-[#16221c] px-2.5 py-1 text-xs font-medium text-[#d5e0d9] transition hover:border-emerald-500/40 hover:text-emerald-300"
                      >
                        <ShoppingBag className="h-3 w-3" />
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddToQueue(recipe.id, 5)}
                        className="font-tabular rounded-lg border border-[#26382f] bg-[#16221c] px-2 py-1 text-xs font-medium text-[#d5e0d9] transition hover:border-emerald-500/40 hover:text-emerald-300"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail Drawer */}
                {isExpanded && (
                  <div className="border-t border-[#1d2b24] bg-[#0c120f] p-3.5 space-y-3.5">
                    {/* Output Item (tappable to override) */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-[#708578]">
                        <span>Output Item (Tap to Override)</span>
                        <span className="font-tabular normal-case">
                          5% AH Cut: -<CoinDisplay copper={ev.ahCut} size="xs" />
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenOverride({
                            itemId: ev.outputPrice.itemId,
                            name: ev.outputPrice.name,
                            currentPrice: ev.outputPrice.unitPrice,
                            isOverridden: ev.outputPrice.isOverridden,
                            ahRecord: priceMap[ev.outputPrice.itemId],
                            subtitle: `Craft output · Yield ×${recipe.yield}`,
                          })
                        }
                        className="flex w-full items-center justify-between rounded-xl border border-[#1f2e26] bg-[#111915] px-3 py-2 text-left transition hover:border-emerald-500/40"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-[#e7ece8]">
                            <span className="truncate">{ev.outputPrice.name}</span>
                            {recipe.yield > 1 && (
                              <span className="font-tabular text-[11px] text-emerald-400">
                                ×{recipe.yield}
                              </span>
                            )}
                            {ev.outputPrice.isOverridden && (
                              <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-300">
                                Override
                              </span>
                            )}
                          </div>
                          <div className="font-tabular mt-0.5 text-[11px] text-[#708578]">
                            Listed: {ev.listed.toLocaleString()} · Sold 24h:{' '}
                            {ev.sold24h.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <CoinDisplay copper={ev.outputPrice.unitPrice} size="sm" />
                            {recipe.yield > 1 && (
                              <div className="text-[10px] text-[#708578]">each</div>
                            )}
                          </div>
                          <Pencil className="h-3.5 w-3.5 text-[#63786c]" />
                        </div>
                      </button>
                    </div>

                    {/* Ingredients List */}
                    <div>
                      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#708578]">
                        Ingredients (Tap Any Mat to Override)
                      </div>
                      <div className="space-y-1.5">
                        {ev.ingredients.map((ing) => (
                          <button
                            key={ing.itemId}
                            type="button"
                            onClick={() =>
                              onOpenOverride({
                                itemId: ing.itemId,
                                name: ing.name,
                                currentPrice: ing.unitPrice,
                                isOverridden: ing.isOverridden,
                                isVendor: ing.isVendor,
                                vendorPrice: getVendorPrice(ing.itemId),
                                ahRecord: priceMap[ing.itemId],
                                subtitle: ing.isVendor
                                  ? 'Sold by Alchemy Supplies vendors'
                                  : `Reagent · ${ing.qty}× needed per craft`,
                              })
                            }
                            className="flex w-full items-center justify-between rounded-xl border border-[#1a2721] bg-[#111915] px-3 py-2 text-left transition hover:border-emerald-500/40"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="font-tabular rounded bg-[#1a2620] px-1.5 py-0.5 text-xs font-semibold text-[#c9d6ce]">
                                {ing.qty}×
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-[#e7ece8]">
                                  <span className="truncate">{ing.name}</span>
                                  {ing.isVendor && (
                                    <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] text-sky-300">
                                      Vendor
                                    </span>
                                  )}
                                  {ing.isOverridden && (
                                    <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-300">
                                      Override
                                    </span>
                                  )}
                                </div>
                                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#708578]">
                                  <span>Unit:</span>
                                  <CoinDisplay copper={ing.unitPrice} size="xs" />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <CoinDisplay copper={ing.lineTotal} size="sm" />
                              <Pencil className="h-3 w-3 text-[#63786c]" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recipe Acquisition & Break-Even Card */}
                    <div className="rounded-xl border border-[#1f2e26] bg-[#111915] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-semibold text-[#e7ece8]">
                                Recipe Acquisition
                              </span>
                              <span
                                className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${acqBadge.style}`}
                              >
                                {acqBadge.label}
                              </span>
                              {recipe.acquisition.reputationStanding && (
                                <span className="rounded bg-teal-500/10 px-1.5 py-0.5 text-[10px] text-teal-300">
                                  {recipe.acquisition.reputationStanding}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-[#c9d6ce]">
                              {recipe.acquisition.sourceLabel}
                            </p>
                            <p className="text-[11px] text-[#7a9083]">
                              {recipe.acquisition.location}
                            </p>
                            {recipe.notes && (
                              <p className="mt-1 text-[11px] text-amber-300/80">{recipe.notes}</p>
                            )}
                          </div>
                        </div>

                        {ev.recipeCost.scrollItemId ? (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenOverride({
                                itemId: ev.recipeCost.scrollItemId!,
                                name: ev.recipeCost.scrollName ?? `Recipe: ${recipe.name}`,
                                currentPrice: ev.recipeCost.costCopper,
                                isOverridden: ev.recipeCost.isOverridden,
                                ahRecord: priceMap[ev.recipeCost.scrollItemId!],
                                subtitle: 'Live AH Recipe Scroll (/category/recipe/alchemy)',
                              })
                            }
                            className="shrink-0 rounded-lg border border-[#283a31] bg-[#16221c] px-2.5 py-1.5 text-right transition hover:border-amber-400/50"
                          >
                            <div className="flex items-center justify-end gap-1 text-[10px] text-amber-300">
                              <span>{ev.recipeCost.isOverridden ? 'Override' : 'AH Scroll'}</span>
                              <Pencil className="h-2.5 w-2.5" />
                            </div>
                            <div className="mt-0.5">
                              {ev.recipeCost.costCopper > 0 ? (
                                <CoinDisplay copper={ev.recipeCost.costCopper} size="sm" />
                              ) : (
                                <span className="font-tabular text-xs text-[#708578]">No AH data</span>
                              )}
                            </div>
                          </button>
                        ) : (
                          <div className="shrink-0 text-right">
                            <div className="text-[10px] text-[#708578]">Fixed Cost</div>
                            <div className="mt-0.5">
                              {ev.recipeCost.costCopper > 0 ? (
                                <CoinDisplay copper={ev.recipeCost.costCopper} size="sm" />
                              ) : (
                                <span className="font-tabular text-xs font-medium text-emerald-400">
                                  Free
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between border-t border-[#1c2922] pt-2 text-[11px]">
                        <span className="text-[#8fa196]">Crafts to Break Even</span>
                        <span className="font-tabular font-semibold">
                          {ev.breakEvenCrafts === 0 ? (
                            <span className="text-emerald-400">0 crafts (Free recipe)</span>
                          ) : ev.breakEvenCrafts === null ? (
                            <span className="text-rose-400">No break-even (negative margin)</span>
                          ) : (
                            <span className="text-emerald-300">
                              {ev.breakEvenCrafts.toLocaleString()} crafts
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {recipe.isCustom && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onDeleteCustomRecipe(recipe.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-500/25 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Custom Recipe
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
