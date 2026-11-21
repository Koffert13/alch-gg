import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import { vitePricesPlugin } from './server/vitePricesPlugin';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vitePricesPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg', 'icons/icon-maskable.svg'],
      manifest: {
        name: 'ALCH.GG — Classic WoW Alchemy Profit Tracker',
        short_name: 'ALCH.GG',
        description:
          'World of Warcraft Classic (1-300) Alchemy crafting profits, Auction House margins, break-even analysis, shopping lists, and transmute cooldowns.',
        theme_color: '#090d0b',
        background_color: '#090d0b',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        categories: ['games', 'utilities'],
        icons: [
          {
            src: '/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icons/icon-maskable.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\/prices/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'alch-api-prices',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 1200,
              },
            },
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'shared/**/*.test.ts'],
  },
});
