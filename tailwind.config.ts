import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vio: "var(--vio)",
      },
      fontFamily: {
        sans: ["Barlow", "system-ui", "sans-serif"],
        condensed: ["Barlow Condensed", "system-ui", "sans-serif"],
      },
      // Profildagi "Shrift kattaligi" (sm/md/lg) sozlamasi shu yerdan boshqariladi —
      // --font-scale faqat matn o'lchamini o'zgartiradi, spacing/icon'larga tegmaydi
      // (ular rem/px orqali mustaqil, ui.store.ts'dagi setFontSize'ga qarang).
      fontSize: {
        xs: ["calc(0.75rem * var(--font-scale, 1))", { lineHeight: "calc(1rem * var(--font-scale, 1))" }],
        sm: ["calc(0.875rem * var(--font-scale, 1))", { lineHeight: "calc(1.25rem * var(--font-scale, 1))" }],
        base: ["calc(1rem * var(--font-scale, 1))", { lineHeight: "calc(1.5rem * var(--font-scale, 1))" }],
        lg: ["calc(1.125rem * var(--font-scale, 1))", { lineHeight: "calc(1.75rem * var(--font-scale, 1))" }],
        xl: ["calc(1.25rem * var(--font-scale, 1))", { lineHeight: "calc(1.75rem * var(--font-scale, 1))" }],
        "2xl": ["calc(1.5rem * var(--font-scale, 1))", { lineHeight: "calc(2rem * var(--font-scale, 1))" }],
        "3xl": ["calc(1.875rem * var(--font-scale, 1))", { lineHeight: "calc(2.25rem * var(--font-scale, 1))" }],
        "4xl": ["calc(2.25rem * var(--font-scale, 1))", { lineHeight: "calc(2.5rem * var(--font-scale, 1))" }],
        "5xl": ["calc(3rem * var(--font-scale, 1))", { lineHeight: "1" }],
        "6xl": ["calc(3.75rem * var(--font-scale, 1))", { lineHeight: "1" }],
        "7xl": ["calc(4.5rem * var(--font-scale, 1))", { lineHeight: "1" }],
        "8xl": ["calc(6rem * var(--font-scale, 1))", { lineHeight: "1" }],
        "9xl": ["calc(8rem * var(--font-scale, 1))", { lineHeight: "1" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
