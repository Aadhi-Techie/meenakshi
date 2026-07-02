import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './', 
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
        background_color: '#1a1a1a',
        start_url: './index.html', // 👈 ஆப் தொடங்கும் இடம்
        display: 'standalone',      // 👈 மிக முக்கியம்! இதுதான் மொபைலில் ஆப்பாக மாற்றும்
        orientation: 'portrait',
        icons: [
          {
            src: 'apple-touch-icon.webp',
            sizes: '192x192',
            type: 'image/webp',
            purpose: 'any'          // 👈 மொபைல் குரோம் இன்ஸ்டால் பேனருக்கு இது அவசியம்
          },
          {
            src: 'apple-touch-icon.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})