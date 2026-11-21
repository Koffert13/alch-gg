import type {
  AlchemyRecipe,
  CharacterCooldown,
  PriceMode,
  PricesApiResponse,
  QueueEntry,
  RealmSettings,
} from '../../shared/types';
import { DEFAULT_REALM } from '../../shared/wowfah';

const KEYS = {
  SETTINGS: 'alchgg:settings:v1',
  PRICE_CACHE: 'alchgg:priceCache:v1',
  OVERRIDES: 'alchgg:overrides:v1',
  QUEUE: 'alchgg:queue:v1',
  SHOPPING_CHECKED: 'alchgg:shoppingChecked:v1',
  CUSTOM_RECIPES: 'alchgg:customRecipes:v1',
  FAVORITES: 'alchgg:favorites:v1',
  COOLDOWNS: 'alchgg:cooldowns:v1',
} as const;

export interface PersistedSettings {
  realm: RealmSettings;
  priceMode: PriceMode;
}

export const DEFAULT_SETTINGS: PersistedSettings = {
  realm: DEFAULT_REALM,
  priceMode: 'minBuyout',
};

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export const storage = {
  loadSettings: (): PersistedSettings => {
    const saved = safeRead<Partial<PersistedSettings>>(KEYS.SETTINGS, {});
    return {
      realm: {
        region: saved.realm?.region ?? DEFAULT_SETTINGS.realm.region,
        ruleset: saved.realm?.ruleset ?? DEFAULT_SETTINGS.realm.ruleset,
        faction: saved.realm?.faction ?? DEFAULT_SETTINGS.realm.faction,
      },
      priceMode: saved.priceMode === 'marketPrice' ? 'marketPrice' : 'minBuyout',
    };
  },
  saveSettings: (settings: PersistedSettings) => safeWrite(KEYS.SETTINGS, settings),

  loadPriceCache: (): PricesApiResponse | null =>
    safeRead<PricesApiResponse | null>(KEYS.PRICE_CACHE, null),
  savePriceCache: (data: PricesApiResponse) => safeWrite(KEYS.PRICE_CACHE, data),
  clearPriceCache: () => {
    try {
      window.localStorage.removeItem(KEYS.PRICE_CACHE);
    } catch {
      // ignore
    }
  },

  loadOverrides: (): Record<number, number> =>
    safeRead<Record<number, number>>(KEYS.OVERRIDES, {}),
  saveOverrides: (overrides: Record<number, number>) => safeWrite(KEYS.OVERRIDES, overrides),

  loadQueue: (): QueueEntry[] => safeRead<QueueEntry[]>(KEYS.QUEUE, []),
  saveQueue: (queue: QueueEntry[]) => safeWrite(KEYS.QUEUE, queue),

  loadShoppingChecked: (): Record<number, boolean> =>
    safeRead<Record<number, boolean>>(KEYS.SHOPPING_CHECKED, {}),
  saveShoppingChecked: (checked: Record<number, boolean>) =>
    safeWrite(KEYS.SHOPPING_CHECKED, checked),

  loadCustomRecipes: (): AlchemyRecipe[] => safeRead<AlchemyRecipe[]>(KEYS.CUSTOM_RECIPES, []),
  saveCustomRecipes: (recipes: AlchemyRecipe[]) => safeWrite(KEYS.CUSTOM_RECIPES, recipes),

  loadFavorites: (): string[] =>
    safeRead<string[]>(KEYS.FAVORITES, [
      'elixir-of-the-mongoose',
      'greater-fire-protection-potion',
      'major-mana-potion',
      'flask-of-the-titans',
      'transmute-arcanite',
    ]),
  saveFavorites: (favorites: string[]) => safeWrite(KEYS.FAVORITES, favorites),

  loadCooldowns: (): CharacterCooldown[] =>
    safeRead<CharacterCooldown[]>(KEYS.COOLDOWNS, [
      {
        id: 'main-alch',
        name: 'Main Alchemist',
        className: 'Mage',
        arcaniteReadyAt: null,
        essenceReadyAt: null,
      },
    ]),
  saveCooldowns: (cooldowns: CharacterCooldown[]) => safeWrite(KEYS.COOLDOWNS, cooldowns),
};
