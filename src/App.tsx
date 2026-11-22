import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  FlaskConical,
  RefreshCw,
  Settings,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import type {
  AlchemyRecipe,
  CharacterCooldown,
  PriceMode,
  PricesApiResponse,
  QueueEntry,
  RealmSettings,
} from '../shared/types';
import { buildMockPrices } from '../shared/mockPrices';
import { buildWowfahBaseUrl } from '../shared/wowfah';
import { CLASSIC_ALCHEMY_RECIPES } from './data/recipes';
import {
  aggregateShoppingList,
  evaluateRecipe,
  type EvaluatedRecipe,
} from './lib/alchemyMath';
import { formatRelativeTime } from './lib/currency';
import { storage } from './lib/storage';
import { CooldownsTab } from './components/CooldownsTab';
import { CustomRecipeModal } from './components/CustomRecipeModal';
import { FlipsTab } from './components/FlipsTab';
import {
  PriceOverrideModal,
  type PriceOverrideTarget,
} from './components/PriceOverrideModal';
import { QueueTab } from './components/QueueTab';
import { SettingsTab } from './components/SettingsTab';

type TabId = 'flips' | 'queue' | 'cooldowns' | 'settings';

function createInitialFallbackResponse(realm: RealmSettings): PricesApiResponse {
  const items = buildMockPrices(realm);
  const now = Date.now();
  return {
    source: 'fallback',
    realm,
    upstreamBaseUrl: buildWowfahBaseUrl(realm),
    fetchedAt: now,
    snapshotAt: Math.floor(now / 1000),
    itemCount: Object.keys(items).length,
    items,
    categoriesFetched: 0,
    categoriesTotal: 10,
  };
}

