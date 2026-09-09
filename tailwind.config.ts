import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vio: {
          DEFAULT: "#7429e0",
          dark: "#5c1fb4",
        },
      },
      fontFamily: {
        sans: ["Barlow", "system-ui", "sans-serif"],
        condensed: ["Barlow Condensed", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
