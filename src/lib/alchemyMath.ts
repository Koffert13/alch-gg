import type {
  AhItemPrice,
  AlchemyRecipe,
  PriceMode,
  QueueEntry,
} from '../../shared/types';
import { getCatalogItemName, getVendorPrice } from '../data/items';

export const AH_CUT_RATE = 0.05; // 5% Classic Auction House cut

export type ResolvedPriceSource = 'override' | 'vendor' | 'ah' | 'missing';

export interface ResolvedItemPrice {
  itemId: number;
  name: string;
  unitPrice: number;
  source: ResolvedPriceSource;
  isOverridden: boolean;
  isVendor: boolean;
  ahRecord?: AhItemPrice;
}

export interface IngredientBreakdown extends ResolvedItemPrice {
  qty: number;
  lineTotal: number;
}

export interface ResolvedRecipeCost {
  costCopper: number;
  source: 'override' | 'ah' | 'fixed' | 'free' | 'missing';
  isOverridden: boolean;
  scrollItemId?: number;
  scrollName?: string;
}

export interface EvaluatedRecipe {
  recipe: AlchemyRecipe;
  outputPrice: ResolvedItemPrice;
  ingredients: IngredientBreakdown[];
  craftCost: number;
  grossReturn: number;
  ahCut: number;
  netReturn: number;
  netProfit: number;
  roiPercent: number;
  recipeCost: ResolvedRecipeCost;
  /** Crafts needed to pay off recipe cost: 0 if free, integer >= 1 if profitable, null if unprofitable ("No break-even") */
  breakEvenCrafts: number | null;
  hasMissingPrices: boolean;
  listed: number;
  sold24h: number;
}

export interface ShoppingListItem {
  itemId: number;
  name: string;
  totalQty: number;
  unitPrice: number;
  lineTotal: number;
  source: ResolvedPriceSource;
  isVendor: boolean;
  isOverridden: boolean;
  checked: boolean;
  usedBy: string[];
}

export interface ShoppingListSummary {
  items: ShoppingListItem[];
  totalCraftCost: number;
  totalGrossReturn: number;
  totalAhCut: number;
  totalNetReturn: number;
  totalNetProfit: number;
  totalRoiPercent: number;
  totalCrafts: number;
}

export type SortOption = 'profit' | 'roi' | 'breakEven' | 'skill' | 'name';

export function resolveItemPrice(
  itemId: number,
  priceMap: Record<number, AhItemPrice>,
  priceMode: PriceMode,
  overrides: Record<number, number>
): ResolvedItemPrice {
  const ahRecord = priceMap[itemId];
  const vendorPrice = getVendorPrice(itemId);
  const name = getCatalogItemName(itemId, ahRecord?.name);

  if (Object.prototype.hasOwnProperty.call(overrides, itemId) && Number.isFinite(overrides[itemId])) {
    return {
      itemId,
      name,
      unitPrice: Math.max(0, Math.round(overrides[itemId])),
      source: 'override',
      isOverridden: true,
      isVendor: vendorPrice !== undefined,
      ahRecord,
    };
  }

  if (vendorPrice !== undefined) {
    return {
      itemId,
      name,
      unitPrice: vendorPrice,
      source: 'vendor',
      isOverridden: false,
      isVendor: true,
      ahRecord,
    };
  }

  if (ahRecord) {
    const primary = priceMode === 'minBuyout' ? ahRecord.minBuyout : ahRecord.marketPrice;
    const secondary = priceMode === 'minBuyout' ? ahRecord.marketPrice : ahRecord.minBuyout;
    const chosen = primary > 0 ? primary : secondary;
    if (chosen > 0) {
      return {
        itemId,
        name,
        unitPrice: chosen,
        source: 'ah',
        isOverridden: false,
        isVendor: false,
        ahRecord,
      };
    }
  }

  return {
    itemId,
    name,
    unitPrice: 0,
    source: 'missing',
    isOverridden: false,
    isVendor: false,
    ahRecord,
  };
}

