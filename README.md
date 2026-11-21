# ALCH.GG

Mobile-first Progressive Web App (PWA) for tracking **World of Warcraft Classic (1–300) Alchemy** crafting profits, Auction House margins, recipe break-even craft counts, crafting queues, shopping lists, and transmute cooldowns.

## Features

- **Live AH Price Sync & Overrides**: Fetches server-rendered category tables in parallel from `https://wowfah.com/{region}/{ruleset}/{faction}` (configurable Region, Ruleset, Faction) with Min Buyout vs. Market Price toggle, 20-minute edge caching, calibrated Classic AH fallback, and tap-to-override Gold/Silver/Copper prices on any herb, vial, consumable, or AH recipe scroll.
- **Classic (1–300) Alchemy Database**: 72 iconic potions, elixirs, protection potions, oils, flasks, and transmutes with exact Classic ingredients, vendor vial prices (`Empty 4c`, `Leaded 40c`, `Crystal 5s`), multi-yield support, favorites, and custom recipes.
- **Flips & Break-Even Dashboard**: Calculates Craft Cost, Net AH Return (minus 5% AH cut), Net Profit, ROI %, recipe acquisition source (AH/Drop, Vendor, Trainer, Reputation, Quest), live AH recipe scroll price, and exact crafts needed to break even (`Math.ceil(recipeCost / netProfit)`).
- **Crafting Queue & Shopping List**: Queue batch quantities, aggregate herbs/reagents/vials with interactive persisted checkboxes, and view total spend, net AH return, and projected profit.
- **Transmute Cooldown Tracker**: Live 1-second countdown timers for 48h Arcanite and 24h Essence transmutes per character/alt.

## Local Development

```bash
npm install
npm run dev
```

Vite includes a matching `/api/prices` middleware (`server/vitePricesPlugin.ts`) so local development works on the same domain with zero extra configuration.

## Tests & Production Build

```bash
npm test
npm run build
```

## Deploying to Cloudflare Pages

Connect `Koffert13/alch-gg` to Cloudflare Pages with:

- **Build command**: `npm run build`
- **Build output directory**: `dist`

Cloudflare Pages automatically deploys [`functions/api/prices.ts`](functions/api/prices.ts) on `/api/prices` with Cloudflare Cache API (20-minute TTL), CORS headers, and realistic fallback pricing.
