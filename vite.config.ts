import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/*.png', 'screenshots/*.png'],
      manifest: {
        id: '/',
        name: 'Montessori Playbook',
        short_name: 'Playbook',
        description: 'Panduan Montessori lengkap untuk orang tua dengan anak usia 0-5 tahun — offline-first.',
        lang: 'id',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f0f7fb',
        theme_color: '#38bdf8',
        categories: ['education', 'lifestyle', 'parenting'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Hari Ini', url: '/', description: 'Aktivitas hari ini' },
          { name: 'Jurnal', url: '/jurnal', description: 'Catat observasi' },
          { name: 'Cari', url: '/cari', description: 'Cari aktivitas' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,png}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Konten JSON lazy-load per AgeBand: cache-on-demand
            urlPattern: /\/content\/.+\.json$/,
            handler: 'CacheFirst',
            options: { cacheName: 'content-json', expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
        ],
        navigateFallbackDenylist: [/^\/sw\.js$/],
      },
      devOptions: { enabled: false },
    }),
  ],
  build: {
    target: 'es2020',
    cssTarget: 'safari15',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/react-router')) {
            return 'react'
          }
          return undefined
        },
      },
    },
  },
})
