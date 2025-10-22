import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          injectRegister: 'auto',
          workbox: {
            navigateFallback: '/index.html',
            globPatterns: ['**/*.{js,css,html,ico,png,svg}']
          },
          manifest: {
            name: 'Telugu Aksharamala Tracer',
            short_name: 'Aksharamala',
            start_url: '/',
            display: 'standalone',
            background_color: '#f0f9ff',
            theme_color: '#2563eb',
            description: 'Trace Telugu letters offline and learn.',
            icons: [
              { src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
              { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
              { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
