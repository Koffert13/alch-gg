import type { AlchemyRecipe } from '../../shared/types';

/**
 * Pre-loaded World of Warcraft Classic (1-300) Alchemy Database.
 * 75 iconic potions, elixirs, protection potions, oils, flasks, and transmutes
 * with exact Classic ingredients, vendor vials, yields, and acquisition metadata.
 */
export const CLASSIC_ALCHEMY_RECIPES: AlchemyRecipe[] = [
  // =========================================================================
  // POTIONS
  // =========================================================================
  {
    id: 'minor-healing-potion',
    name: 'Minor Healing Potion',
    outputItemId: 118,
    category: 'potion',
    skillRequired: 1,
    yield: 1,
    ingredients: [
      { itemId: 2447, qty: 1 }, // Peacebloom
      { itemId: 765, qty: 1 }, // Silverleaf
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'minor-mana-potion',
    name: 'Minor Mana Potion',
    outputItemId: 2455,
    category: 'potion',
    skillRequired: 25,
    yield: 1,
    ingredients: [
      { itemId: 785, qty: 1 }, // Mageroyal
      { itemId: 765, qty: 1 }, // Silverleaf
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 100, // 1s
    },
  },
  {
    id: 'discolored-healing-potion',
    name: 'Discolored Healing Potion',
    outputItemId: 4596,
    category: 'potion',
    skillRequired: 50,
    yield: 1,
    ingredients: [
      { itemId: 3164, qty: 1 }, // Discolored Worg Heart
      { itemId: 2447, qty: 1 }, // Peacebloom
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    acquisition: {
      type: 'quest',
      sourceLabel: 'Quest: Wild Hearts (Horde)',
      location: 'Silverpine Forest',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'lesser-healing-potion',
    name: 'Lesser Healing Potion',
    outputItemId: 858,
    category: 'potion',
    skillRequired: 55,
    yield: 1,
    ingredients: [
      { itemId: 118, qty: 1 }, // Minor Healing Potion
      { itemId: 2450, qty: 1 }, // Briarthorn
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 100, // 1s
    },
  },
  {
    id: 'swiftness-potion',
    name: 'Swiftness Potion',
    outputItemId: 2459,
    category: 'potion',
    skillRequired: 60,
    yield: 1,
    ingredients: [
      { itemId: 2452, qty: 1 }, // Swiftthistle
      { itemId: 2450, qty: 1 }, // Briarthorn
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    recipeItemId: 2555,
    recipeScrollName: 'Recipe: Swiftness Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 10-25)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'rage-potion',
    name: 'Rage Potion',
    outputItemId: 5631,
    category: 'potion',
    skillRequired: 60,
    yield: 1,
    ingredients: [
      { itemId: 5635, qty: 1 }, // Sharp Claw
      { itemId: 2450, qty: 1 }, // Briarthorn
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Hagrus (H) / Xandar Goodbeard (A)',
      location: 'Orgrimmar / Loch Modan',
      fixedCostCopper: 100, // 1s
    },
  },
  {
    id: 'swim-speed-potion',
    name: 'Swim Speed Potion',
    outputItemId: 6372,
    category: 'potion',
    skillRequired: 100,
    yield: 1,
    ingredients: [
      { itemId: 2452, qty: 1 }, // Swiftthistle
      { itemId: 6370, qty: 1 }, // Blackmouth Oil
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 400, // 4s
    },
  },
  {
    id: 'healing-potion',
    name: 'Healing Potion',
    outputItemId: 929,
    category: 'potion',
    skillRequired: 110,
    yield: 1,
    ingredients: [
      { itemId: 2453, qty: 1 }, // Bruiseweed
      { itemId: 2450, qty: 1 }, // Briarthorn
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 500, // 5s
    },
  },
  {
    id: 'lesser-mana-potion',
    name: 'Lesser Mana Potion',
    outputItemId: 3385,
    category: 'potion',
    skillRequired: 120,
    yield: 1,
    ingredients: [
      { itemId: 785, qty: 1 }, // Mageroyal
      { itemId: 3820, qty: 1 }, // Stranglekelp
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 500, // 5s
    },
  },
  {
    id: 'free-action-potion',
    name: 'Free Action Potion',
    outputItemId: 5634,
    category: 'potion',
    skillRequired: 150,
    yield: 1,
    ingredients: [
      { itemId: 6370, qty: 2 }, // Blackmouth Oil
      { itemId: 3820, qty: 1 }, // Stranglekelp
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: "Kor'geld (H) / Soolie Berryfizz (A)",
      location: 'Orgrimmar / Ironforge',
      fixedCostCopper: 1800, // 18s
    },
  },
  {
    id: 'greater-healing-potion',
    name: 'Greater Healing Potion',
    outputItemId: 1710,
    category: 'potion',
    skillRequired: 155,
    yield: 1,
    ingredients: [
      { itemId: 3357, qty: 1 }, // Liferoot
      { itemId: 3356, qty: 1 }, // Kingsblood
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 2000, // 20s
    },
  },
  {
    id: 'mana-potion',
    name: 'Mana Potion',
    outputItemId: 3827,
    category: 'potion',
    skillRequired: 160,
    yield: 1,
    ingredients: [
      { itemId: 3820, qty: 1 }, // Stranglekelp
      { itemId: 3356, qty: 1 }, // Kingsblood
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 2000, // 20s
    },
  },
  {
    id: 'lesser-invisibility-potion',
    name: 'Lesser Invisibility Potion',
    outputItemId: 3823,
    category: 'potion',
    skillRequired: 165,
    yield: 1,
    ingredients: [
      { itemId: 3818, qty: 1 }, // Fadeleaf
      { itemId: 3355, qty: 1 }, // Wild Steelbloom
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 2500, // 25s
    },
  },
  {
    id: 'great-rage-potion',
    name: 'Great Rage Potion',
    outputItemId: 5633,
    category: 'potion',
    skillRequired: 175,
    yield: 1,
    ingredients: [
      { itemId: 5637, qty: 1 }, // Large Fang
      { itemId: 3356, qty: 1 }, // Kingsblood
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Hagrus (H) / Ulthir (A)',
      location: 'Orgrimmar / Darnassus',
      fixedCostCopper: 2000, // 20s
    },
  },
  {
    id: 'restorative-potion',
    name: 'Restorative Potion',
    outputItemId: 9030,
    category: 'potion',
    skillRequired: 195,
    yield: 1,
    ingredients: [
      { itemId: 7067, qty: 1 }, // Elemental Earth
      { itemId: 3821, qty: 1 }, // Goldthorn
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'quest',
      sourceLabel: 'Quest: Badlands Reagent Run II',
      location: 'Badlands',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'greater-mana-potion',
    name: 'Greater Mana Potion',
    outputItemId: 6149,
    category: 'potion',
    skillRequired: 205,
    yield: 1,
    ingredients: [
      { itemId: 3358, qty: 1 }, // Khadgar's Whisker
      { itemId: 3821, qty: 1 }, // Goldthorn
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 4000, // 40s
    },
  },
  {
    id: 'superior-healing-potion',
    name: 'Superior Healing Potion',
    outputItemId: 3928,
    category: 'potion',
    skillRequired: 215,
    yield: 1,
    ingredients: [
      { itemId: 8838, qty: 1 }, // Sungrass
      { itemId: 3358, qty: 1 }, // Khadgar's Whisker
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 5000, // 50s
    },
  },
  {
    id: 'wildvine-potion',
    name: 'Wildvine Potion',
    outputItemId: 9144,
    category: 'potion',
    skillRequired: 225,
    yield: 1,
    ingredients: [
      { itemId: 8153, qty: 1 }, // Wildvine
      { itemId: 8831, qty: 1 }, // Purple Lotus
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 9295,
    recipeScrollName: 'Recipe: Wildvine Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Trolls (Hinterlands / STV)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'dreamless-sleep-potion',
    name: 'Dreamless Sleep Potion',
    outputItemId: 12190,
    category: 'potion',
    skillRequired: 230,
    yield: 1,
    ingredients: [
      { itemId: 8831, qty: 3 }, // Purple Lotus
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 6000, // 60s
    },
  },
  {
    id: 'invisibility-potion',
    name: 'Invisibility Potion',
    outputItemId: 9172,
    category: 'potion',
    skillRequired: 235,
    yield: 1,
    ingredients: [
      { itemId: 8845, qty: 1 }, // Ghost Mushroom
      { itemId: 8838, qty: 1 }, // Sungrass
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 9298,
    recipeScrollName: 'Recipe: Invisibility Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 40-55)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'limited-invulnerability-potion',
    name: 'Limited Invulnerability Potion',
    outputItemId: 3387,
    category: 'potion',
    skillRequired: 250,
    yield: 1,
    ingredients: [
      { itemId: 8839, qty: 2 }, // Blindweed
      { itemId: 8845, qty: 1 }, // Ghost Mushroom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 3396,
    recipeScrollName: 'Recipe: Limited Invulnerability Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 45-58)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'mighty-rage-potion',
    name: 'Mighty Rage Potion',
    outputItemId: 13442,
    category: 'potion',
    skillRequired: 255,
    yield: 1,
    ingredients: [
      { itemId: 8846, qty: 3 }, // Gromsblood
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13476,
    recipeScrollName: 'Recipe: Mighty Rage Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Blackrock Slayer',
      location: 'Burning Steppes / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'superior-mana-potion',
    name: 'Superior Mana Potion',
    outputItemId: 13443,
    category: 'potion',
    skillRequired: 260,
    yield: 1,
    ingredients: [
      { itemId: 8838, qty: 2 }, // Sungrass
      { itemId: 8839, qty: 2 }, // Blindweed
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Algernon (H) / Ulthir (A)',
      location: 'Undercity / Darnassus (Limited)',
      fixedCostCopper: 12000, // 1g 20s
    },
  },
  {
    id: 'major-healing-potion',
    name: 'Major Healing Potion',
    outputItemId: 13446,
    category: 'potion',
    skillRequired: 275,
    yield: 1,
    ingredients: [
      { itemId: 13464, qty: 2 }, // Golden Sansam
      { itemId: 13465, qty: 1 }, // Mountain Silversage
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Evie Whirlbrew',
      location: 'Everlook, Winterspring (Limited)',
      fixedCostCopper: 15000, // 1g 50s
    },
  },
  {
    id: 'greater-dreamless-sleep-potion',
    name: 'Greater Dreamless Sleep Potion',
    outputItemId: 20002,
    category: 'potion',
    skillRequired: 275,
    yield: 1,
    ingredients: [
      { itemId: 13463, qty: 2 }, // Dreamfoil
      { itemId: 13464, qty: 1 }, // Golden Sansam
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'reputation',
      sourceLabel: "Zandalar Tribe — Rin'wosho",
      location: 'Yojamba Isle, STV',
      fixedCostCopper: 50000, // 5g
      reputationStanding: 'Friendly',
    },
  },
  {
    id: 'living-action-potion',
    name: 'Living Action Potion',
    outputItemId: 20008,
    category: 'potion',
    skillRequired: 285,
    yield: 1,
    ingredients: [
      { itemId: 13467, qty: 2 }, // Icecap
      { itemId: 13465, qty: 2 }, // Mountain Silversage
      { itemId: 10286, qty: 2 }, // Heart of the Wild
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'reputation',
      sourceLabel: "Zandalar Tribe — Rin'wosho",
      location: 'Yojamba Isle, STV',
      fixedCostCopper: 50000, // 5g
      reputationStanding: 'Exalted',
    },
  },
  {
    id: 'purification-potion',
    name: 'Purification Potion',
    outputItemId: 13462,
    category: 'potion',
    skillRequired: 285,
    yield: 1,
    ingredients: [
      { itemId: 13467, qty: 2 }, // Icecap
      { itemId: 13466, qty: 2 }, // Plaguebloom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13493,
    recipeScrollName: 'Recipe: Purification Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 55-60)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'major-trolls-blood-potion',
    name: "Major Troll's Blood Potion",
    outputItemId: 20004,
    category: 'potion',
    skillRequired: 290,
    yield: 1,
    ingredients: [
      { itemId: 8846, qty: 1 }, // Gromsblood
      { itemId: 13466, qty: 2 }, // Plaguebloom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'reputation',
      sourceLabel: "Zandalar Tribe — Rin'wosho",
      location: 'Yojamba Isle, STV',
      fixedCostCopper: 50000, // 5g
      reputationStanding: 'Honored',
    },
  },
  {
    id: 'major-mana-potion',
    name: 'Major Mana Potion',
    outputItemId: 13444,
    category: 'potion',
    skillRequired: 295,
    yield: 1,
    ingredients: [
      { itemId: 13463, qty: 3 }, // Dreamfoil
      { itemId: 13467, qty: 2 }, // Icecap
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13481,
    recipeScrollName: 'Recipe: Major Mana Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Darkmaster Gandling / Magnus Frostwake',
      location: 'Scholomance / Caer Darrow',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'major-rejuvenation-potion',
    name: 'Major Rejuvenation Potion',
    outputItemId: 18253,
    category: 'potion',
    skillRequired: 300,
    yield: 1,
    ingredients: [
      { itemId: 10286, qty: 1 }, // Heart of the Wild
      { itemId: 13464, qty: 4 }, // Golden Sansam
      { itemId: 13463, qty: 4 }, // Dreamfoil
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 18257,
    recipeScrollName: 'Recipe: Major Rejuvenation Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Molten Core Bosses',
      location: 'Molten Core / AH',
      fixedCostCopper: 0,
    },
  },

  // =========================================================================
  // PROTECTION POTIONS
  // =========================================================================
  {
    id: 'shadow-protection-potion',
    name: 'Shadow Protection Potion',
    outputItemId: 6048,
    category: 'protection',
    skillRequired: 135,
    yield: 1,
    ingredients: [
      { itemId: 3369, qty: 1 }, // Grave Moss
      { itemId: 3356, qty: 1 }, // Kingsblood
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Christoph Jeffcoat (H) / Harklan Moongrove (A)',
      location: 'Hillsbrad / Ashenvale',
      fixedCostCopper: 900, // 9s
    },
  },
  {
    id: 'fire-protection-potion',
    name: 'Fire Protection Potion',
    outputItemId: 6049,
    category: 'protection',
    skillRequired: 165,
    yield: 1,
    ingredients: [
      { itemId: 4402, qty: 1 }, // Small Flame Sac
      { itemId: 6371, qty: 1 }, // Fire Oil
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Jeeda (H) / Nandar Branson (A)',
      location: 'Stonetalon / Hillsbrad',
      fixedCostCopper: 1500, // 15s
    },
  },
  {
    id: 'frost-protection-potion',
    name: 'Frost Protection Potion',
    outputItemId: 6050,
    category: 'protection',
    skillRequired: 190,
    yield: 1,
    ingredients: [
      { itemId: 3819, qty: 1 }, // Wintersbite
      { itemId: 3821, qty: 1 }, // Goldthorn
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: "Glyx Brewright / Bro'kin",
      location: 'Booty Bay / Alterac Mountains',
      fixedCostCopper: 2000, // 20s
    },
  },
  {
    id: 'nature-protection-potion',
    name: 'Nature Protection Potion',
    outputItemId: 6052,
    category: 'protection',
    skillRequired: 190,
    yield: 1,
    ingredients: [
      { itemId: 3357, qty: 1 }, // Liferoot
      { itemId: 3820, qty: 1 }, // Stranglekelp
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Bronk (H) / Logannas (A)',
      location: 'Feralas',
      fixedCostCopper: 2000, // 20s
    },
  },
  {
    id: 'greater-fire-protection-potion',
    name: 'Greater Fire Protection Potion',
    outputItemId: 13457,
    category: 'protection',
    skillRequired: 290,
    yield: 1,
    ingredients: [
      { itemId: 7068, qty: 1 }, // Elemental Fire
      { itemId: 13463, qty: 1 }, // Dreamfoil
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13494,
    recipeScrollName: 'Recipe: Greater Fire Protection Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Firebrand Pyromancer',
      location: 'Lower Blackrock Spire / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'greater-frost-protection-potion',
    name: 'Greater Frost Protection Potion',
    outputItemId: 13456,
    category: 'protection',
    skillRequired: 290,
    yield: 1,
    ingredients: [
      { itemId: 7070, qty: 1 }, // Elemental Water
      { itemId: 13463, qty: 1 }, // Dreamfoil
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13495,
    recipeScrollName: 'Recipe: Greater Frost Protection Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Frostmaul Giant',
      location: 'Winterspring / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'greater-nature-protection-potion',
    name: 'Greater Nature Protection Potion',
    outputItemId: 13458,
    category: 'protection',
    skillRequired: 290,
    yield: 1,
    ingredients: [
      { itemId: 7067, qty: 1 }, // Elemental Earth
      { itemId: 13463, qty: 1 }, // Dreamfoil
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13496,
    recipeScrollName: 'Recipe: Greater Nature Protection Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Rotting Behemoth / Decaying Horror',
      location: 'Western Plaguelands / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'greater-arcane-protection-potion',
    name: 'Greater Arcane Protection Potion',
    outputItemId: 13461,
    category: 'protection',
    skillRequired: 290,
    yield: 1,
    ingredients: [
      { itemId: 11176, qty: 1 }, // Dream Dust
      { itemId: 13463, qty: 1 }, // Dreamfoil
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13497,
    recipeScrollName: 'Recipe: Greater Arcane Protection Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Cobalt Mageweaver',
      location: 'Winterspring / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'greater-shadow-protection-potion',
    name: 'Greater Shadow Protection Potion',
    outputItemId: 13459,
    category: 'protection',
    skillRequired: 290,
    yield: 1,
    ingredients: [
      { itemId: 3824, qty: 1 }, // Shadow Oil
      { itemId: 13463, qty: 1 }, // Dreamfoil
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13499,
    recipeScrollName: 'Recipe: Greater Shadow Protection Potion',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Dark Adept / Shadowmage',
      location: 'Eastern Plaguelands / AH',
      fixedCostCopper: 0,
    },
  },

  // =========================================================================
  // ELIXIRS
  // =========================================================================
  {
    id: 'elixir-of-minor-agility',
    name: 'Elixir of Minor Agility',
    outputItemId: 2457,
    category: 'elixir',
    skillRequired: 50,
    yield: 1,
    ingredients: [
      { itemId: 2452, qty: 1 }, // Swiftthistle
      { itemId: 765, qty: 1 }, // Silverleaf
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    recipeItemId: 2553,
    recipeScrollName: 'Recipe: Elixir of Minor Agility',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 10-20)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'elixir-of-giant-growth',
    name: 'Elixir of Giant Growth',
    outputItemId: 6662,
    category: 'elixir',
    skillRequired: 90,
    yield: 1,
    ingredients: [
      { itemId: 6522, qty: 1 }, // Deviate Fish
      { itemId: 2449, qty: 1 }, // Earthroot
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    recipeItemId: 6663,
    recipeScrollName: 'Recipe: Elixir of Giant Growth',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Barrens Creatures / World Drop',
      location: 'The Barrens / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'elixir-of-lesser-agility',
    name: 'Elixir of Lesser Agility',
    outputItemId: 3390,
    category: 'elixir',
    skillRequired: 140,
    yield: 1,
    ingredients: [
      { itemId: 3355, qty: 1 }, // Wild Steelbloom
      { itemId: 2452, qty: 1 }, // Swiftthistle
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    recipeItemId: 3393,
    recipeScrollName: 'Recipe: Elixir of Lesser Agility',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 20-35)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'elixir-of-firepower',
    name: 'Elixir of Firepower',
    outputItemId: 6373,
    category: 'elixir',
    skillRequired: 140,
    yield: 1,
    ingredients: [
      { itemId: 6371, qty: 2 }, // Fire Oil
      { itemId: 3356, qty: 1 }, // Kingsblood
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 1000, // 10s
    },
  },
  {
    id: 'elixir-of-fortitude',
    name: 'Elixir of Fortitude',
    outputItemId: 3825,
    category: 'elixir',
    skillRequired: 175,
    yield: 1,
    ingredients: [
      { itemId: 3355, qty: 1 }, // Wild Steelbloom
      { itemId: 3821, qty: 1 }, // Goldthorn
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 2500, // 25s
    },
  },
  {
    id: 'elixir-of-agility',
    name: 'Elixir of Agility',
    outputItemId: 8949,
    category: 'elixir',
    skillRequired: 185,
    yield: 1,
    ingredients: [
      { itemId: 3820, qty: 1 }, // Stranglekelp
      { itemId: 3821, qty: 1 }, // Goldthorn
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 3500, // 35s
    },
  },
  {
    id: 'elixir-of-frost-power',
    name: 'Elixir of Frost Power',
    outputItemId: 17708,
    category: 'elixir',
    skillRequired: 190,
    yield: 1,
    ingredients: [
      { itemId: 3819, qty: 2 }, // Wintersbite
      { itemId: 3358, qty: 1 }, // Khadgar's Whisker
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    recipeItemId: 17709,
    recipeScrollName: 'Recipe: Elixir of Frost Power',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Feast of Winter Veil Gift',
      location: 'Seasonal Event / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'elixir-of-greater-defense',
    name: 'Elixir of Greater Defense',
    outputItemId: 8951,
    category: 'elixir',
    skillRequired: 195,
    yield: 1,
    ingredients: [
      { itemId: 3355, qty: 1 }, // Wild Steelbloom
      { itemId: 3821, qty: 1 }, // Goldthorn
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 4000, // 40s
    },
  },
  {
    id: 'arcane-elixir',
    name: 'Arcane Elixir',
    outputItemId: 9155,
    category: 'elixir',
    skillRequired: 235,
    yield: 1,
    ingredients: [
      { itemId: 8839, qty: 1 }, // Blindweed
      { itemId: 3821, qty: 1 }, // Goldthorn
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 6500, // 65s
    },
  },
  {
    id: 'elixir-of-greater-intellect',
    name: 'Elixir of Greater Intellect',
    outputItemId: 9179,
    category: 'elixir',
    skillRequired: 235,
    yield: 1,
    ingredients: [
      { itemId: 8839, qty: 1 }, // Blindweed
      { itemId: 3358, qty: 1 }, // Khadgar's Whisker
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 6500, // 65s
    },
  },
  {
    id: 'elixir-of-greater-agility',
    name: 'Elixir of Greater Agility',
    outputItemId: 9187,
    category: 'elixir',
    skillRequired: 240,
    yield: 1,
    ingredients: [
      { itemId: 8838, qty: 1 }, // Sungrass
      { itemId: 3821, qty: 1 }, // Goldthorn
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 9300,
    recipeScrollName: 'Recipe: Elixir of Greater Agility',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 45-58)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'gift-of-arthas',
    name: 'Gift of Arthas',
    outputItemId: 9088,
    category: 'elixir',
    skillRequired: 240,
    yield: 1,
    ingredients: [
      { itemId: 8836, qty: 1 }, // Arthas' Tears
      { itemId: 8839, qty: 1 }, // Blindweed
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 9294,
    recipeScrollName: 'Recipe: Gift of Arthas',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Skeletal Flayer / Slavering Ghoul',
      location: 'Western Plaguelands / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'elixir-of-giants',
    name: 'Elixir of Giants',
    outputItemId: 9206,
    category: 'elixir',
    skillRequired: 245,
    yield: 1,
    ingredients: [
      { itemId: 8838, qty: 1 }, // Sungrass
      { itemId: 8846, qty: 1 }, // Gromsblood
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 9301,
    recipeScrollName: 'Recipe: Elixir of Giants',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 48-60)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'elixir-of-demonslaying',
    name: 'Elixir of Demonslaying',
    outputItemId: 9224,
    category: 'elixir',
    skillRequired: 250,
    yield: 1,
    ingredients: [
      { itemId: 8846, qty: 1 }, // Gromsblood
      { itemId: 8845, qty: 1 }, // Ghost Mushroom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Rartar (H) / Nina Lightbrew (A)',
      location: 'Swamp of Sorrows / Blasted Lands',
      fixedCostCopper: 10000, // 1g
    },
  },
  {
    id: 'elixir-of-shadow-power',
    name: 'Elixir of Shadow Power',
    outputItemId: 9264,
    category: 'elixir',
    skillRequired: 250,
    yield: 1,
    ingredients: [
      { itemId: 8845, qty: 3 }, // Ghost Mushroom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Algernon (H) / Maria Lumere (A)',
      location: 'Undercity / Stormwind (Limited)',
      fixedCostCopper: 15000, // 1g 50s
    },
  },
  {
    id: 'elixir-of-greater-firepower',
    name: 'Elixir of Greater Firepower',
    outputItemId: 21546,
    category: 'elixir',
    skillRequired: 250,
    yield: 1,
    ingredients: [
      { itemId: 6371, qty: 3 }, // Fire Oil
      { itemId: 4625, qty: 3 }, // Firebloom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 21547,
    recipeScrollName: 'Recipe: Elixir of Greater Firepower',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Dark Iron Taskmaster / Slaver',
      location: 'Searing Gorge / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'elixir-of-superior-defense',
    name: 'Elixir of Superior Defense',
    outputItemId: 13445,
    category: 'elixir',
    skillRequired: 265,
    yield: 1,
    ingredients: [
      { itemId: 13423, qty: 2 }, // Stonescale Oil
      { itemId: 8838, qty: 1 }, // Sungrass
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: "Kor'geld (H) / Soolie Berryfizz (A)",
      location: 'Orgrimmar / Ironforge (Limited)',
      fixedCostCopper: 13000, // 1g 30s
    },
  },
  {
    id: 'elixir-of-the-sages',
    name: 'Elixir of the Sages',
    outputItemId: 13447,
    category: 'elixir',
    skillRequired: 270,
    yield: 1,
    ingredients: [
      { itemId: 13463, qty: 1 }, // Dreamfoil
      { itemId: 13466, qty: 2 }, // Plaguebloom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13477,
    recipeScrollName: 'Recipe: Elixir of the Sages',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Scarlet Cleric / Enchanter',
      location: 'Eastern Plaguelands / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'elixir-of-brute-force',
    name: 'Elixir of Brute Force',
    outputItemId: 13453,
    category: 'elixir',
    skillRequired: 275,
    yield: 1,
    ingredients: [
      { itemId: 8846, qty: 2 }, // Gromsblood
      { itemId: 13466, qty: 2 }, // Plaguebloom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'quest',
      sourceLabel: "Quest: Dadanga is Hungry (Un'Goro)",
      location: "Un'Goro Crater",
      fixedCostCopper: 0,
    },
  },
  {
    id: 'mageblood-potion',
    name: 'Mageblood Potion',
    outputItemId: 20007,
    category: 'elixir',
    skillRequired: 275,
    yield: 1,
    ingredients: [
      { itemId: 13463, qty: 1 }, // Dreamfoil
      { itemId: 13466, qty: 2 }, // Plaguebloom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'reputation',
      sourceLabel: "Zandalar Tribe — Rin'wosho",
      location: 'Yojamba Isle, STV',
      fixedCostCopper: 50000, // 5g
      reputationStanding: 'Revered',
    },
  },
  {
    id: 'elixir-of-the-mongoose',
    name: 'Elixir of the Mongoose',
    outputItemId: 13452,
    category: 'elixir',
    skillRequired: 280,
    yield: 1,
    ingredients: [
      { itemId: 13465, qty: 2 }, // Mountain Silversage
      { itemId: 13466, qty: 2 }, // Plaguebloom
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13491,
    recipeScrollName: 'Recipe: Elixir of the Mongoose',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Jadefire Rogue / Legashi Rogue',
      location: 'Felwood / Azshara / AH',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'greater-arcane-elixir',
    name: 'Greater Arcane Elixir',
    outputItemId: 13454,
    category: 'elixir',
    skillRequired: 285,
    yield: 1,
    ingredients: [
      { itemId: 13463, qty: 3 }, // Dreamfoil
      { itemId: 13465, qty: 1 }, // Mountain Silversage
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13492,
    recipeScrollName: 'Recipe: Greater Arcane Elixir',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 54-60)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
  },

  // =========================================================================
  // OILS
  // =========================================================================
  {
    id: 'blackmouth-oil',
    name: 'Blackmouth Oil',
    outputItemId: 6370,
    category: 'oil',
    skillRequired: 80,
    yield: 1,
    ingredients: [
      { itemId: 6358, qty: 2 }, // Oily Blackmouth
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 250, // 2s 50c
    },
  },
  {
    id: 'fire-oil',
    name: 'Fire Oil',
    outputItemId: 6371,
    category: 'oil',
    skillRequired: 130,
    yield: 1,
    ingredients: [
      { itemId: 6359, qty: 2 }, // Firefin Snapper
      { itemId: 3371, qty: 1 }, // Empty Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 800, // 8s
    },
  },
  {
    id: 'shadow-oil',
    name: 'Shadow Oil',
    outputItemId: 3824,
    category: 'oil',
    skillRequired: 165,
    yield: 1,
    ingredients: [
      { itemId: 3818, qty: 4 }, // Fadeleaf
      { itemId: 3369, qty: 4 }, // Grave Moss
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Montarr (H) / Bliztik (A)',
      location: 'Thousand Needles / Duskwood',
      fixedCostCopper: 1500, // 15s
    },
  },
  {
    id: 'frost-oil',
    name: 'Frost Oil',
    outputItemId: 3829,
    category: 'oil',
    skillRequired: 200,
    yield: 1,
    ingredients: [
      { itemId: 3358, qty: 4 }, // Khadgar's Whisker
      { itemId: 3819, qty: 2 }, // Wintersbite
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: "Bro'kin",
      location: 'Alterac Mountains (Limited)',
      fixedCostCopper: 2500, // 25s
    },
  },
  {
    id: 'oil-of-immolation',
    name: 'Oil of Immolation',
    outputItemId: 8956,
    category: 'oil',
    skillRequired: 205,
    yield: 1,
    ingredients: [
      { itemId: 4625, qty: 1 }, // Firebloom
      { itemId: 3821, qty: 1 }, // Goldthorn
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 4500, // 45s
    },
  },
  {
    id: 'goblin-rocket-fuel',
    name: 'Goblin Rocket Fuel',
    outputItemId: 9061,
    category: 'oil',
    skillRequired: 210,
    yield: 1,
    ingredients: [
      { itemId: 4625, qty: 1 }, // Firebloom
      { itemId: 9260, qty: 1 }, // Volatile Rum
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    recipeItemId: 9293,
    recipeScrollName: 'Recipe: Goblin Rocket Fuel',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Goblin Engineer Craft (Crafted Scroll)',
      location: 'Auction House / Engineering',
      fixedCostCopper: 0,
    },
  },
  {
    id: 'stonescale-oil',
    name: 'Stonescale Oil',
    outputItemId: 13423,
    category: 'oil',
    skillRequired: 250,
    yield: 1,
    ingredients: [
      { itemId: 13422, qty: 1 }, // Stonescale Eel
      { itemId: 3372, qty: 1 }, // Leaded Vial
    ],
    acquisition: {
      type: 'trainer',
      sourceLabel: 'Alchemy Trainer',
      location: 'Capital Cities',
      fixedCostCopper: 10000, // 1g
    },
  },

  // =========================================================================
  // FLASKS (Skill 300 — Requires Alchemy Lab)
  // =========================================================================
  {
    id: 'flask-of-petrification',
    name: 'Flask of Petrification',
    outputItemId: 13506,
    category: 'flask',
    skillRequired: 300,
    yield: 1,
    ingredients: [
      { itemId: 13423, qty: 30 }, // Stonescale Oil
      { itemId: 13465, qty: 10 }, // Mountain Silversage
      { itemId: 13468, qty: 1 }, // Black Lotus
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13517,
    recipeScrollName: 'Recipe: Flask of Petrification',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 56-60)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
    notes: 'Requires Alchemy Lab (Scholomance or Blackwing Lair)',
  },
  {
    id: 'flask-of-the-titans',
    name: 'Flask of the Titans',
    outputItemId: 13510,
    category: 'flask',
    skillRequired: 300,
    yield: 1,
    ingredients: [
      { itemId: 8846, qty: 30 }, // Gromsblood
      { itemId: 13423, qty: 10 }, // Stonescale Oil
      { itemId: 13468, qty: 1 }, // Black Lotus
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13518,
    recipeScrollName: 'Recipe: Flask of the Titans',
    acquisition: {
      type: 'ah',
      sourceLabel: 'General Drakkisath',
      location: 'Upper Blackrock Spire / AH',
      fixedCostCopper: 0,
    },
    notes: 'Requires Alchemy Lab (Scholomance or Blackwing Lair)',
  },
  {
    id: 'flask-of-distilled-wisdom',
    name: 'Flask of Distilled Wisdom',
    outputItemId: 13511,
    category: 'flask',
    skillRequired: 300,
    yield: 1,
    ingredients: [
      { itemId: 13463, qty: 30 }, // Dreamfoil
      { itemId: 13467, qty: 10 }, // Icecap
      { itemId: 13468, qty: 1 }, // Black Lotus
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13519,
    recipeScrollName: 'Recipe: Flask of Distilled Wisdom',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Balnazzar',
      location: 'Stratholme Live / AH',
      fixedCostCopper: 0,
    },
    notes: 'Requires Alchemy Lab (Scholomance or Blackwing Lair)',
  },
  {
    id: 'flask-of-supreme-power',
    name: 'Flask of Supreme Power',
    outputItemId: 13512,
    category: 'flask',
    skillRequired: 300,
    yield: 1,
    ingredients: [
      { itemId: 13463, qty: 30 }, // Dreamfoil
      { itemId: 13465, qty: 10 }, // Mountain Silversage
      { itemId: 13468, qty: 1 }, // Black Lotus
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13520,
    recipeScrollName: 'Recipe: Flask of Supreme Power',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Ras Frostwhisper',
      location: 'Scholomance / AH',
      fixedCostCopper: 0,
    },
    notes: 'Requires Alchemy Lab (Scholomance or Blackwing Lair)',
  },
  {
    id: 'flask-of-chromatic-resistance',
    name: 'Flask of Chromatic Resistance',
    outputItemId: 13513,
    category: 'flask',
    skillRequired: 300,
    yield: 1,
    ingredients: [
      { itemId: 13467, qty: 30 }, // Icecap
      { itemId: 13465, qty: 10 }, // Mountain Silversage
      { itemId: 13468, qty: 1 }, // Black Lotus
      { itemId: 8925, qty: 1 }, // Crystal Vial
    ],
    recipeItemId: 13521,
    recipeScrollName: 'Recipe: Flask of Chromatic Resistance',
    acquisition: {
      type: 'ah',
      sourceLabel: 'Gyth',
      location: 'Upper Blackrock Spire / AH',
      fixedCostCopper: 0,
    },
    notes: 'Requires Alchemy Lab (Scholomance or Blackwing Lair)',
  },

  // =========================================================================
  // TRANSMUTES
  // =========================================================================
  {
    id: 'transmute-mithril-to-truesilver',
    name: 'Transmute: Mithril to Truesilver',
    outputItemId: 6037,
    category: 'transmute',
    skillRequired: 225,
    yield: 1,
    cooldownHours: 24,
    ingredients: [{ itemId: 3860, qty: 1 }], // Mithril Bar
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Alchemist Pestlezugg',
      location: 'Gadgetzan, Tanaris',
      fixedCostCopper: 8000, // 80s
    },
    notes: 'Requires Philosopher\'s Stone. 24h cooldown.',
  },
  {
    id: 'transmute-arcanite',
    name: 'Transmute: Arcanite',
    outputItemId: 12360,
    category: 'transmute',
    skillRequired: 275,
    yield: 1,
    cooldownHours: 48,
    ingredients: [
      { itemId: 12359, qty: 1 }, // Thorium Bar
      { itemId: 12363, qty: 1 }, // Arcane Crystal
    ],
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Alchemist Pestlezugg',
      location: 'Gadgetzan, Tanaris',
      fixedCostCopper: 50000, // 5g
    },
    notes: 'Requires Philosopher\'s Stone. 48h cooldown.',
  },
  {
    id: 'transmute-undeath-to-water',
    name: 'Transmute: Undeath to Water',
    outputItemId: 7080,
    category: 'transmute',
    skillRequired: 275,
    yield: 1,
    cooldownHours: 24,
    ingredients: [{ itemId: 12808, qty: 1 }], // Essence of Undeath
    recipeItemId: 13485,
    recipeScrollName: 'Recipe: Transmute Undeath to Water',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 55-60)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
    notes: 'Requires Philosopher\'s Stone. 24h Essence cooldown.',
  },
  {
    id: 'transmute-water-to-air',
    name: 'Transmute: Water to Air',
    outputItemId: 7082,
    category: 'transmute',
    skillRequired: 275,
    yield: 1,
    cooldownHours: 24,
    ingredients: [{ itemId: 7080, qty: 1 }], // Essence of Water
    recipeItemId: 13484,
    recipeScrollName: 'Recipe: Transmute Water to Air',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 55-60)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
    notes: 'Requires Philosopher\'s Stone. 24h Essence cooldown.',
  },
  {
    id: 'transmute-earth-to-water',
    name: 'Transmute: Earth to Water',
    outputItemId: 7080,
    category: 'transmute',
    skillRequired: 275,
    yield: 1,
    cooldownHours: 24,
    ingredients: [{ itemId: 7076, qty: 1 }], // Essence of Earth
    acquisition: {
      type: 'reputation',
      sourceLabel: 'Timbermaw Hold — Meilosh',
      location: 'Timbermaw Hold, Felwood',
      fixedCostCopper: 12000, // 1g 20s
      reputationStanding: 'Friendly',
    },
    notes: 'Requires Philosopher\'s Stone. 24h Essence cooldown.',
  },
  {
    id: 'transmute-air-to-fire',
    name: 'Transmute: Air to Fire',
    outputItemId: 7078,
    category: 'transmute',
    skillRequired: 275,
    yield: 1,
    cooldownHours: 24,
    ingredients: [{ itemId: 7082, qty: 1 }], // Essence of Air
    recipeItemId: 13482,
    recipeScrollName: 'Recipe: Transmute Air to Fire',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 55-60)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
    notes: 'Requires Philosopher\'s Stone. 24h Essence cooldown.',
  },
  {
    id: 'transmute-fire-to-earth',
    name: 'Transmute: Fire to Earth',
    outputItemId: 7076,
    category: 'transmute',
    skillRequired: 275,
    yield: 1,
    cooldownHours: 24,
    ingredients: [{ itemId: 7078, qty: 1 }], // Essence of Fire
    acquisition: {
      type: 'vendor',
      sourceLabel: 'Plugger Spazzring',
      location: 'Blackrock Depths (Grim Guzzler)',
      fixedCostCopper: 12000, // 1g 20s
    },
    notes: 'Requires Philosopher\'s Stone. 24h Essence cooldown.',
  },
  {
    id: 'transmute-life-to-earth',
    name: 'Transmute: Life to Earth',
    outputItemId: 7076,
    category: 'transmute',
    skillRequired: 275,
    yield: 1,
    cooldownHours: 24,
    ingredients: [{ itemId: 12803, qty: 1 }], // Living Essence
    recipeItemId: 13489,
    recipeScrollName: 'Recipe: Transmute Life to Earth',
    acquisition: {
      type: 'ah',
      sourceLabel: 'World Drop (Lv 55-60)',
      location: 'Auction House / World Drop',
      fixedCostCopper: 0,
    },
    notes: 'Requires Philosopher\'s Stone. 24h Essence cooldown.',
  },
  {
    id: 'transmute-elemental-fire',
    name: 'Transmute: Elemental Fire',
    outputItemId: 7068,
    category: 'transmute',
    skillRequired: 300,
    yield: 3, // Multi-yield Classic transmute: 1 Heart of Fire -> 3 Elemental Fire
    cooldownHours: 0.17,
    ingredients: [{ itemId: 7077, qty: 1 }], // Heart of Fire
    acquisition: {
      type: 'reputation',
      sourceLabel: 'Thorium Brotherhood — Lokhtos Darkbargainer',
      location: 'Blackrock Depths (Grim Guzzler)',
      fixedCostCopper: 12000, // 1g 20s
      reputationStanding: 'Friendly',
    },
    notes: 'Yields 3x Elemental Fire per Heart of Fire. 10-minute cooldown.',
  },
];
