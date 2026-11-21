import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import type { CharacterCooldown } from '../../shared/types';
import type { EvaluatedRecipe } from '../lib/alchemyMath';
import { formatCountdown } from '../lib/currency';
import { CoinDisplay } from './CoinDisplay';

interface CooldownsTabProps {
  cooldowns: CharacterCooldown[];
  evaluatedRecipes: EvaluatedRecipe[];
  onAddCharacter: (name: string, className: string) => void;
  onRemoveCharacter: (id: string) => void;
  onSetCooldown: (
    id: string,
    kind: 'arcanite' | 'essence',
    readyAtMs: number | null
  ) => void;
}

const ARCANITE_MS = 48 * 60 * 60 * 1000; // 48 hours
const ESSENCE_MS = 24 * 60 * 60 * 1000; // 24 hours

const WOW_CLASSES = [
  'Mage',
  'Warlock',
  'Priest',
  'Druid',
  'Shaman',
  'Paladin',
  'Rogue',
  'Hunter',
  'Warrior',
];

export function CooldownsTab({
  cooldowns,
  evaluatedRecipes,
  onAddCharacter,
  onRemoveCharacter,
  onSetCooldown,
}: CooldownsTabProps) {
  const [now, setNow] = useState(() => Date.now());
  const [charName, setCharName] = useState('');
  const [charClass, setCharClass] = useState('Mage');

  // Live 1-second countdown ticker
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const transmuteReference = useMemo(() => {
    const arcanite = evaluatedRecipes.find((r) => r.recipe.id === 'transmute-arcanite');
    const essences = evaluatedRecipes
      .filter(
        (r) =>
          r.recipe.category === 'transmute' &&
          r.recipe.cooldownHours === 24 &&
          r.recipe.id !== 'transmute-mithril-to-truesilver'
      )
      .sort((a, b) => b.netProfit - a.netProfit);
    return {
      arcanite,
      bestEssence: essences[0],
    };
  }, [evaluatedRecipes]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = charName.trim();
    if (!trimmed) return;
    onAddCharacter(trimmed, charClass);
    setCharName('');
  };

  return (
    <section className="space-y-4">
      {/* Live Transmute Profit Benchmark */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#1f2e26] bg-[#111915] p-3.5">
          <div className="flex items-center justify-between text-[11px] text-[#7a9083]">
            <span>Arcanite Bar (48h CD)</span>
            <span className="font-tabular text-amber-300">2-day cycle</span>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-xs font-medium text-[#d5e0d9]">Est. Transmute Profit</span>
            {transmuteReference.arcanite ? (
              <CoinDisplay
                copper={transmuteReference.arcanite.netProfit}
                showSign
                tone="auto"
                size="md"
              />
            ) : (
              <span className="font-tabular text-xs text-[#63786c]">—</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#1f2e26] bg-[#111915] p-3.5">
          <div className="flex items-center justify-between text-[11px] text-[#7a9083]">
            <span>Best Essence (24h CD)</span>
            <span className="font-tabular text-emerald-300">Daily cycle</span>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between gap-2">
            <span className="truncate text-xs font-medium text-[#d5e0d9]">
              {transmuteReference.bestEssence
                ? transmuteReference.bestEssence.recipe.name.replace('Transmute: ', '')
                : 'Essence Transmute'}
            </span>
            {transmuteReference.bestEssence ? (
              <CoinDisplay
                copper={transmuteReference.bestEssence.netProfit}
                showSign
                tone="auto"
                size="md"
              />
            ) : (
              <span className="font-tabular text-xs text-[#63786c]">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Add Alchemist Alt Form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-2 rounded-2xl border border-[#1e2c25] bg-[#111915] p-3.5 sm:flex-row sm:items-center"
      >
        <input
          type="text"
          value={charName}
          onChange={(e) => setCharName(e.target.value)}
          placeholder="Add alchemist alt name..."
          className="flex-1 rounded-xl border border-[#25352d] bg-[#0b110e] px-3 py-2 text-sm text-[#e7ece8] placeholder:text-[#5b6f64] focus:border-emerald-500/60 focus:outline-none"
        />
        <div className="flex items-center gap-2">
          <select
            value={charClass}
            onChange={(e) => setCharClass(e.target.value)}
            aria-label="Character class"
            className="flex-1 rounded-xl border border-[#25352d] bg-[#0b110e] px-3 py-2 text-xs text-[#d5e0d9] sm:w-28"
          >
            {WOW_CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-[#05140d] transition hover:bg-emerald-400"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Alt
          </button>
        </div>
      </form>

      {/* Character Cooldown Cards */}
      {cooldowns.length === 0 ? (
        <div className="rounded-2xl border border-[#1e2c25] bg-[#111915] p-8 text-center text-xs text-[#8fa196]">
          Add your alchemist characters above to track 48h Arcanite and 24h Essence transmutes.
        </div>
      ) : (
        <div className="space-y-3">
          {cooldowns.map((char) => {
            const arcRemaining = char.arcaniteReadyAt ? Math.max(0, char.arcaniteReadyAt - now) : 0;
            const essRemaining = char.essenceReadyAt ? Math.max(0, char.essenceReadyAt - now) : 0;
            const arcReady = arcRemaining <= 0;
            const essReady = essRemaining <= 0;
            const arcProgress = arcReady
              ? 100
              : Math.min(100, Math.max(0, ((ARCANITE_MS - arcRemaining) / ARCANITE_MS) * 100));
            const essProgress = essReady
              ? 100
              : Math.min(100, Math.max(0, ((ESSENCE_MS - essRemaining) / ESSENCE_MS) * 100));

            return (
              <article
                key={char.id}
                className="rounded-2xl border border-[#1e2c25] bg-[#111915] p-4 space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#e7ece8]">{char.name}</h3>
                    {char.className && (
                      <span className="rounded-md bg-[#18241e] px-2 py-0.5 text-[11px] text-[#9eb2a6]">
                        {char.className}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveCharacter(char.id)}
                    className="rounded-lg p-1.5 text-[#667a6e] transition hover:bg-rose-500/10 hover:text-rose-400"
                    aria-label={`Remove ${char.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Timers Grid */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {/* 48h Arcanite Transmute */}
                  <div className="rounded-xl border border-[#1d2b24] bg-[#0b110e] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-xs font-medium text-[#d5e0d9]">Arcanite (48h)</span>
                      </div>
                      <span
                        className={`font-tabular inline-flex items-center gap-1 text-xs font-bold ${
                          arcReady ? 'text-emerald-400' : 'text-amber-300'
                        }`}
                      >
                        {arcReady ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            READY
                          </>
                        ) : (
                          <>
                            <Clock className="h-3.5 w-3.5" />
                            {formatCountdown(arcRemaining)}
                          </>
                        )}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#18241e]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          arcReady ? 'bg-emerald-500' : 'bg-amber-400/80'
                        }`}
                        style={{ width: `${arcProgress}%` }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onSetCooldown(char.id, 'arcanite', Date.now() + ARCANITE_MS)}
                        className="flex-1 rounded-lg border border-[#273830] bg-[#15211b] px-2.5 py-1.5 text-[11px] font-medium text-[#d5e0d9] transition hover:border-emerald-500/40 hover:text-emerald-300"
                      >
                        Start 48h CD
                      </button>
                      {!arcReady && (
                        <button
                          type="button"
                          onClick={() => onSetCooldown(char.id, 'arcanite', null)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#273830] bg-[#111915] px-2.5 py-1.5 text-[11px] font-medium text-[#8fa196] transition hover:text-[#e7ece8]"
                          title="Mark Ready"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Ready
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 24h Essence Transmute */}
                  <div className="rounded-xl border border-[#1d2b24] bg-[#0b110e] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                        <span className="text-xs font-medium text-[#d5e0d9]">Essence (24h)</span>
                      </div>
                      <span
                        className={`font-tabular inline-flex items-center gap-1 text-xs font-bold ${
                          essReady ? 'text-emerald-400' : 'text-teal-300'
                        }`}
                      >
                        {essReady ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            READY
                          </>
                        ) : (
                          <>
                            <Clock className="h-3.5 w-3.5" />
                            {formatCountdown(essRemaining)}
                          </>
                        )}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#18241e]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          essReady ? 'bg-emerald-500' : 'bg-teal-400/80'
                        }`}
                        style={{ width: `${essProgress}%` }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onSetCooldown(char.id, 'essence', Date.now() + ESSENCE_MS)}
                        className="flex-1 rounded-lg border border-[#273830] bg-[#15211b] px-2.5 py-1.5 text-[11px] font-medium text-[#d5e0d9] transition hover:border-emerald-500/40 hover:text-emerald-300"
                      >
                        Start 24h CD
                      </button>
                      {!essReady && (
                        <button
                          type="button"
                          onClick={() => onSetCooldown(char.id, 'essence', null)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#273830] bg-[#111915] px-2.5 py-1.5 text-[11px] font-medium text-[#8fa196] transition hover:text-[#e7ece8]"
                          title="Mark Ready"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Ready
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
