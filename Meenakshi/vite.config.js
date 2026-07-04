import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.webp'],
      manifest: {
        name: 'Sree Meenakshi Glass & Plywoods',
        short_name: 'SreeMeenakshi',
        description: 'Premium Glass, Plywood, and UPVC supplier in Chennai',
        theme_color: '#f97316',
        background_color: '#1a1a1a',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'apple-touch-icon.webp', sizes: '192x192', type: 'image/webp', purpose: 'any' },
          { src: 'apple-touch-icon.webp', sizes: '512x512', type: 'image/webp', purpose: 'any' }
        ]
      }
    }),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
      includePublic: true,
      logStats: true,
      png: { quality: 75 },
      jpeg: { quality: 75 },
      webp: { quality: 70 }
    })
  ]
})