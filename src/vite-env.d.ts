/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TELEGRAM_BOT_USERNAME?: string;
  /** Web ilova manzili — Telegram ichidan "Brauzerda ochish" shu yerga olib boradi. Bo'sh bo'lsa joriy origin. */
  readonly VITE_WEB_APP_URL?: string;
}

/** package.json `version` — vite.config.ts `define` orqali build vaqtida qo'yiladi. */
declare const __APP_VERSION__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
