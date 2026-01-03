import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/ev-charging-calculator/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'EV Charging Calculator',
        short_name: 'EV Calc',
        description: 'Calculate optimal charging speed for your electric vehicle',
        theme_color: '#7c3aed',
        background_color: '#7c3aed',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        id: '/ev-charging-calculator/',
        icons: [
          {
            src: './icons/icon-64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: './icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: './icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
