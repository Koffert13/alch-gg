import { fetchRealmPrices } from '../shared/pricesService';
import { normalizeRealmSettings } from '../shared/wowfah';

const CACHE_TTL_SECONDS = 1200; // 20 minutes

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export interface Env {
  ASSETS: Fetcher;
}

async function handlePricesRequest(
  request: Request,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...CORS_HEADERS,
      },
    });
  }

  const url = new URL(request.url);
  const realm = normalizeRealmSettings({
    region: url.searchParams.get('region'),
    ruleset: url.searchParams.get('ruleset'),
    faction: url.searchParams.get('faction'),
  });
  const bypassCache =
    url.searchParams.get('refresh') === '1' || url.searchParams.get('refresh') === 'true';

  const cacheUrl = new URL(url.origin + url.pathname);
  cacheUrl.searchParams.set('region', realm.region);
  cacheUrl.searchParams.set('ruleset', realm.ruleset);
  cacheUrl.searchParams.set('faction', realm.faction);
  const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });

  const edgeCache =
    typeof caches !== 'undefined' && 'default' in caches
      ? (caches as unknown as { default: Cache }).default
      : null;

  if (edgeCache && !bypassCache) {
    const cached = await edgeCache.match(cacheKey);
    if (cached) {
      const hitHeaders = new Headers(cached.headers);
      hitHeaders.set('X-Alch-Cache', 'HIT');
      for (const [k, v] of Object.entries(CORS_HEADERS)) {
        hitHeaders.set(k, v);
      }
      return new Response(cached.body, {
        status: cached.status,
        headers: hitHeaders,
      });
    }
  }

  const payload = await fetchRealmPrices(realm);
  const ttl = payload.source === 'live' ? CACHE_TTL_SECONDS : 180;

  const response = new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
      'X-Alch-Cache': bypassCache ? 'REFRESH' : 'MISS',
      'X-Alch-Source': payload.source,
      ...CORS_HEADERS,
    },
  });

  if (edgeCache) {
    ctx.waitUntil(edgeCache.put(cacheKey, response.clone()));
  }

  return response;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/prices' || url.pathname === '/api/prices/') {
      return handlePricesRequest(request, ctx);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
