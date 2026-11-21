import { Check, Minus, Pencil, Plus, RotateCcw, ShoppingBag, Trash2 } from 'lucide-react';
import type { AhItemPrice, QueueEntry } from '../../shared/types';
import { getVendorPrice } from '../data/items';
import type { EvaluatedRecipe, ShoppingListSummary } from '../lib/alchemyMath';
import { CoinDisplay } from './CoinDisplay';
import type { PriceOverrideTarget } from './PriceOverrideModal';

interface QueueTabProps {
  queue: QueueEntry[];
  evaluatedById: Map<string, EvaluatedRecipe>;
  shoppingSummary: ShoppingListSummary;
  priceMap: Record<number, AhItemPrice>;
  onUpdateQty: (recipeId: string, newQty: number) => void;
  onRemoveEntry: (recipeId: string) => void;
  onClearQueue: () => void;
  onToggleChecked: (itemId: number) => void;
  onResetChecks: () => void;
  onOpenOverride: (target: PriceOverrideTarget) => void;
  onJumpToFlips: () => void;
}

export function QueueTab({
  queue,
  evaluatedById,
  shoppingSummary,
  priceMap,
  onUpdateQty,
  onRemoveEntry,
  onClearQueue,
  onToggleChecked,
  onResetChecks,
  onOpenOverride,
  onJumpToFlips,
}: QueueTabProps) {
  const checkedCount = shoppingSummary.items.filter((i) => i.checked).length;
  const ahMats = shoppingSummary.items.filter((i) => !i.isVendor);
  const vendorVials = shoppingSummary.items.filter((i) => i.isVendor);

  if (queue.length === 0) {
    return (
      <section className="rounded-2xl border border-[#1e2c25] bg-[#111915] px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#18251f] text-emerald-400">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-[#e7ece8]">
          Your Crafting Queue is Empty
        </h2>
        <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-[#8fa196]">
          Add profitable potions, elixirs, or flasks from the Flips tab to automatically aggregate
          your herbs, vials, total spend, and expected AH profit.
        </p>
        <button
          type="button"
          onClick={onJumpToFlips}
          className="mt-5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-[#05140d] transition hover:bg-emerald-400"
        >
          Browse Profitable Flips
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Totals Summary Bar */}
      <div className="rounded-2xl border border-[#1f2e26] bg-[#111915] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#708578]">
              Batch Projection ({shoppingSummary.totalCrafts} crafts)
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <CoinDisplay
                copper={shoppingSummary.totalNetProfit}
                showSign
                tone="auto"
                size="lg"
              />
              <span
                className={`font-tabular text-xs font-semibold ${
                  shoppingSummary.totalNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ({shoppingSummary.totalRoiPercent >= 0 ? '+' : ''}
                {shoppingSummary.totalRoiPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearQueue}
            className="inline-flex items-center gap-1 rounded-lg border border-[#2a3b32] bg-[#16221c] px-2.5 py-1.5 text-xs font-medium text-[#a3b5aa] transition hover:border-rose-500/30 hover:text-rose-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#0b110e] p-2.5 text-xs">
          <div>
            <div className="text-[10px] uppercase text-[#63786c]">Total Cost</div>
            <div className="mt-0.5">
              <CoinDisplay copper={shoppingSummary.totalCraftCost} size="xs" />
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-[#63786c]">Net AH (-5%)</div>
            <div className="mt-0.5">
              <CoinDisplay copper={shoppingSummary.totalNetReturn} size="xs" />
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-[#63786c]">5% AH Cut</div>
            <div className="mt-0.5">
              <CoinDisplay copper={shoppingSummary.totalAhCut} size="xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Queued Recipes */}
      <div className="space-y-2">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-[#7a9083]">
          Queued Crafts ({queue.length})
        </h2>
        {queue.map((entry) => {
          const ev = evaluatedById.get(entry.recipeId);
          if (!ev) return null;
          const batchProfit = ev.netProfit * entry.quantity;
          return (
            <div
              key={entry.recipeId}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#1e2c25] bg-[#111915] px-3.5 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium text-[#e7ece8]">
                    {ev.recipe.name}
                  </span>
                  {ev.recipe.yield > 1 && (
                    <span className="font-tabular text-[11px] text-emerald-400">
                      → {ev.recipe.yield * entry.quantity} items
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#7a9083]">
                  <span>Batch Profit:</span>
                  <CoinDisplay copper={batchProfit} showSign tone="auto" size="xs" />
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateQty(entry.recipeId, entry.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#25352d] bg-[#0b110e] text-[#cbd5e1] hover:border-emerald-500/40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={entry.quantity}
                  onChange={(e) =>
                    onUpdateQty(entry.recipeId, Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="font-tabular h-8 w-14 rounded-lg border border-[#25352d] bg-[#0b110e] text-center text-xs font-semibold text-[#e7ece8] focus:border-emerald-500/60 focus:outline-none"
                  aria-label={`Quantity for ${ev.recipe.name}`}
                />
                <button
                  type="button"
                  onClick={() => onUpdateQty(entry.recipeId, entry.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#25352d] bg-[#0b110e] text-[#cbd5e1] hover:border-emerald-500/40"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateQty(entry.recipeId, entry.quantity + 5)}
                  className="font-tabular h-8 rounded-lg border border-[#25352d] bg-[#15201b] px-2 text-[11px] font-medium text-[#c9d6ce] hover:border-emerald-500/40"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveEntry(entry.recipeId)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6d8276] hover:bg-rose-500/10 hover:text-rose-400"
                  aria-label={`Remove ${ev.recipe.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aggregated Shopping List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#7a9083]">
            Shopping List ({checkedCount}/{shoppingSummary.items.length} collected)
          </h2>
          {checkedCount > 0 && (
            <button
              type="button"
              onClick={onResetChecks}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8fa196] hover:text-[#e7ece8]"
            >
              <RotateCcw className="h-3 w-3" />
              Uncheck All
            </button>
          )}
        </div>

        {[
          { title: 'Auction House Materials', list: ahMats },
          { title: 'NPC Vendor Vials', list: vendorVials },
        ].map(
          (group) =>
            group.list.length > 0 && (
              <div
                key={group.title}
                className="overflow-hidden rounded-2xl border border-[#1e2c25] bg-[#111915]"
              >
                <div className="border-b border-[#1b2721] bg-[#0e1511] px-3.5 py-2 text-[11px] font-medium text-[#8fa196]">
                  {group.title}
                </div>
                <div className="divide-y divide-[#1a2620]">
                  {group.list.map((mat) => (
                    <div
                      key={mat.itemId}
                      className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 transition ${
                        mat.checked ? 'opacity-50' : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onToggleChecked(mat.itemId)}
                        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                            mat.checked
                              ? 'border-emerald-500 bg-emerald-500 text-[#05140d]'
                              : 'border-[#2f4238] bg-[#0b110e]'
                          }`}
                        >
                          {mat.checked && <Check className="h-3.5 w-3.5 stroke-[2.75]" />}
                        </span>
                        <span className="font-tabular shrink-0 rounded bg-[#18241e] px-1.5 py-0.5 text-xs font-semibold text-emerald-300">
                          {mat.totalQty}×
                        </span>
                        <div className="min-w-0">
                          <div
                            className={`truncate text-xs font-medium ${
                              mat.checked ? 'line-through text-[#7a9083]' : 'text-[#e7ece8]'
                            }`}
                          >
                            {mat.name}
                          </div>
                          <div className="truncate text-[10px] text-[#6d8276]">
                            For: {mat.usedBy.slice(0, 2).join(', ')}
                            {mat.usedBy.length > 2 ? ` +${mat.usedBy.length - 2}` : ''}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onOpenOverride({
                            itemId: mat.itemId,
                            name: mat.name,
                            currentPrice: mat.unitPrice,
                            isOverridden: mat.isOverridden,
                            isVendor: mat.isVendor,
                            vendorPrice: getVendorPrice(mat.itemId),
                            ahRecord: priceMap[mat.itemId],
                            subtitle: `Need ${mat.totalQty}× for crafting queue`,
                          })
                        }
                        className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-right transition hover:bg-[#192620]"
                      >
                        <div>
                          <CoinDisplay copper={mat.lineTotal} size="sm" />
                          <div className="flex items-center justify-end gap-1 text-[10px] text-[#708578]">
                            {mat.isOverridden && (
                              <span className="text-amber-300">OVR</span>
                            )}
                            <CoinDisplay copper={mat.unitPrice} size="xs" />
                            <span>ea</span>
                          </div>
                        </div>
                        <Pencil className="h-3 w-3 text-[#63786c]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </section>
  );
}
