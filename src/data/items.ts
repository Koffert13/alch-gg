import type { CatalogItem } from '../../shared/types';

/**
 * Classic WoW (1.12 / Era / Anniversary) Alchemy Item Catalog.
 * Includes vendor vials (with exact fixed vendor copper costs), herbs,
 * elementals, fish, reagents, bars, crafted consumables, and AH recipe scrolls.
 */
export const CATALOG_ITEMS: Record<number, CatalogItem> = {
  // === Vendor Vials (exact Classic vendor prices) ===
  3371: { itemId: 3371, name: 'Empty Vial', kind: 'vial', vendorPrice: 4 }, // 4c
  3372: { itemId: 3372, name: 'Leaded Vial', kind: 'vial', vendorPrice: 40 }, // 40c
  8925: { itemId: 8925, name: 'Crystal Vial', kind: 'vial', vendorPrice: 500 }, // 5s

  // === Herbs ===
  765: { itemId: 765, name: 'Silverleaf', kind: 'herb' },
  785: { itemId: 785, name: 'Mageroyal', kind: 'herb' },
  2447: { itemId: 2447, name: 'Peacebloom', kind: 'herb' },
  2449: { itemId: 2449, name: 'Earthroot', kind: 'herb' },
  2450: { itemId: 2450, name: 'Briarthorn', kind: 'herb' },
  2452: { itemId: 2452, name: 'Swiftthistle', kind: 'herb' },
  2453: { itemId: 2453, name: 'Bruiseweed', kind: 'herb' },
  3355: { itemId: 3355, name: 'Wild Steelbloom', kind: 'herb' },
  3356: { itemId: 3356, name: 'Kingsblood', kind: 'herb' },
  3357: { itemId: 3357, name: 'Liferoot', kind: 'herb' },
  3358: { itemId: 3358, name: "Khadgar's Whisker", kind: 'herb' },
  3369: { itemId: 3369, name: 'Grave Moss', kind: 'herb' },
  3818: { itemId: 3818, name: 'Fadeleaf', kind: 'herb' },
  3819: { itemId: 3819, name: 'Wintersbite', kind: 'herb' },
  3820: { itemId: 3820, name: 'Stranglekelp', kind: 'herb' },
  3821: { itemId: 3821, name: 'Goldthorn', kind: 'herb' },
  4625: { itemId: 4625, name: 'Firebloom', kind: 'herb' },
  8153: { itemId: 8153, name: 'Wildvine', kind: 'herb' },
  8831: { itemId: 8831, name: 'Purple Lotus', kind: 'herb' },
  8836: { itemId: 8836, name: "Arthas' Tears", kind: 'herb' },
  8838: { itemId: 8838, name: 'Sungrass', kind: 'herb' },
  8839: { itemId: 8839, name: 'Blindweed', kind: 'herb' },
  8845: { itemId: 8845, name: 'Ghost Mushroom', kind: 'herb' },
  8846: { itemId: 8846, name: 'Gromsblood', kind: 'herb' },
  13463: { itemId: 13463, name: 'Dreamfoil', kind: 'herb' },
  13464: { itemId: 13464, name: 'Golden Sansam', kind: 'herb' },
  13465: { itemId: 13465, name: 'Mountain Silversage', kind: 'herb' },
  13466: { itemId: 13466, name: 'Plaguebloom', kind: 'herb' },
  13467: { itemId: 13467, name: 'Icecap', kind: 'herb' },
  13468: { itemId: 13468, name: 'Black Lotus', kind: 'herb' },

  // === Fish & Aquatic ===
  6358: { itemId: 6358, name: 'Oily Blackmouth', kind: 'fish' },
  6359: { itemId: 6359, name: 'Firefin Snapper', kind: 'fish' },
  6522: { itemId: 6522, name: 'Deviate Fish', kind: 'fish' },
  13422: { itemId: 13422, name: 'Stonescale Eel', kind: 'fish' },

  // === Elementals & Essences ===
  7067: { itemId: 7067, name: 'Elemental Earth', kind: 'elemental' },
  7068: { itemId: 7068, name: 'Elemental Fire', kind: 'elemental' },
  7070: { itemId: 7070, name: 'Elemental Water', kind: 'elemental' },
  7076: { itemId: 7076, name: 'Essence of Earth', kind: 'elemental' },
  7077: { itemId: 7077, name: 'Heart of Fire', kind: 'elemental' },
  7078: { itemId: 7078, name: 'Essence of Fire', kind: 'elemental' },
  7080: { itemId: 7080, name: 'Essence of Water', kind: 'elemental' },
  7082: { itemId: 7082, name: 'Essence of Air', kind: 'elemental' },
  12803: { itemId: 12803, name: 'Living Essence', kind: 'elemental' },
  12808: { itemId: 12808, name: 'Essence of Undeath', kind: 'elemental' },

  // === Metals, Gems & Misc Reagents ===
  3164: { itemId: 3164, name: 'Discolored Worg Heart', kind: 'reagent' },
  3860: { itemId: 3860, name: 'Mithril Bar', kind: 'bar' },
  4402: { itemId: 4402, name: 'Small Flame Sac', kind: 'reagent' },
  5635: { itemId: 5635, name: 'Sharp Claw', kind: 'reagent' },
  5637: { itemId: 5637, name: 'Large Fang', kind: 'reagent' },
  6037: { itemId: 6037, name: 'Truesilver Bar', kind: 'bar' },
  9260: { itemId: 9260, name: 'Volatile Rum', kind: 'reagent' },
  10286: { itemId: 10286, name: 'Heart of the Wild', kind: 'reagent' },
  11176: { itemId: 11176, name: 'Dream Dust', kind: 'reagent' },
  12359: { itemId: 12359, name: 'Thorium Bar', kind: 'bar' },
  12360: { itemId: 12360, name: 'Arcanite Bar', kind: 'bar' },
  12363: { itemId: 12363, name: 'Arcane Crystal', kind: 'reagent' },

  // === Crafted Potions ===
  118: { itemId: 118, name: 'Minor Healing Potion', kind: 'consumable' },
  858: { itemId: 858, name: 'Lesser Healing Potion', kind: 'consumable' },
  929: { itemId: 929, name: 'Healing Potion', kind: 'consumable' },
  1710: { itemId: 1710, name: 'Greater Healing Potion', kind: 'consumable' },
  2455: { itemId: 2455, name: 'Minor Mana Potion', kind: 'consumable' },
  2459: { itemId: 2459, name: 'Swiftness Potion', kind: 'consumable' },
  3385: { itemId: 3385, name: 'Lesser Mana Potion', kind: 'consumable' },
  3387: { itemId: 3387, name: 'Limited Invulnerability Potion', kind: 'consumable' },
  3823: { itemId: 3823, name: 'Lesser Invisibility Potion', kind: 'consumable' },
  3827: { itemId: 3827, name: 'Mana Potion', kind: 'consumable' },
  3928: { itemId: 3928, name: 'Superior Healing Potion', kind: 'consumable' },
  4596: { itemId: 4596, name: 'Discolored Healing Potion', kind: 'consumable' },
  5631: { itemId: 5631, name: 'Rage Potion', kind: 'consumable' },
  5633: { itemId: 5633, name: 'Great Rage Potion', kind: 'consumable' },
  5634: { itemId: 5634, name: 'Free Action Potion', kind: 'consumable' },
  6149: { itemId: 6149, name: 'Greater Mana Potion', kind: 'consumable' },
  6372: { itemId: 6372, name: 'Swim Speed Potion', kind: 'consumable' },
  9030: { itemId: 9030, name: 'Restorative Potion', kind: 'consumable' },
  9144: { itemId: 9144, name: 'Wildvine Potion', kind: 'consumable' },
  9172: { itemId: 9172, name: 'Invisibility Potion', kind: 'consumable' },
  12190: { itemId: 12190, name: 'Dreamless Sleep Potion', kind: 'consumable' },
  13442: { itemId: 13442, name: 'Mighty Rage Potion', kind: 'consumable' },
  13443: { itemId: 13443, name: 'Superior Mana Potion', kind: 'consumable' },
  13444: { itemId: 13444, name: 'Major Mana Potion', kind: 'consumable' },
  13446: { itemId: 13446, name: 'Major Healing Potion', kind: 'consumable' },
  13462: { itemId: 13462, name: 'Purification Potion', kind: 'consumable' },
  18253: { itemId: 18253, name: 'Major Rejuvenation Potion', kind: 'consumable' },
  20002: { itemId: 20002, name: 'Greater Dreamless Sleep Potion', kind: 'consumable' },
  20004: { itemId: 20004, name: "Major Troll's Blood Potion", kind: 'consumable' },
  20008: { itemId: 20008, name: 'Living Action Potion', kind: 'consumable' },

  // === Crafted Protection Potions ===
  6048: { itemId: 6048, name: 'Shadow Protection Potion', kind: 'consumable' },
  6049: { itemId: 6049, name: 'Fire Protection Potion', kind: 'consumable' },
  6050: { itemId: 6050, name: 'Frost Protection Potion', kind: 'consumable' },
  6052: { itemId: 6052, name: 'Nature Protection Potion', kind: 'consumable' },
  13456: { itemId: 13456, name: 'Greater Frost Protection Potion', kind: 'consumable' },
  13457: { itemId: 13457, name: 'Greater Fire Protection Potion', kind: 'consumable' },
  13458: { itemId: 13458, name: 'Greater Nature Protection Potion', kind: 'consumable' },
  13459: { itemId: 13459, name: 'Greater Shadow Protection Potion', kind: 'consumable' },
  13461: { itemId: 13461, name: 'Greater Arcane Protection Potion', kind: 'consumable' },

  // === Crafted Elixirs ===
  2457: { itemId: 2457, name: 'Elixir of Minor Agility', kind: 'consumable' },
  3390: { itemId: 3390, name: 'Elixir of Lesser Agility', kind: 'consumable' },
  3825: { itemId: 3825, name: 'Elixir of Fortitude', kind: 'consumable' },
  6373: { itemId: 6373, name: 'Elixir of Firepower', kind: 'consumable' },
  6662: { itemId: 6662, name: 'Elixir of Giant Growth', kind: 'consumable' },
  8949: { itemId: 8949, name: 'Elixir of Agility', kind: 'consumable' },
  8951: { itemId: 8951, name: 'Elixir of Greater Defense', kind: 'consumable' },
  9088: { itemId: 9088, name: 'Gift of Arthas', kind: 'consumable' },
  9155: { itemId: 9155, name: 'Arcane Elixir', kind: 'consumable' },
  9179: { itemId: 9179, name: 'Elixir of Greater Intellect', kind: 'consumable' },
  9187: { itemId: 9187, name: 'Elixir of Greater Agility', kind: 'consumable' },
  9206: { itemId: 9206, name: 'Elixir of Giants', kind: 'consumable' },
  9224: { itemId: 9224, name: 'Elixir of Demonslaying', kind: 'consumable' },
  9264: { itemId: 9264, name: 'Elixir of Shadow Power', kind: 'consumable' },
  13445: { itemId: 13445, name: 'Elixir of Superior Defense', kind: 'consumable' },
  13447: { itemId: 13447, name: 'Elixir of the Sages', kind: 'consumable' },
  13452: { itemId: 13452, name: 'Elixir of the Mongoose', kind: 'consumable' },
  13453: { itemId: 13453, name: 'Elixir of Brute Force', kind: 'consumable' },
  13454: { itemId: 13454, name: 'Greater Arcane Elixir', kind: 'consumable' },
  17708: { itemId: 17708, name: 'Elixir of Frost Power', kind: 'consumable' },
  20007: { itemId: 20007, name: 'Mageblood Potion', kind: 'consumable' },
  21546: { itemId: 21546, name: 'Elixir of Greater Firepower', kind: 'consumable' },

  // === Crafted Oils ===
  3824: { itemId: 3824, name: 'Shadow Oil', kind: 'consumable' },
  3829: { itemId: 3829, name: 'Frost Oil', kind: 'consumable' },
  6370: { itemId: 6370, name: 'Blackmouth Oil', kind: 'consumable' },
  6371: { itemId: 6371, name: 'Fire Oil', kind: 'consumable' },
  8956: { itemId: 8956, name: 'Oil of Immolation', kind: 'consumable' },
  9061: { itemId: 9061, name: 'Goblin Rocket Fuel', kind: 'consumable' },
  13423: { itemId: 13423, name: 'Stonescale Oil', kind: 'consumable' },

  // === Crafted Flasks ===
  13506: { itemId: 13506, name: 'Flask of Petrification', kind: 'consumable' },
  13510: { itemId: 13510, name: 'Flask of the Titans', kind: 'consumable' },
  13511: { itemId: 13511, name: 'Flask of Distilled Wisdom', kind: 'consumable' },
  13512: { itemId: 13512, name: 'Flask of Supreme Power', kind: 'consumable' },
  13513: { itemId: 13513, name: 'Flask of Chromatic Resistance', kind: 'consumable' },

  // === AH Alchemy Recipe Scrolls (/category/recipe/alchemy?n=200) ===
  2553: { itemId: 2553, name: 'Recipe: Elixir of Minor Agility', kind: 'recipe' },
  2555: { itemId: 2555, name: 'Recipe: Swiftness Potion', kind: 'recipe' },
  3393: { itemId: 3393, name: 'Recipe: Elixir of Lesser Agility', kind: 'recipe' },
  3396: { itemId: 3396, name: 'Recipe: Limited Invulnerability Potion', kind: 'recipe' },
  6663: { itemId: 6663, name: 'Recipe: Elixir of Giant Growth', kind: 'recipe' },
  9293: { itemId: 9293, name: 'Recipe: Goblin Rocket Fuel', kind: 'recipe' },
  9294: { itemId: 9294, name: 'Recipe: Gift of Arthas', kind: 'recipe' },
  9295: { itemId: 9295, name: 'Recipe: Wildvine Potion', kind: 'recipe' },
  9298: { itemId: 9298, name: 'Recipe: Invisibility Potion', kind: 'recipe' },
  9300: { itemId: 9300, name: 'Recipe: Elixir of Greater Agility', kind: 'recipe' },
  9301: { itemId: 9301, name: 'Recipe: Elixir of Giants', kind: 'recipe' },
  13476: { itemId: 13476, name: 'Recipe: Mighty Rage Potion', kind: 'recipe' },
  13477: { itemId: 13477, name: 'Recipe: Elixir of the Sages', kind: 'recipe' },
  13481: { itemId: 13481, name: 'Recipe: Major Mana Potion', kind: 'recipe' },
  13482: { itemId: 13482, name: 'Recipe: Transmute Air to Fire', kind: 'recipe' },
  13484: { itemId: 13484, name: 'Recipe: Transmute Water to Air', kind: 'recipe' },
  13485: { itemId: 13485, name: 'Recipe: Transmute Undeath to Water', kind: 'recipe' },
  13489: { itemId: 13489, name: 'Recipe: Transmute Life to Earth', kind: 'recipe' },
  13491: { itemId: 13491, name: 'Recipe: Elixir of the Mongoose', kind: 'recipe' },
  13492: { itemId: 13492, name: 'Recipe: Greater Arcane Elixir', kind: 'recipe' },
  13493: { itemId: 13493, name: 'Recipe: Purification Potion', kind: 'recipe' },
  13494: { itemId: 13494, name: 'Recipe: Greater Fire Protection Potion', kind: 'recipe' },
  13495: { itemId: 13495, name: 'Recipe: Greater Frost Protection Potion', kind: 'recipe' },
  13496: { itemId: 13496, name: 'Recipe: Greater Nature Protection Potion', kind: 'recipe' },
  13497: { itemId: 13497, name: 'Recipe: Greater Arcane Protection Potion', kind: 'recipe' },
  13499: { itemId: 13499, name: 'Recipe: Greater Shadow Protection Potion', kind: 'recipe' },
  13517: { itemId: 13517, name: 'Recipe: Flask of Petrification', kind: 'recipe' },
  13518: { itemId: 13518, name: 'Recipe: Flask of the Titans', kind: 'recipe' },
  13519: { itemId: 13519, name: 'Recipe: Flask of Distilled Wisdom', kind: 'recipe' },
  13520: { itemId: 13520, name: 'Recipe: Flask of Supreme Power', kind: 'recipe' },
  13521: { itemId: 13521, name: 'Recipe: Flask of Chromatic Resistance', kind: 'recipe' },
  17709: { itemId: 17709, name: 'Recipe: Elixir of Frost Power', kind: 'recipe' },
  18257: { itemId: 18257, name: 'Recipe: Major Rejuvenation Potion', kind: 'recipe' },
  21547: { itemId: 21547, name: 'Recipe: Elixir of Greater Firepower', kind: 'recipe' },
};

export function getCatalogItemName(itemId: number, fallbackName?: string): string {
  return CATALOG_ITEMS[itemId]?.name ?? fallbackName ?? `Item #${itemId}`;
}

export function getVendorPrice(itemId: number): number | undefined {
  return CATALOG_ITEMS[itemId]?.vendorPrice;
}
