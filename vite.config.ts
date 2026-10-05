import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
import { readFileSync } from "node:fs";

// Profil pastidagi "Версия" — package.json'dagi `version` dan (reliz qilganda shu yerda oshiriladi).
const APP_VERSION: string = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf-8")).version;

// Manifest CSS o'zgaruvchini tushunmaydi — qiymatlar globals.css primitivlaridan ko'chirilgan.
const CANVAS_LIGHT = "#f8fafc"; // --c-neutral-50 (--bg-canvas, light)

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Yangi versiya o'zi qo'llanmaydi — user "Обновить" toast'ini tasdiqlaydi (src/pwa).
      registerType: "prompt",
      // Ro'yxatdan o'tkazish src/pwa/registerPwa.ts da — Telegram ichida service worker kerak emas.
      injectRegister: false,
      includeAssets: ["favicon.png", "apple-touch-icon.png"],
      manifest: {
        name: "qubnix",
        lang: "uz",
        short_name: "qubnix",
        id: "/",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: CANVAS_LIGHT,
        background_color: CANVAS_LIGHT,
        // Vaqtinchalik ikonkalar — haqiqiy logo kelganda public/ dagi fayllar almashtiriladi.
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Faqat ilova qobig'i keshlanadi; API boshqa domenda — u doim tarmoqdan boradi.
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        // Asosiy bundle (Chakra + recharts) default 2 MB chegaradan katta bo'lishi mumkin.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
