import type { AhItemPrice, RealmSettings } from './types';

/**
 * Realistic Classic WoW (Era / Anniversary) Auction House fallback dataset
 * normalized to integer copper (1g = 10000c, 1s = 100c).
 * Used cleanly whenever upstream wowfah.com cannot be reached or returns no rows.
 */
const BASE_MOCK_ITEMS: ReadonlyArray<[number, string, number, number, number, number]> = [
  // [itemId, name, minBuyout, marketPrice, listed, sold24h]

  // === Herbs ===
  [765, 'Silverleaf', 140, 165, 620, 340],
  [785, 'Mageroyal', 380, 440, 410, 220],
  [2447, 'Peacebloom', 160, 190, 580, 310],
  [2449, 'Earthroot', 520, 610, 340, 185],
  [2450, 'Briarthorn', 650, 740, 490, 290],
  [2452, 'Swiftthistle', 3400, 3850, 280, 210],
  [2453, 'Bruiseweed', 420, 480, 310, 160],
  [3355, 'Wild Steelbloom', 1450, 1680, 390, 240],
  [3356, 'Kingsblood', 720, 840, 520, 260],
  [3357, 'Liferoot', 980, 1120, 330, 190],
  [3358, "Khadgar's Whisker", 1350, 1520, 410, 230],
  [3369, 'Grave Moss', 4600, 5150, 240, 175],
  [3818, 'Fadeleaf', 2900, 3250, 310, 195],
  [3819, 'Wintersbite', 3100, 3550, 185, 110],
  [3820, 'Stranglekelp', 1250, 1450, 540, 320],
  [3821, 'Goldthorn', 1850, 2100, 460, 280],
  [4625, 'Firebloom', 4200, 4750, 380, 265],
  [8153, 'Wildvine', 8900, 9800, 95, 48],
  [8831, 'Purple Lotus', 1650, 1920, 370, 210],
  [8836, "Arthas' Tears", 1400, 1650, 290, 140],
  [8838, 'Sungrass', 3100, 3450, 610, 420],
  [8839, 'Blindweed', 4400, 4950, 520, 390],
  [8845, 'Ghost Mushroom', 13500, 14800, 340, 275],
  [8846, 'Gromsblood', 11200, 12400, 740, 610],
  [13463, 'Dreamfoil', 15800, 17200, 1120, 890],
  [13464, 'Golden Sansam', 2950, 3350, 890, 560],
  [13465, 'Mountain Silversage', 17400, 18900, 960, 780],
  [13466, 'Plaguebloom', 24500, 26800, 810, 690],
  [13467, 'Icecap', 10800, 11900, 670, 520],
  [13468, 'Black Lotus', 980000, 1060000, 42, 29],

  // === Fish & Aquatic ===
  [6358, 'Oily Blackmouth', 1650, 1900, 640, 430],
  [6359, 'Firefin Snapper', 2800, 3200, 480, 310],
  [6522, 'Deviate Fish', 1950, 2300, 320, 190],
  [13422, 'Stonescale Eel', 14200, 15600, 510, 380],

  // === Elementals & Essences ===
  [7067, 'Elemental Earth', 31500, 34800, 430, 360],
  [7068, 'Elemental Fire', 42500, 46200, 510, 440],
  [7070, 'Elemental Water', 9200, 10600, 340, 210],
  [7076, 'Essence of Earth', 34000, 37500, 180, 120],
  [7077, 'Heart of Fire', 98000, 108000, 165, 130],
  [7078, 'Essence of Fire', 94000, 102000, 210, 155],
  [7080, 'Essence of Water', 142000, 154000, 190, 145],
  [7082, 'Essence of Air', 198000, 212000, 145, 110],
  [12803, 'Living Essence', 26500, 29800, 220, 135],
  [12808, 'Essence of Undeath', 18500, 21000, 310, 240],

  // === Metals, Gems & Misc Reagents ===
  [3164, 'Discolored Worg Heart', 1200, 1500, 45, 18],
  [3860, 'Mithril Bar', 3400, 3850, 820, 490],
  [4402, 'Small Flame Sac', 6800, 7600, 210, 140],
  [5635, 'Sharp Claw', 850, 1050, 175, 85],
  [5637, 'Large Fang', 1900, 2250, 160, 92],
  [6037, 'Truesilver Bar', 12400, 13800, 230, 145],
  [9260, 'Volatile Rum', 4900, 5600, 190, 110],
  [10286, 'Heart of the Wild', 7400, 8300, 240, 145],
  [11176, 'Dream Dust', 4800, 5400, 720, 410],
  [12359, 'Thorium Bar', 4600, 5200, 1240, 780],
  [12360, 'Arcanite Bar', 615000, 648000, 94, 72],
  [12363, 'Arcane Crystal', 495000, 525000, 112, 88],

  // === Crafted Potions ===
  [118, 'Minor Healing Potion', 320, 390, 210, 115],
  [858, 'Lesser Healing Potion', 950, 1100, 185, 95],
  [929, 'Healing Potion', 1350, 1550, 220, 120],
  [1710, 'Greater Healing Potion', 2100, 2450, 260, 145],
  [2455, 'Minor Mana Potion', 540, 640, 140, 72],
  [2459, 'Swiftness Potion', 5400, 6100, 340, 245],
  [3385, 'Lesser Mana Potion', 1850, 2150, 190, 105],
  [3387, 'Limited Invulnerability Potion', 29800, 32600, 410, 325],
  [3823, 'Lesser Invisibility Potion', 5200, 5900, 120, 65],
  [3827, 'Mana Potion', 2500, 2850, 230, 130],
  [3928, 'Superior Healing Potion', 5200, 5800, 310, 195],
  [4596, 'Discolored Healing Potion', 1850, 2200, 32, 12],
  [5631, 'Rage Potion', 1850, 2150, 150, 82],
  [5633, 'Great Rage Potion', 3450, 3950, 175, 110],
  [5634, 'Free Action Potion', 11200, 12400, 480, 370],
  [6149, 'Greater Mana Potion', 4350, 4900, 280, 180],
  [6372, 'Swim Speed Potion', 8200, 9100, 115, 68],
  [9030, 'Restorative Potion', 39800, 43500, 290, 225],
  [9144, 'Wildvine Potion', 12900, 14200, 95, 42],
  [9172, 'Invisibility Potion', 21400, 23600, 220, 155],
  [12190, 'Dreamless Sleep Potion', 5900, 6700, 165, 92],
  [13442, 'Mighty Rage Potion', 42800, 46400, 520, 435],
  [13443, 'Superior Mana Potion', 19400, 21500, 460, 340],
  [13444, 'Major Mana Potion', 79500, 85200, 780, 640],
  [13446, 'Major Healing Potion', 28400, 31200, 690, 510],
  [13462, 'Purification Potion', 76200, 82500, 110, 58],
  [18253, 'Major Rejuvenation Potion', 96000, 104000, 180, 115],
  [20002, 'Greater Dreamless Sleep Potion', 41500, 45200, 210, 140],
  [20004, "Major Troll's Blood Potion", 69800, 74500, 230, 165],
  [20008, 'Living Action Potion', 84500, 91200, 280, 215],

  // === Crafted Protection Potions ===
  [6048, 'Shadow Protection Potion', 6800, 7500, 210, 130],
  [6049, 'Fire Protection Potion', 15900, 17400, 265, 185],
  [6050, 'Frost Protection Potion', 6100, 6900, 140, 80],
  [6052, 'Nature Protection Potion', 3100, 3600, 165, 95],
  [13456, 'Greater Frost Protection Potion', 31800, 35200, 310, 215],
  [13457, 'Greater Fire Protection Potion', 69400, 74800, 680, 590],
  [13458, 'Greater Nature Protection Potion', 58600, 63400, 490, 385],
  [13459, 'Greater Shadow Protection Potion', 59800, 64900, 540, 450],
  [13461, 'Greater Arcane Protection Potion', 27400, 30200, 360, 275],

  // === Crafted Elixirs ===
  [2457, 'Elixir of Minor Agility', 4400, 4950, 140, 82],
  [3390, 'Elixir of Lesser Agility', 5900, 6600, 165, 95],
  [3825, 'Elixir of Fortitude', 4350, 4900, 290, 195],
  [6373, 'Elixir of Firepower', 15800, 17400, 240, 160],
  [6662, 'Elixir of Giant Growth', 3850, 4400, 195, 130],
  [8949, 'Elixir of Agility', 4200, 4750, 220, 140],
  [8951, 'Elixir of Greater Defense', 4100, 4650, 245, 155],
  [9088, 'Gift of Arthas', 8200, 9100, 210, 145],
  [9155, 'Arcane Elixir', 7800, 8700, 295, 205],
  [9179, 'Elixir of Greater Intellect', 7600, 8400, 260, 175],
  [9187, 'Elixir of Greater Agility', 6600, 7400, 340, 235],
  [9206, 'Elixir of Giants', 18400, 20200, 490, 395],
  [9224, 'Elixir of Demonslaying', 29800, 32600, 220, 160],
  [9264, 'Elixir of Shadow Power', 48500, 52600, 380, 305],
  [13445, 'Elixir of Superior Defense', 39200, 42800, 330, 245],
  [13447, 'Elixir of the Sages', 74800, 80400, 290, 210],
  [13452, 'Elixir of the Mongoose', 96400, 103500, 860, 745],
  [13453, 'Elixir of Brute Force', 78200, 84600, 210, 145],
  [13454, 'Greater Arcane Elixir', 76500, 82400, 620, 515],
  [17708, 'Elixir of Frost Power', 11400, 12900, 170, 115],
  [20007, 'Mageblood Potion', 79200, 85600, 440, 360],
  [21546, 'Elixir of Greater Firepower', 39800, 43600, 410, 330],

  // === Crafted Oils ===
  [3824, 'Shadow Oil', 35600, 39200, 260, 190],
  [3829, 'Frost Oil', 15200, 17100, 155, 92],
  [6370, 'Blackmouth Oil', 4250, 4750, 390, 285],
  [6371, 'Fire Oil', 7150, 7950, 350, 250],
  [8956, 'Oil of Immolation', 7900, 8800, 230, 155],
  [9061, 'Goblin Rocket Fuel', 12400, 13800, 210, 145],
  [13423, 'Stonescale Oil', 16800, 18400, 440, 335],

  // === Crafted Flasks ===
  [13506, 'Flask of Petrification', 1760000, 1890000, 24, 15],
  [13510, 'Flask of the Titans', 1645000, 1740000, 56, 44],
  [13511, 'Flask of Distilled Wisdom', 1685000, 1790000, 48, 36],
  [13512, 'Flask of Supreme Power', 1825000, 1930000, 62, 51],
  [13513, 'Flask of Chromatic Resistance', 1560000, 1670000, 19, 11],

  // === AH Alchemy Recipe Scrolls (/category/recipe/alchemy?n=200) ===
  [2553, 'Recipe: Elixir of Minor Agility', 18500, 22000, 9, 4],
  [2555, 'Recipe: Swiftness Potion', 42000, 49500, 14, 7],
  [3393, 'Recipe: Elixir of Lesser Agility', 21000, 25000, 8, 3],
  [3396, 'Recipe: Limited Invulnerability Potion', 145000, 168000, 12, 6],
  [6663, 'Recipe: Elixir of Giant Growth', 14000, 17500, 18, 9],
  [9293, 'Recipe: Goblin Rocket Fuel', 28000, 33000, 11, 5],
  [9294, 'Recipe: Gift of Arthas', 36000, 42000, 15, 8],
  [9295, 'Recipe: Wildvine Potion', 19500, 24000, 12, 4],
  [9298, 'Recipe: Invisibility Potion', 62000, 74000, 10, 5],
  [9300, 'Recipe: Elixir of Greater Agility', 34000, 41000, 14, 7],
  [9301, 'Recipe: Elixir of Giants', 115000, 132000, 16, 9],
  [13476, 'Recipe: Mighty Rage Potion', 195000, 224000, 11, 6],
  [13477, 'Recipe: Elixir of the Sages', 165000, 188000, 9, 5],
  [13481, 'Recipe: Major Mana Potion', 485000, 540000, 7, 4],
  [13482, 'Recipe: Transmute Air to Fire', 135000, 155000, 13, 6],
  [13484, 'Recipe: Transmute Water to Air', 1180000, 1290000, 6, 3],
  [13485, 'Recipe: Transmute Undeath to Water', 2450000, 2680000, 5, 3],
  [13489, 'Recipe: Transmute Life to Earth', 92000, 110000, 14, 6],
  [13491, 'Recipe: Elixir of the Mongoose', 520000, 585000, 11, 7],
  [13492, 'Recipe: Greater Arcane Elixir', 340000, 385000, 12, 6],
  [13493, 'Recipe: Purification Potion', 44000, 52000, 15, 5],
  [13494, 'Recipe: Greater Fire Protection Potion', 640000, 710000, 9, 5],
  [13495, 'Recipe: Greater Frost Protection Potion', 225000, 258000, 10, 4],
  [13496, 'Recipe: Greater Nature Protection Potion', 310000, 355000, 8, 4],
  [13497, 'Recipe: Greater Arcane Protection Potion', 185000, 215000, 11, 5],
  [13499, 'Recipe: Greater Shadow Protection Potion', 490000, 545000, 8, 5],
  [13517, 'Recipe: Flask of Petrification', 690000, 780000, 5, 2],
  [13518, 'Recipe: Flask of the Titans', 3150000, 3450000, 4, 2],
  [13519, 'Recipe: Flask of Distilled Wisdom', 1420000, 1580000, 5, 3],
  [13520, 'Recipe: Flask of Supreme Power', 2850000, 3120000, 4, 2],
  [13521, 'Recipe: Flask of Chromatic Resistance', 540000, 620000, 6, 2],
  [17709, 'Recipe: Elixir of Frost Power', 380000, 440000, 5, 2],
  [18257, 'Recipe: Major Rejuvenation Potion', 410000, 465000, 7, 3],
  [21547, 'Recipe: Elixir of Greater Firepower', 420000, 475000, 9, 5],
];

