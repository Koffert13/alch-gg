export type Region = 'eu' | 'us' | 'kr' | 'tw';
export type Ruleset = 'pvp' | 'normal' | 'rp' | 'rp-pvp';
export type Faction = 'horde' | 'alliance' | 'blackwater';
export type PriceMode = 'minBuyout' | 'marketPrice';

export interface RealmSettings {
  region: Region;
  ruleset: Ruleset;
  faction: Faction;
}

export interface AhItemPrice {
  itemId: number;
  name: string;
  minBuyout: number; // integer copper
  marketPrice: number; // integer copper
  listed: number;
  sold24h: number;
}

export interface PricesApiResponse {
  source: 'live' | 'fallback';
  provider?: string;
  houseId?: number;
  realm: RealmSettings;
  upstreamBaseUrl: string;
  fetchedAt: number; // unix ms
  snapshotAt: number; // unix seconds
  itemCount: number;
  items: Record<number, AhItemPrice>;
  categoriesFetched: number;
  categoriesTotal: number;
  notice?: string;
}

export type RecipeCategory =
  | 'potion'
  | 'elixir'
  | 'protection'
  | 'oil'
  | 'flask'
  | 'transmute';

export type AcquisitionType = 'ah' | 'vendor' | 'trainer' | 'reputation' | 'quest';

export interface RecipeAcquisition {
  type: AcquisitionType;
  /** Specific vendor, NPC, mob, quest, or faction description */
  sourceLabel: string;
  /** Zone or dungeon where the recipe is obtained */
  location: string;
  /** Fixed copper cost for vendor, trainer, or reputation recipes (0 for quest/free or AH drops) */
  fixedCostCopper: number;
  /** Optional standing required for reputation recipes */
  reputationStanding?: string;
}

export interface RecipeIngredient {
  itemId: number;
  qty: number;
}

export interface AlchemyRecipe {
  id: string;
  name: string;
  outputItemId: number;
  category: RecipeCategory;
  skillRequired: number;
  yield: number;
  ingredients: RecipeIngredient[];
  /** Item ID of the AH recipe scroll (for live pricing from /category/recipe/alchemy?n=200) */
  recipeItemId?: number;
  recipeScrollName?: string;
  acquisition: RecipeAcquisition;
  cooldownHours?: number;
  isCustom?: boolean;
  notes?: string;
}

export interface CatalogItem {
  itemId: number;
  name: string;
  kind: 'herb' | 'elemental' | 'fish' | 'reagent' | 'vial' | 'consumable' | 'bar' | 'recipe';
  /** Fixed vendor cost in copper if sold by NPC vendors (e.g. vials) */
  vendorPrice?: number;
}

export interface QueueEntry {
  recipeId: string;
  quantity: number;
}

export interface CharacterCooldown {
  id: string;
  name: string;
  className?: string;
  arcaniteReadyAt: number | null; // unix ms
  essenceReadyAt: number | null; // unix ms
}