export function App() {
  const initialSettings = useMemo(() => storage.loadSettings(), []);

  const [activeTab, setActiveTab] = useState<TabId>('flips');
  const [realm, setRealm] = useState<RealmSettings>(initialSettings.realm);
  const [priceMode, setPriceMode] = useState<PriceMode>(initialSettings.priceMode);
  const [priceData, setPriceData] = useState<PricesApiResponse>(
    () => storage.loadPriceCache() ?? createInitialFallbackResponse(initialSettings.realm)
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  const [overrides, setOverrides] = useState<Record<number, number>>(() =>
    storage.loadOverrides()
  );
  const [queue, setQueue] = useState<QueueEntry[]>(() => storage.loadQueue());
  const [shoppingChecked, setShoppingChecked] = useState<Record<number, boolean>>(() =>
    storage.loadShoppingChecked()
  );
  const [customRecipes, setCustomRecipes] = useState<AlchemyRecipe[]>(() =>
    storage.loadCustomRecipes()
  );
  const [favorites, setFavorites] = useState<string[]>(() => storage.loadFavorites());
  const [cooldowns, setCooldowns] = useState<CharacterCooldown[]>(() =>
    storage.loadCooldowns()
  );

  const [overrideTarget, setOverrideTarget] = useState<PriceOverrideTarget | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Persist user state automatically to localStorage
  useEffect(() => {
    storage.saveSettings({ realm, priceMode });
  }, [realm, priceMode]);

  useEffect(() => {
    storage.saveOverrides(overrides);
  }, [overrides]);

  useEffect(() => {
    storage.saveQueue(queue);
  }, [queue]);

  useEffect(() => {
    storage.saveShoppingChecked(shoppingChecked);
  }, [shoppingChecked]);

  useEffect(() => {
    storage.saveCustomRecipes(customRecipes);
  }, [customRecipes]);

  useEffect(() => {
    storage.saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    storage.saveCooldowns(cooldowns);
  }, [cooldowns]);

  // Refresh "last synced" label every 30s
  useEffect(() => {
    const id = window.setInterval(() => setNowTick(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const syncPrices = useCallback(
    async (targetRealm: RealmSettings, forceRefresh = false) => {
      setIsSyncing(true);
      setSyncError(null);
      try {
        const params = new URLSearchParams({
          region: targetRealm.region,
          ruleset: targetRealm.ruleset,
          faction: targetRealm.faction,
        });
        if (forceRefresh) {
          params.set('refresh', '1');
        }
        const res = await fetch(`/api/prices?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Sync failed (${res.status})`);
        }
        const data = (await res.json()) as PricesApiResponse;
        if (data && data.items && Object.keys(data.items).length > 0) {
          setPriceData(data);
          storage.savePriceCache(data);
          setNowTick(Date.now());
        }
      } catch (err) {
        setSyncError(
          err instanceof Error ? err.message : 'Unable to reach /api/prices — using cached prices'
        );
      } finally {
        setIsSyncing(false);
      }
    },
    []
  );

  // Initial background sync on mount if cache is missing, fallback, stale (>20m), or different realm
  useEffect(() => {
    const cached = storage.loadPriceCache();
    const isStale =
      !cached ||
      cached.source !== 'live' ||
      Date.now() - cached.fetchedAt > 20 * 60 * 1000 ||
      cached.realm.region !== realm.region ||
      cached.realm.ruleset !== realm.ruleset ||
      cached.realm.faction !== realm.faction;
    if (isStale) {
      void syncPrices(realm, false);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Automatic background sync every 30 minutes (guarantees at least hourly live updates)
  // plus immediate sync when returning to the tab if data is >30m old
  useEffect(() => {
    const AUTO_SYNC_MS = 30 * 60 * 1000;
    const intervalId = window.setInterval(() => {
      void syncPrices(realm, false);
    }, AUTO_SYNC_MS);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const ageMs = Date.now() - priceData.fetchedAt;
        if (priceData.source !== 'live' || ageMs >= AUTO_SYNC_MS) {
          void syncPrices(realm, false);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [realm, priceData.fetchedAt, priceData.source, syncPrices]);

  const allRecipes = useMemo(
    () => [...customRecipes, ...CLASSIC_ALCHEMY_RECIPES],
    [customRecipes]
  );

  const evaluatedRecipes = useMemo<EvaluatedRecipe[]>(
    () =>
      allRecipes.map((recipe) =>
        evaluateRecipe(recipe, priceData.items, priceMode, overrides)
      ),
    [allRecipes, priceData.items, priceMode, overrides]
  );

  const evaluatedById = useMemo(() => {
    const map = new Map<string, EvaluatedRecipe>();
    for (const ev of evaluatedRecipes) {
      map.set(ev.recipe.id, ev);
    }
    return map;
  }, [evaluatedRecipes]);

  const shoppingSummary = useMemo(
    () =>
      aggregateShoppingList(
        queue,
        allRecipes,
        priceData.items,
        priceMode,
        overrides,
        shoppingChecked
      ),
    [queue, allRecipes, priceData.items, priceMode, overrides, shoppingChecked]
  );

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const readyCooldownCount = useMemo(() => {
    let count = 0;
    for (const c of cooldowns) {
      if (!c.arcaniteReadyAt || c.arcaniteReadyAt <= nowTick) count++;
      if (!c.essenceReadyAt || c.essenceReadyAt <= nowTick) count++;
    }
    return count;
  }, [cooldowns, nowTick]);

  // Handlers
  const handleToggleFavorite = (recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleAddToQueue = (recipeId: string, delta: number) => {
    setQueue((prev) => {
      const existing = prev.find((e) => e.recipeId === recipeId);
      if (existing) {
        return prev.map((e) =>
          e.recipeId === recipeId ? { ...e, quantity: e.quantity + delta } : e
        );
      }
      return [...prev, { recipeId, quantity: Math.max(1, delta) }];
    });
  };

  const handleUpdateQueueQty = (recipeId: string, newQty: number) => {
    if (newQty <= 0) {
      setQueue((prev) => prev.filter((e) => e.recipeId !== recipeId));
      return;
    }
    setQueue((prev) =>
      prev.map((e) => (e.recipeId === recipeId ? { ...e, quantity: newQty } : e))
    );
  };

  const handleRemoveQueueEntry = (recipeId: string) => {
    setQueue((prev) => prev.filter((e) => e.recipeId !== recipeId));
  };

  const handleClearQueue = () => {
    setQueue([]);
    setShoppingChecked({});
  };

  const handleToggleChecked = (itemId: number) => {
    setShoppingChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleSaveOverride = (itemId: number, copper: number) => {
    setOverrides((prev) => ({ ...prev, [itemId]: copper }));
  };

  const handleClearOverride = (itemId: number) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleCreateCustomRecipe = (
    recipe: AlchemyRecipe,
    initialOutputOverrideCopper?: number
  ) => {
    setCustomRecipes((prev) => [recipe, ...prev]);
    if (initialOutputOverrideCopper !== undefined && initialOutputOverrideCopper > 0) {
      setOverrides((prev) => ({
        ...prev,
        [recipe.outputItemId]: initialOutputOverrideCopper,
      }));
    }
  };

  const handleDeleteCustomRecipe = (recipeId: string) => {
    setCustomRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    setQueue((prev) => prev.filter((q) => q.recipeId !== recipeId));
    setFavorites((prev) => prev.filter((f) => f !== recipeId));
  };

  const handleAddCharacter = (name: string, className: string) => {
    setCooldowns((prev) => [
      ...prev,
      {
        id: `alt-${Date.now()}`,
        name,
        className,
        arcaniteReadyAt: null,
        essenceReadyAt: null,
      },
    ]);
  };

  const handleRemoveCharacter = (id: string) => {
    setCooldowns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSetCooldown = (
    id: string,
    kind: 'arcanite' | 'essence',
    readyAtMs: number | null
  ) => {
    setCooldowns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return kind === 'arcanite'
          ? { ...c, arcaniteReadyAt: readyAtMs }
          : { ...c, essenceReadyAt: readyAtMs };
      })
    );
  };

  const handleSaveRealmAndSync = (nextRealm: RealmSettings) => {
    setRealm(nextRealm);
    void syncPrices(nextRealm, true);
  };

  const handleClearCache = () => {
    storage.clearPriceCache();
    setPriceData(createInitialFallbackResponse(realm));
  };

  const overrideCount = Object.keys(overrides).length;
  const realmBadge = `${realm.region.toUpperCase()} · ${realm.ruleset.toUpperCase()} · ${
    realm.faction.charAt(0).toUpperCase() + realm.faction.slice(1)
  }`;

  const navItems: Array<{
    id: TabId;
    label: string;
    icon: typeof TrendingUp;
    badge?: number;
  }> = [
    { id: 'flips', label: 'Flips', icon: TrendingUp },
    { id: 'queue', label: 'Queue', icon: ShoppingBag, badge: shoppingSummary.totalCrafts || undefined },
    { id: 'cooldowns', label: 'Cooldowns', icon: Clock, badge: readyCooldownCount || undefined },
    { id: 'settings', label: 'Settings', icon: Settings, badge: overrideCount || undefined },
  ];

  return (
    <div className="min-h-dvh bg-[#090d0b] text-[#e7ece8]">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-[#1b2721] bg-[#090d0b]/95 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-3.5 py-2.5 sm:px-5">
          <div className="flex items-center justify-between gap-2">
            {/* Brand & Active Realm */}
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#24362d] bg-[#121d17] text-emerald-400">
                <FlaskConical className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold tracking-tight text-[#e7ece8]">ALCH.GG</h1>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="font-tabular truncate rounded-md border border-[#22322a] bg-[#111915] px-1.5 py-0.5 text-[10px] font-medium text-[#9eb2a6] transition hover:border-emerald-500/40 hover:text-emerald-300"
                    title="Change wowfah.com realm"
                  >
                    {realmBadge}
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#708578]">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      priceData.source === 'live' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {priceData.source === 'live' ? 'Live AH' : 'Fallback AH'} ·{' '}
                    <span className="font-tabular">
                      {formatRelativeTime(priceData.fetchedAt, nowTick)}
                    </span>
                  </span>
                  {overrideCount > 0 && (
                    <span className="font-tabular text-amber-300">· {overrideCount} ovr</span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Mode Toggle & Manual Sync */}
            <div className="flex shrink-0 items-center gap-1.5">
              <div
                className="inline-flex rounded-xl border border-[#213028] bg-[#101814] p-0.5"
                role="group"
                aria-label="AH Price Basis"
              >
                <button
                  id="price-mode-min"
                  type="button"
                  onClick={() => setPriceMode('minBuyout')}
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                    priceMode === 'minBuyout'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-[#7a9083] hover:text-[#d5e0d9]'
                  }`}
                >
                  Min
                </button>
                <button
                  id="price-mode-market"
                  type="button"
                  onClick={() => setPriceMode('marketPrice')}
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                    priceMode === 'marketPrice'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-[#7a9083] hover:text-[#d5e0d9]'
                  }`}
                >
                  Market
                </button>
              </div>

              <button
                id="sync-prices-btn"
                type="button"
                disabled={isSyncing}
                onClick={() => void syncPrices(realm, true)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#26382f] bg-[#14201a] px-2.5 py-1.5 text-xs font-medium text-[#d5e0d9] transition hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-60"
                aria-label="Sync Auction House prices"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync</span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="mt-2.5 hidden items-center gap-1 border-t border-[#16201b] pt-2 sm:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'bg-[#17241e] text-emerald-300 ring-1 ring-emerald-500/25'
                      : 'text-[#8fa196] hover:bg-[#111915] hover:text-[#e7ece8]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="font-tabular rounded-md bg-emerald-500/15 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-3.5 pb-24 pt-4 sm:px-5 sm:pb-10">
        {(syncError || priceData.notice) && (
          <div className="mb-3.5 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/90">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>{syncError ?? priceData.notice}</span>
          </div>
        )}

        {activeTab === 'flips' && (
          <FlipsTab
            evaluatedRecipes={evaluatedRecipes}
            favorites={favoritesSet}
            queue={queue}
            priceMap={priceData.items}
            onToggleFavorite={handleToggleFavorite}
            onAddToQueue={handleAddToQueue}
            onOpenOverride={setOverrideTarget}
            onOpenCustomModal={() => setCustomModalOpen(true)}
            onDeleteCustomRecipe={handleDeleteCustomRecipe}
          />
        )}

        {activeTab === 'queue' && (
          <QueueTab
            queue={queue}
            evaluatedById={evaluatedById}
            shoppingSummary={shoppingSummary}
            priceMap={priceData.items}
            onUpdateQty={handleUpdateQueueQty}
            onRemoveEntry={handleRemoveQueueEntry}
            onClearQueue={handleClearQueue}
            onToggleChecked={handleToggleChecked}
            onResetChecks={() => setShoppingChecked({})}
            onOpenOverride={setOverrideTarget}
            onJumpToFlips={() => setActiveTab('flips')}
          />
        )}

        {activeTab === 'cooldowns' && (
          <CooldownsTab
            cooldowns={cooldowns}
            evaluatedRecipes={evaluatedRecipes}
            onAddCharacter={handleAddCharacter}
            onRemoveCharacter={handleRemoveCharacter}
            onSetCooldown={handleSetCooldown}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            realm={realm}
            priceData={priceData}
            priceMap={priceData.items}
            overrides={overrides}
            customRecipes={customRecipes}
            isSyncing={isSyncing}
            onSaveRealmAndSync={handleSaveRealmAndSync}
            onForceRefresh={() => void syncPrices(realm, true)}
            onClearCache={handleClearCache}
            onOpenOverride={setOverrideTarget}
            onClearOverride={handleClearOverride}
            onClearAllOverrides={() => setOverrides({})}
            onDeleteCustomRecipe={handleDeleteCustomRecipe}
          />
        )}

        <footer className="mt-8 border-t border-[#16201b] pt-4 text-center text-[11px] text-[#5e7166]">
          Live AH data via{' '}
          <a
            href="https://forever-ah.com/api/"
            target="_blank"
            rel="noreferrer"
            className="text-[#8fa196] underline decoration-[#2c3f35] underline-offset-2 hover:text-emerald-300"
          >
            Forever AH
          </a>{' '}
          &amp; Blizzard Battle.net API · Auto-refreshes every 30 min (hourly snapshots)
        </footer>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-[#1b2721] bg-[#0b110e]/95 backdrop-blur-md sm:hidden"
        aria-label="Primary navigation"
      >
        <div className="grid grid-cols-4 px-2 pt-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition ${
                  active ? 'text-emerald-400' : 'text-[#7a9083]'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge !== undefined && (
                    <span className="font-tabular absolute -right-2.5 -top-1.5 min-w-[16px] rounded-full bg-emerald-500 px-1 text-center text-[9px] font-bold leading-4 text-[#05140d]">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      <PriceOverrideModal
        target={overrideTarget}
        onClose={() => setOverrideTarget(null)}
        onSave={handleSaveOverride}
        onClear={handleClearOverride}
      />

      <CustomRecipeModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onCreate={handleCreateCustomRecipe}
      />
    </div>
  );
}

export default App;