/** All non-vendor Classic Alchemy herbs, reagents, consumables, bars, and AH recipe scrolls */
export const TRACKED_AH_ITEM_IDS: readonly number[] = BASE_MOCK_ITEMS.map(([itemId]) => itemId);

function getRealmPriceMultiplier(realm: RealmSettings): number {
  const regionScale: Record<RealmSettings['region'], number> = {
    eu: 1.0,
    us: 1.08,
    kr: 1.16,
    tw: 1.12,
  };
  const rulesetScale: Record<RealmSettings['ruleset'], number> = {
    pvp: 1.0,
    normal: 0.91,
    rp: 0.87,
    'rp-pvp': 0.96,
  };
  const factionScale: Record<RealmSettings['faction'], number> = {
    horde: 1.0,
    alliance: 0.97,
    blackwater: 1.18,
  };
  return regionScale[realm.region] * rulesetScale[realm.ruleset] * factionScale[realm.faction];
}

export function buildMockPrices(realm: RealmSettings): Record<number, AhItemPrice> {
  const mult = getRealmPriceMultiplier(realm);
  const items: Record<number, AhItemPrice> = {};

  for (const [itemId, name, minBuyout, marketPrice, listed, sold24h] of BASE_MOCK_ITEMS) {
    // Deterministic slight per-item variance per realm
    const seed = ((itemId * 2654435761) >>> 0) % 100;
    const itemJitter = 0.97 + (seed / 100) * 0.06;
    const scaledMin = Math.max(1, Math.round(minBuyout * mult * itemJitter));
    const scaledMarket = Math.max(scaledMin, Math.round(marketPrice * mult * itemJitter));

    items[itemId] = {
      itemId,
      name,
      minBuyout: scaledMin,
      marketPrice: scaledMarket,
      listed,
      sold24h,
    };
  }

  return items;
}
