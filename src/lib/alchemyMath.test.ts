import { describe, expect, it } from 'vitest';
import type { AhItemPrice, AlchemyRecipe } from '../../shared/types';
import { CLASSIC_ALCHEMY_RECIPES } from '../data/recipes';
import {
  aggregateShoppingList,
  AH_CUT_RATE,
  calculateBreakEvenCrafts,
  evaluateRecipe,
  sortEvaluatedRecipes,
} from './alchemyMath';

function makePrice(itemId: number, name: string, minBuyout: number, marketPrice = minBuyout): AhItemPrice {
  return {
    itemId,
    name,
    minBuyout,
    marketPrice,
    listed: 50,
    sold24h: 25,
  };
}

describe('Alchemy profit math, 5% AH cut, multi-yield, overrides, break-even, and shopping list', () => {
  it('applies exact 5% AH cut and vendor vial pricing', () => {
    const mongoose = CLASSIC_ALCHEMY_RECIPES.find((r) => r.id === 'elixir-of-the-mongoose')!;
    const priceMap: Record<number, AhItemPrice> = {
      13465: makePrice(13465, 'Mountain Silversage', 15000), // 1g 50s x 2 = 3g
      13466: makePrice(13466, 'Plaguebloom', 20000), // 2g x 2 = 4g
      // Crystal Vial (8925) is vendor 500c (5s)
      13452: makePrice(13452, 'Elixir of the Mongoose', 100000), // 10g
      13491: makePrice(13491, 'Recipe: Elixir of the Mongoose', 500000), // 50g
    };

    const ev = evaluateRecipe(mongoose, priceMap, 'minBuyout', {});

    // Craft cost = 2*15000 + 2*20000 + 500 = 70500 (7g 05s)
    expect(ev.craftCost).toBe(70500);
    // Gross = 100000, 5% AH cut = 5000, Net = 95000
    expect(AH_CUT_RATE).toBe(0.05);
    expect(ev.grossReturn).toBe(100000);
    expect(ev.ahCut).toBe(5000);
    expect(ev.netReturn).toBe(95000);
    // Net Profit = 95000 - 70500 = 24500 (2g 45s)
    expect(ev.netProfit).toBe(24500);
    expect(ev.roiPercent).toBeCloseTo((24500 / 70500) * 100, 4);
    // Recipe cost from AH scroll = 500000 -> break-even = ceil(500000 / 24500) = 21 crafts
    expect(ev.recipeCost.costCopper).toBe(500000);
    expect(ev.breakEvenCrafts).toBe(21);
  });

  it('handles multi-yield crafts (Transmute: Elemental Fire yield = 3)', () => {
    const transmuteFire = CLASSIC_ALCHEMY_RECIPES.find(
      (r) => r.id === 'transmute-elemental-fire'
    )!;
    expect(transmuteFire.yield).toBe(3);

    const priceMap: Record<number, AhItemPrice> = {
      7077: makePrice(7077, 'Heart of Fire', 90000), // 9g
      7068: makePrice(7068, 'Elemental Fire', 40000), // 4g each -> 3x = 12g gross
    };

    const ev = evaluateRecipe(transmuteFire, priceMap, 'minBuyout', {});

    expect(ev.craftCost).toBe(90000);
    expect(ev.grossReturn).toBe(120000); // 40000 * 3
    expect(ev.ahCut).toBe(6000); // 5% of 120000
    expect(ev.netReturn).toBe(114000);
    expect(ev.netProfit).toBe(24000); // 114000 - 90000
    // Fixed Thorium Brotherhood rep recipe cost = 1g 20s (12000c)
    // Break-even = ceil(12000 / 24000) = 1 craft
    expect(ev.recipeCost.costCopper).toBe(12000);
    expect(ev.breakEvenCrafts).toBe(1);
  });

  it('respects manual G/S/C overrides for herbs, vendor vials, outputs, and AH recipe scrolls', () => {
    const gfpp = CLASSIC_ALCHEMY_RECIPES.find(
      (r) => r.id === 'greater-fire-protection-potion'
    )!;
    const priceMap: Record<number, AhItemPrice> = {
      7068: makePrice(7068, 'Elemental Fire', 40000, 45000),
      13463: makePrice(13463, 'Dreamfoil', 16000, 18000),
      13457: makePrice(13457, 'Greater Fire Protection Potion', 70000, 75000),
      13494: makePrice(13494, 'Recipe: Greater Fire Protection Potion', 600000, 650000),
    };

    // Override Elemental Fire to 30000 (3g), Crystal Vial to 450 (rep discount),
    // Output to 80000 (8g), and AH Recipe Scroll to 300000 (30g)
    const overrides: Record<number, number> = {
      7068: 30000,
      8925: 450,
      13457: 80000,
      13494: 300000,
    };

    const ev = evaluateRecipe(gfpp, priceMap, 'marketPrice', overrides);

    // Dreamfoil uses marketPrice (18000), Elemental Fire override (30000), Crystal Vial override (450)
    expect(ev.craftCost).toBe(48450);
    expect(ev.grossReturn).toBe(80000);
    expect(ev.ahCut).toBe(4000);
    expect(ev.netReturn).toBe(76000);
    expect(ev.netProfit).toBe(27550);
    expect(ev.recipeCost.costCopper).toBe(300000);
    expect(ev.recipeCost.isOverridden).toBe(true);
    expect(ev.breakEvenCrafts).toBe(Math.ceil(300000 / 27550)); // 11 crafts
  });

  it('calculates break-even crafts accurately for free, profitable, and unprofitable recipes', () => {
    // Free quest / starter recipe -> 0 crafts even if unprofitable
    expect(calculateBreakEvenCrafts(0, 5000)).toBe(0);
    expect(calculateBreakEvenCrafts(0, -1000)).toBe(0);

    // Unprofitable paid recipe -> null ("No break-even")
    expect(calculateBreakEvenCrafts(50000, 0)).toBeNull();
    expect(calculateBreakEvenCrafts(50000, -2500)).toBeNull();

    // Profitable paid recipe -> Math.ceil(recipeCost / netProfit)
    expect(calculateBreakEvenCrafts(10000, 10000)).toBe(1);
    expect(calculateBreakEvenCrafts(10001, 10000)).toBe(2);
    expect(calculateBreakEvenCrafts(500000, 12345)).toBe(41);
  });

  it('sorts break-even fastest first while pushing unprofitable recipes to the bottom', () => {
    const makeRecipe = (id: string, fixedCostCopper: number): AlchemyRecipe => ({
      id,
      name: id,
      outputItemId: 1000 + id.length,
      category: 'potion',
      skillRequired: 200,
      yield: 1,
      ingredients: [{ itemId: 13463, qty: 1 }],
      acquisition: {
        type: fixedCostCopper === 0 ? 'quest' : 'vendor',
        sourceLabel: 'Test',
        location: 'Test',
        fixedCostCopper,
      },
    });

    const rFree = makeRecipe('free', 0); // output 1004
    const rFast = makeRecipe('fast1', 10000); // output 1005
    const rSlow = makeRecipe('slow12', 90000); // output 1006
    const rLoss = makeRecipe('loss123', 10000); // output 1007

    const priceMap: Record<number, AhItemPrice> = {
      13463: makePrice(13463, 'Dreamfoil', 10000),
      1004: makePrice(1004, 'Free', 20000), // profit +9000, BE 0
      1005: makePrice(1005, 'Fast', 20000), // profit +9000, BE 2
      1006: makePrice(1006, 'Slow', 20000), // profit +9000, BE 10
      1007: makePrice(1007, 'Loss', 5000), // profit -5250, BE null
    };

    const evaluated = [rSlow, rLoss, rFast, rFree].map((r) =>
      evaluateRecipe(r, priceMap, 'minBuyout', {})
    );

    const sorted = sortEvaluatedRecipes(evaluated, 'breakEven');
    expect(sorted.map((s) => s.recipe.id)).toEqual(['free', 'fast1', 'slow12', 'loss123']);
  });

  it('aggregates shopping list quantities, costs, net AH returns, and checked states across queued crafts', () => {
    // Queue: 10x Major Mana Potion (3 Dreamfoil, 2 Icecap, 1 Crystal Vial)
    //      + 5x Greater Arcane Elixir (3 Dreamfoil, 1 Mountain Silversage, 1 Crystal Vial)
    // Total mats: 45 Dreamfoil, 20 Icecap, 5 Mountain Silversage, 15 Crystal Vial
    const priceMap: Record<number, AhItemPrice> = {
      13463: makePrice(13463, 'Dreamfoil', 15000), // 1g 50s
      13467: makePrice(13467, 'Icecap', 10000), // 1g
      13465: makePrice(13465, 'Mountain Silversage', 18000), // 1g 80s
      13444: makePrice(13444, 'Major Mana Potion', 80000), // 8g
      13454: makePrice(13454, 'Greater Arcane Elixir', 76000), // 7g 60s
    };

    const summary = aggregateShoppingList(
      [
        { recipeId: 'major-mana-potion', quantity: 10 },
        { recipeId: 'greater-arcane-elixir', quantity: 5 },
      ],
      CLASSIC_ALCHEMY_RECIPES,
      priceMap,
      'minBuyout',
      {},
      { 13463: true }
    );

    expect(summary.totalCrafts).toBe(15);

    const byId = new Map(summary.items.map((i) => [i.itemId, i]));
    expect(byId.get(13463)?.totalQty).toBe(45);
    expect(byId.get(13463)?.checked).toBe(true);
    expect(byId.get(13463)?.lineTotal).toBe(45 * 15000);
    expect(byId.get(13467)?.totalQty).toBe(20);
    expect(byId.get(13465)?.totalQty).toBe(5);
    expect(byId.get(8925)?.totalQty).toBe(15);
    expect(byId.get(8925)?.isVendor).toBe(true);
    expect(byId.get(8925)?.lineTotal).toBe(15 * 500);

    // Verify vendor vials are sorted after AH materials
    expect(summary.items[summary.items.length - 1].itemId).toBe(8925);

    // Craft cost = (45*15000) + (20*10000) + (5*18000) + (15*500) = 675000 + 200000 + 90000 + 7500 = 972500
    expect(summary.totalCraftCost).toBe(972500);

    // Gross return = (10 * 80000) + (5 * 76000) = 800000 + 380000 = 1180000
    // 5% AH cut = 40000 + 19000 = 59000
    // Net return = 1121000
    expect(summary.totalGrossReturn).toBe(1180000);
    expect(summary.totalAhCut).toBe(59000);
    expect(summary.totalNetReturn).toBe(1121000);
    expect(summary.totalNetProfit).toBe(1121000 - 972500); // 148500 (14g 85s)
  });

  it('has 50+ Classic Alchemy recipes with complete catalog and price coverage', async () => {
    expect(CLASSIC_ALCHEMY_RECIPES.length).toBeGreaterThanOrEqual(50);

    const { CATALOG_ITEMS, getVendorPrice } = await import('../data/items');
    const { buildMockPrices } = await import('../../shared/mockPrices');
    const { DEFAULT_REALM } = await import('../../shared/wowfah');
    const mockPrices = buildMockPrices(DEFAULT_REALM);

    for (const recipe of CLASSIC_ALCHEMY_RECIPES) {
      expect(CATALOG_ITEMS[recipe.outputItemId], `missing output catalog: ${recipe.name}`).toBeDefined();
      expect(mockPrices[recipe.outputItemId], `missing output price: ${recipe.name}`).toBeDefined();

      for (const ing of recipe.ingredients) {
        expect(CATALOG_ITEMS[ing.itemId], `missing mat catalog ${ing.itemId} in ${recipe.name}`).toBeDefined();
        const hasVendor = getVendorPrice(ing.itemId) !== undefined;
        const hasMock = mockPrices[ing.itemId] !== undefined;
        expect(hasVendor || hasMock, `missing mat price ${ing.itemId} in ${recipe.name}`).toBe(true);
      }

      if (recipe.acquisition.type === 'ah' && recipe.recipeItemId) {
        expect(CATALOG_ITEMS[recipe.recipeItemId], `missing scroll catalog: ${recipe.name}`).toBeDefined();
        expect(mockPrices[recipe.recipeItemId], `missing scroll price: ${recipe.name}`).toBeDefined();
      }
    }
  });
});