export function resolveRecipeCost(
  recipe: AlchemyRecipe,
  priceMap: Record<number, AhItemPrice>,
  priceMode: PriceMode,
  overrides: Record<number, number>
): ResolvedRecipeCost {
  const scrollItemId = recipe.recipeItemId;
  const scrollName =
    recipe.recipeScrollName ??
    (scrollItemId ? getCatalogItemName(scrollItemId, `Recipe: ${recipe.name}`) : undefined);

  // Allow temporary manual override on any recipe that has a recipe scroll itemId
  if (
    scrollItemId !== undefined &&
    Object.prototype.hasOwnProperty.call(overrides, scrollItemId) &&
    Number.isFinite(overrides[scrollItemId])
  ) {
    return {
      costCopper: Math.max(0, Math.round(overrides[scrollItemId])),
      source: 'override',
      isOverridden: true,
      scrollItemId,
      scrollName,
    };
  }

  if (recipe.acquisition.type === 'ah' && scrollItemId !== undefined) {
    const ahRecord = priceMap[scrollItemId];
    if (ahRecord) {
      const primary = priceMode === 'minBuyout' ? ahRecord.minBuyout : ahRecord.marketPrice;
      const secondary = priceMode === 'minBuyout' ? ahRecord.marketPrice : ahRecord.minBuyout;
      const chosen = primary > 0 ? primary : secondary;
      if (chosen > 0) {
        return {
          costCopper: chosen,
          source: 'ah',
          isOverridden: false,
          scrollItemId,
          scrollName,
        };
      }
    }
    return {
      costCopper: recipe.acquisition.fixedCostCopper,
      source: recipe.acquisition.fixedCostCopper > 0 ? 'fixed' : 'missing',
      isOverridden: false,
      scrollItemId,
      scrollName,
    };
  }

  const fixed = Math.max(0, Math.round(recipe.acquisition.fixedCostCopper));
  return {
    costCopper: fixed,
    source: fixed > 0 ? 'fixed' : 'free',
    isOverridden: false,
    scrollItemId,
    scrollName,
  };
}

/**
 * Calculates crafts needed to pay off the recipe acquisition cost.
 * - Returns 0 if recipeCostCopper <= 0 (free quest/starter recipe)
 * - Returns null if netProfitPerCraft <= 0 ("No break-even")
 * - Otherwise returns Math.ceil(recipeCostCopper / netProfitPerCraft)
 */
export function calculateBreakEvenCrafts(
  recipeCostCopper: number,
  netProfitPerCraft: number
): number | null {
  if (recipeCostCopper <= 0) {
    return 0;
  }
  if (netProfitPerCraft <= 0) {
    return null;
  }
  return Math.ceil(recipeCostCopper / netProfitPerCraft);
}

export function evaluateRecipe(
  recipe: AlchemyRecipe,
  priceMap: Record<number, AhItemPrice>,
  priceMode: PriceMode,
  overrides: Record<number, number>
): EvaluatedRecipe {
  const outputPrice = resolveItemPrice(recipe.outputItemId, priceMap, priceMode, overrides);
  const ingredients: IngredientBreakdown[] = recipe.ingredients.map((ing) => {
    const resolved = resolveItemPrice(ing.itemId, priceMap, priceMode, overrides);
    return {
      ...resolved,
      qty: ing.qty,
      lineTotal: resolved.unitPrice * ing.qty,
    };
  });

  const craftCost = ingredients.reduce((sum, item) => sum + item.lineTotal, 0);
  const effectiveYield = Math.max(1, recipe.yield);
  const grossReturn = outputPrice.unitPrice * effectiveYield;
  const ahCut = Math.round(grossReturn * AH_CUT_RATE);
  const netReturn = grossReturn - ahCut;
  const netProfit = netReturn - craftCost;
  const roiPercent = craftCost > 0 ? (netProfit / craftCost) * 100 : 0;

  const recipeCost = resolveRecipeCost(recipe, priceMap, priceMode, overrides);
  const breakEvenCrafts = calculateBreakEvenCrafts(recipeCost.costCopper, netProfit);

  const hasMissingPrices =
    outputPrice.source === 'missing' || ingredients.some((ing) => ing.source === 'missing');

  return {
    recipe,
    outputPrice,
    ingredients,
    craftCost,
    grossReturn,
    ahCut,
    netReturn,
    netProfit,
    roiPercent,
    recipeCost,
    breakEvenCrafts,
    hasMissingPrices,
    listed: outputPrice.ahRecord?.listed ?? 0,
    sold24h: outputPrice.ahRecord?.sold24h ?? 0,
  };
}

