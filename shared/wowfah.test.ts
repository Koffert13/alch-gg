import { describe, expect, it } from 'vitest';
import {
  buildWowfahBaseUrl,
  mergeAhItems,
  normalizeRealmSettings,
  parseCopperPrice,
  parseWowfahCategoryHtml,
  WOWFAH_CATEGORY_PATHS,
} from './wowfah';

describe('wowfah HTML parser & copper normalizer', () => {
  it('normalizes gold, silver, and copper strings and HTML spans into integer copper', () => {
    expect(parseCopperPrice('1g 25s 50c')).toBe(12550);
    expect(parseCopperPrice('<span>12</span>g <span>4</span>s <span>9</span>c')).toBe(120409);
    expect(parseCopperPrice('1,250g 5s')).toBe(12500500);
    expect(parseCopperPrice('4s 50c')).toBe(450);
    expect(parseCopperPrice('85c')).toBe(85);
    expect(
      parseCopperPrice(
        '<span class="gold">3</span><span class="silver">14</span><span class="copper">15</span>'
      )
    ).toBe(31415);
    expect(parseCopperPrice('<span data-copper="98765">9g 87s 65c</span>')).toBe(98765);
    expect(parseCopperPrice('—')).toBe(0);
    expect(parseCopperPrice('')).toBe(0);
  });

  it('parses wowfah category HTML rows, snapshot timestamp, and recipe scrolls', () => {
    const sampleHtml = `
      <!doctype html>
      <html>
        <body>
          <aside class="topbar" data-snap="1730001234">EU PvP Horde</aside>
          <table>
            <tbody>
              <tr data-star="13463">
                <td><a class="name q1" href="/item/13463">Dreamfoil</a></td>
                <td data-label="Min buyout"><span class="g">1</span>g <span class="s">58</span>s <span class="c">25</span>c</td>
                <td data-label="Market price">1g 72s 0c</td>
                <td data-label="Listed">1,120</td>
                <td data-label="Sold 24h">890</td>
              </tr>
              <tr data-star="13491">
                <td><a class="name q2" href="/item/13491">Recipe: Elixir of the Mongoose &amp; More</a></td>
                <td data-label="Min buyout">52g 0s 0c</td>
                <td data-label="Market price">58g 50s 0c</td>
                <td data-label="Listed">11</td>
                <td data-label="Sold 24h">7</td>
              </tr>
              <tr data-star="3358">
                <td><a class="name q1" href="/item/3358">Khadgar&#39;s Whisker</a></td>
                <td data-label="Min buyout">13s 50c</td>
                <td data-label="Market price">15s 20c</td>
                <td data-label="Listed">410</td>
                <td data-label="Sold 24h">—</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const parsed = parseWowfahCategoryHtml(sampleHtml);
    expect(parsed.snapshotAt).toBe(1730001234);
    expect(parsed.items).toHaveLength(3);

    expect(parsed.items[0]).toEqual({
      itemId: 13463,
      name: 'Dreamfoil',
      minBuyout: 15825,
      marketPrice: 17200,
      listed: 1120,
      sold24h: 890,
    });

    expect(parsed.items[1]).toEqual({
      itemId: 13491,
      name: 'Recipe: Elixir of the Mongoose & More',
      minBuyout: 520000,
      marketPrice: 585000,
      listed: 11,
      sold24h: 7,
    });

    expect(parsed.items[2]).toEqual({
      itemId: 3358,
      name: "Khadgar's Whisker",
      minBuyout: 1350,
      marketPrice: 1520,
      listed: 410,
      sold24h: 0,
    });
  });

  it('merges parsed pages and preserves latest snapshot and non-zero prices', () => {
    const merged = mergeAhItems([
      {
        snapshotAt: 1700000100,
        items: [
          { itemId: 13463, name: 'Dreamfoil', minBuyout: 15000, marketPrice: 0, listed: 100, sold24h: 50 },
        ],
      },
      {
        snapshotAt: 1700000250,
        items: [
          { itemId: 13463, name: 'Dreamfoil', minBuyout: 0, marketPrice: 16500, listed: 120, sold24h: 60 },
          { itemId: 13468, name: 'Black Lotus', minBuyout: 980000, marketPrice: 1020000, listed: 14, sold24h: 9 },
        ],
      },
    ]);

    expect(merged.snapshotAt).toBe(1700000250);
    expect(merged.items[13463]).toEqual({
      itemId: 13463,
      name: 'Dreamfoil',
      minBuyout: 15000,
      marketPrice: 16500,
      listed: 120,
      sold24h: 60,
    });
    expect(merged.items[13468].minBuyout).toBe(980000);
  });

  it('normalizes realm settings safely and includes all 10 required category paths', () => {
    expect(
      normalizeRealmSettings({ region: 'us', ruleset: 'rp-pvp', faction: 'alliance' })
    ).toEqual({ region: 'us', ruleset: 'rp-pvp', faction: 'alliance' });

    expect(
      normalizeRealmSettings({ region: 'invalid', ruleset: null, faction: 'nope' })
    ).toEqual({ region: 'eu', ruleset: 'pvp', faction: 'horde' });

    expect(buildWowfahBaseUrl({ region: 'eu', ruleset: 'pvp', faction: 'horde' })).toBe(
      'https://wowfah.com/eu/pvp/horde'
    );
    expect(WOWFAH_CATEGORY_PATHS).toHaveLength(10);
    expect(WOWFAH_CATEGORY_PATHS).toContain('/category/recipe/alchemy?n=200');
  });
});
