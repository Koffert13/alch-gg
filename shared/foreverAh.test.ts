import { describe, expect, it } from 'vitest';
import {
  findForeverAhHouse,
  getBlizzardHouseId,
  parseForeverAhMarketResponse,
  type ForeverAhHouse,
} from './foreverAh';

describe('Forever AH API mapping & parser', () => {
  it('maps rulesets and factions to exact Blizzard WoW Forever house IDs', () => {
    expect(getBlizzardHouseId('pvp', 'alliance')).toBe(110);
    expect(getBlizzardHouseId('pvp', 'horde')).toBe(113);
    expect(getBlizzardHouseId('pvp', 'blackwater')).toBe(116);

    expect(getBlizzardHouseId('normal', 'alliance')).toBe(111);
    expect(getBlizzardHouseId('normal', 'horde')).toBe(114);
    expect(getBlizzardHouseId('normal', 'blackwater')).toBe(117);

    expect(getBlizzardHouseId('rp', 'alliance')).toBe(119);
    expect(getBlizzardHouseId('rp', 'horde')).toBe(120);
    expect(getBlizzardHouseId('rp', 'blackwater')).toBe(121);

    expect(getBlizzardHouseId('rp-pvp', 'alliance')).toBe(123);
    expect(getBlizzardHouseId('rp-pvp', 'horde')).toBe(124);
    expect(getBlizzardHouseId('rp-pvp', 'blackwater')).toBe(125);
  });

  it('finds the matching real house_key for region + ruleset + faction', () => {
    const houses: ForeverAhHouse[] = [
      {
        house_key: 33,
        region: 'eu',
        ruleset_id: 2,
        house_id: 0,
        name: 'All Auction Houses',
        last_snapshot: '2026-11-22T05:22:50Z',
        house_type: 'unified',
      },
      {
        house_key: 21,
        region: 'eu',
        ruleset_id: 2,
        house_id: 113,
        name: 'Horde Auction House',
        last_snapshot: '2026-11-22T05:22:50Z',
        house_type: 'real',
      },
      {
        house_key: 5,
        region: 'us',
        ruleset_id: 2,
        house_id: 113,
        name: 'Horde Auction House',
        last_snapshot: '2026-11-22T05:25:17Z',
        house_type: 'real',
      },
    ];

    expect(
      findForeverAhHouse(houses, { region: 'eu', ruleset: 'pvp', faction: 'horde' })?.house_key
    ).toBe(21);

    expect(
      findForeverAhHouse(houses, { region: 'us', ruleset: 'pvp', faction: 'horde' })?.house_key
    ).toBe(5);

    // Falls back to unified regional house if specific house_id is missing
    expect(
      findForeverAhHouse(houses, { region: 'eu', ruleset: 'rp', faction: 'alliance' })?.house_key
    ).toBe(33);
  });

  it('parses Forever AH market rows into integer copper AhItemPrice records', () => {
    const parsed = parseForeverAhMarketResponse({
      as_of: '2026-11-22T05:22:50Z',
      rows: [
        {
          item: { item_id: 13452, name: 'Elixir of the Mongoose' },
          current: { min_unit: 8000, median_unit: 8624, quantity: 1204 },
          stats: { market_value: 10161, sold_per_day: 1439.6 },
        },
        {
          item: { item_id: 13491, name: 'Recipe: Elixir of the Mongoose' },
          current: { min_unit: 6900, median_unit: 7088, quantity: 63 },
          stats: { market_value: null, sold_per_day: 77.2 },
        },
      ],
    });

    expect(parsed.snapshotAt).toBe(Math.floor(Date.parse('2026-11-22T05:22:50Z') / 1000));
    expect(parsed.items[13452]).toEqual({
      itemId: 13452,
      name: 'Elixir of the Mongoose',
      minBuyout: 8000,
      marketPrice: 10161,
      listed: 1204,
      sold24h: 1440,
    });
    // Falls back to median_unit when stats.market_value is null
    expect(parsed.items[13491]).toEqual({
      itemId: 13491,
      name: 'Recipe: Elixir of the Mongoose',
      minBuyout: 6900,
      marketPrice: 7088,
      listed: 63,
      sold24h: 77,
    });
  });
});
