import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './', // <--- இதை மட்டும் இங்கே சேர்த்துவிடுங்கள்
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.webp', 'masked-icon.svg'],
      manifest: {
        name: 'Sree Meenakshi Glass & Plywoods',
        short_name: 'SreeMeenakshi',
        description: 'Premium Glass, Plywood, and UPVC supplier in Chennai',
        theme_color: '#f97316',
        icons: [
          {
            src: 'apple-touch-icon.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'apple-touch-icon.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      }
    })
  ]
})