export function sortEvaluatedRecipes(
  list: EvaluatedRecipe[],
  sortBy: SortOption
): EvaluatedRecipe[] {
  const copy = [...list];
  copy.sort((a, b) => {
    switch (sortBy) {
      case 'profit':
        return b.netProfit - a.netProfit || b.roiPercent - a.roiPercent;
      case 'roi':
        return b.roiPercent - a.roiPercent || b.netProfit - a.netProfit;
      case 'breakEven': {
        // Rank profitable crafts with finite break-even first (fastest first),
        // and place unprofitable crafts at the bottom.
        const aProf = a.netProfit > 0 && a.breakEvenCrafts !== null;
        const bProf = b.netProfit > 0 && b.breakEvenCrafts !== null;
        if (aProf && !bProf) return -1;
        if (!aProf && bProf) return 1;
        if (aProf && bProf) {
          const diff = (a.breakEvenCrafts as number) - (b.breakEvenCrafts as number);
          return diff !== 0 ? diff : b.netProfit - a.netProfit;
        }
        return b.netProfit - a.netProfit;
      }
      case 'skill':
        return b.recipe.skillRequired - a.recipe.skillRequired || a.recipe.name.localeCompare(b.recipe.name);
      case 'name':
        return a.recipe.name.localeCompare(b.recipe.name);
      default:
        return 0;
    }
  });
  return copy;
}

export function aggregateShoppingList(
  queue: QueueEntry[],
  recipes: AlchemyRecipe[],
  priceMap: Record<number, AhItemPrice>,
  priceMode: PriceMode,
  overrides: Record<number, number>,
  checkedItems: Record<number, boolean> = {}
): ShoppingListSummary {
  const recipeMap = new Map<string, AlchemyRecipe>();
  for (const r of recipes) {
    recipeMap.set(r.id, r);
  }

  const matTotals = new Map<
    number,
    { qty: number; usedBy: Set<string> }
  >();

  let totalCraftCost = 0;
  let totalGrossReturn = 0;
  let totalAhCut = 0;
  let totalNetReturn = 0;
  let totalCrafts = 0;

  for (const entry of queue) {
    if (entry.quantity <= 0) continue;
    const recipe = recipeMap.get(entry.recipeId);
    if (!recipe) continue;

    const evaluated = evaluateRecipe(recipe, priceMap, priceMode, overrides);
    const qty = Math.floor(entry.quantity);

    totalCrafts += qty;
    totalCraftCost += evaluated.craftCost * qty;
    totalGrossReturn += evaluated.grossReturn * qty;
    totalAhCut += evaluated.ahCut * qty;
    totalNetReturn += evaluated.netReturn * qty;

    for (const ing of recipe.ingredients) {
      const existing = matTotals.get(ing.itemId);
      if (existing) {
        existing.qty += ing.qty * qty;
        existing.usedBy.add(recipe.name);
      } else {
        matTotals.set(ing.itemId, {
          qty: ing.qty * qty,
          usedBy: new Set([recipe.name]),
        });
      }
    }
  }

  const items: ShoppingListItem[] = [];
  for (const [itemId, data] of matTotals.entries()) {
    const resolved = resolveItemPrice(itemId, priceMap, priceMode, overrides);
    items.push({
      itemId,
      name: resolved.name,
      totalQty: data.qty,
      unitPrice: resolved.unitPrice,
      lineTotal: resolved.unitPrice * data.qty,
      source: resolved.source,
      isVendor: resolved.isVendor,
      isOverridden: resolved.isOverridden,
      checked: Boolean(checkedItems[itemId]),
      usedBy: Array.from(data.usedBy),
    });
  }

  // Sort: AH mats first (highest spend first), then vendor vials
  items.sort((a, b) => {
    if (a.isVendor !== b.isVendor) return a.isVendor ? 1 : -1;
    return b.lineTotal - a.lineTotal || a.name.localeCompare(b.name);
  });

  const totalNetProfit = totalNetReturn - totalCraftCost;
  const totalRoiPercent = totalCraftCost > 0 ? (totalNetProfit / totalCraftCost) * 100 : 0;

  return {
    items,
    totalCraftCost,
    totalGrossReturn,
    totalAhCut,
    totalNetReturn,
    totalNetProfit,
    totalRoiPercent,
    totalCrafts,
  };
}
