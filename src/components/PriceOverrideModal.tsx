import { useEffect, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import type { AhItemPrice } from '../../shared/types';
import { splitCopper, toCopper } from '../lib/currency';
import { CoinDisplay } from './CoinDisplay';

export interface PriceOverrideTarget {
  itemId: number;
  name: string;
  currentPrice: number;
  isOverridden: boolean;
  isVendor?: boolean;
  vendorPrice?: number;
  ahRecord?: AhItemPrice;
  subtitle?: string;
}

interface PriceOverrideModalProps {
  target: PriceOverrideTarget | null;
  onClose: () => void;
  onSave: (itemId: number, copperPrice: number) => void;
  onClear: (itemId: number) => void;
}

export function PriceOverrideModal({
  target,
  onClose,
  onSave,
  onClear,
}: PriceOverrideModalProps) {
  const [gold, setGold] = useState('0');
  const [silver, setSilver] = useState('0');
  const [copper, setCopper] = useState('0');

  useEffect(() => {
    if (!target) return;
    const parts = splitCopper(target.currentPrice);
    setGold(String(parts.gold));
    setSilver(String(parts.silver));
    setCopper(String(parts.copper));
  }, [target]);

  if (!target) return null;

  const previewCopper = toCopper(Number(gold), Number(silver), Number(copper));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(target.itemId, previewCopper);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-xs sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="override-modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#24342c] bg-[#111915] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">
              Temporary Price Override
            </p>
            <h2
              id="override-modal-title"
              className="mt-0.5 text-base font-semibold text-[#e7ece8]"
            >
              {target.name}
            </h2>
            {target.subtitle && (
              <p className="mt-0.5 text-xs text-[#8fa196]">{target.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8fa196] transition hover:bg-[#1c2822] hover:text-[#e7ece8]"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Market reference stats */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-[#1d2b24] bg-[#0b110e] p-3 text-xs">
          {target.isVendor && target.vendorPrice !== undefined ? (
            <div className="col-span-2 flex items-center justify-between">
              <span className="text-[#8fa196]">NPC Vendor Price</span>
              <CoinDisplay copper={target.vendorPrice} size="sm" />
            </div>
          ) : (
            <>
              <div>
                <div className="text-[11px] text-[#708578]">Min Buyout</div>
                <div className="mt-0.5">
                  {target.ahRecord && target.ahRecord.minBuyout > 0 ? (
                    <CoinDisplay copper={target.ahRecord.minBuyout} size="sm" />
                  ) : (
                    <span className="font-tabular text-[#5e7166]">—</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#708578]">Market Price</div>
                <div className="mt-0.5">
                  {target.ahRecord && target.ahRecord.marketPrice > 0 ? (
                    <CoinDisplay copper={target.ahRecord.marketPrice} size="sm" />
                  ) : (
                    <span className="font-tabular text-[#5e7166]">—</span>
                  )}
                </div>
              </div>
              {target.ahRecord && (
                <>
                  <div className="text-[11px] text-[#708578]">
                    Listed:{' '}
                    <span className="font-tabular text-[#c9d6ce]">
                      {target.ahRecord.listed.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#708578]">
                    Sold 24h:{' '}
                    <span className="font-tabular text-[#c9d6ce]">
                      {target.ahRecord.sold24h.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#eab308]">Gold (g)</span>
              <input
                type="number"
                min={0}
                max={99999}
                inputMode="numeric"
                value={gold}
                onChange={(e) => setGold(e.target.value)}
                className="font-tabular w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-3 py-2.5 text-sm text-[#e7ece8] focus:border-emerald-500/60 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#cbd5e1]">Silver (s)</span>
              <input
                type="number"
                min={0}
                max={99}
                inputMode="numeric"
                value={silver}
                onChange={(e) => setSilver(e.target.value)}
                className="font-tabular w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-3 py-2.5 text-sm text-[#e7ece8] focus:border-emerald-500/60 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#d97742]">Copper (c)</span>
              <input
                type="number"
                min={0}
                max={99}
                inputMode="numeric"
                value={copper}
                onChange={(e) => setCopper(e.target.value)}
                className="font-tabular w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-3 py-2.5 text-sm text-[#e7ece8] focus:border-emerald-500/60 focus:outline-none"
              />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#0b110e] px-3 py-2 text-xs">
            <span className="text-[#8fa196]">Override Preview</span>
            <CoinDisplay copper={previewCopper} size="md" />
          </div>

          <div className="flex items-center gap-2 pt-1">
            {target.isOverridden && (
              <button
                type="button"
                onClick={() => {
                  onClear(target.itemId);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#2b3c33] bg-[#16211c] px-3.5 py-2.5 text-xs font-medium text-[#cbd5e1] transition hover:bg-[#1f2e27]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#05140d] transition hover:bg-emerald-400 active:scale-[0.99]"
            >
              Apply Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
