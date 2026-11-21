import type { Plugin } from 'vite';
import { fetchRealmPrices } from '../shared/pricesService';
import type { PricesApiResponse } from '../shared/types';
import { normalizeRealmSettings } from '../shared/wowfah';

const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

interface MemoryCacheEntry {
  expiresAt: number;
  payload: PricesApiResponse;
}

/**
 * Vite dev & preview server middleware matching Cloudflare Pages `functions/api/prices.ts`
 * so local development and production share the exact same `/api/prices` contract.
 */
export function vitePricesPlugin(): Plugin {
  const memoryCache = new Map<string, MemoryCacheEntry>();

  const attachMiddleware = (middlewares: {
    use: (
      route: string,
      fn: (
        req: { url?: string; method?: string },
        res: {
          statusCode: number;
          setHeader: (k: string, v: string) => void;
          end: (body?: string) => void;
        },
        next: () => void
      ) => void
    ) => void;
  }) => {
    middlewares.use('/api/prices', (req, res, next) => {
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.end();
        return;
      }

      if (req.method !== 'GET') {
        next();
        return;
      }

      void (async () => {
        try {
          const parsedUrl = new URL(req.url ?? '/', 'http://localhost');
          const realm = normalizeRealmSettings({
            region: parsedUrl.searchParams.get('region'),
            ruleset: parsedUrl.searchParams.get('ruleset'),
            faction: parsedUrl.searchParams.get('faction'),
          });
          const bypassCache =
            parsedUrl.searchParams.get('refresh') === '1' ||
            parsedUrl.searchParams.get('refresh') === 'true';

          const cacheKey = `${realm.region}:${realm.ruleset}:${realm.faction}`;
          const now = Date.now();
          const cached = memoryCache.get(cacheKey);

          let payload: PricesApiResponse;
          let cacheHeader = 'MISS';

          if (!bypassCache && cached && cached.expiresAt > now) {
            payload = cached.payload;
            cacheHeader = 'HIT';
          } else {
            payload = await fetchRealmPrices(realm);
            const ttlMs = payload.source === 'live' ? CACHE_TTL_MS : 3 * 60 * 1000;
            memoryCache.set(cacheKey, { expiresAt: now + ttlMs, payload });
            cacheHeader = bypassCache ? 'REFRESH' : 'MISS';
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'public, max-age=1200');
          res.setHeader('X-Alch-Cache', cacheHeader);
          res.setHeader('X-Alch-Source', payload.source);
          res.end(JSON.stringify(payload));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : 'Failed to fetch AH prices',
            })
          );
        }
      })();
    });
  };

  return {
    name: 'alch-gg-prices-api',
    configureServer(server) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares);
    },
  };
}
