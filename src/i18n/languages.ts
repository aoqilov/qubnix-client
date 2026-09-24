/**
 * Qo'llab-quvvatlanadigan tillar. `ru` — asosiy manba (barcha kalitlar shu yerda
 * birinchi yoziladi), `uz` — o'zbek lotin, `uz-Cyrl` — o'zbek kirill (lotindan
 * avtomatik transliteratsiya qilinadi, qarang: ./transliterate.ts).
 */
export const LANGUAGES = [
  { code: "ru", label: "Русский", intlLocale: "ru-RU" },
  { code: "uz", label: "O'zbekcha", intlLocale: "uz-Latn-UZ" },
  { code: "uz-Cyrl", label: "Ўзбекча", intlLocale: "uz-Cyrl-UZ" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "ru";
export const LANGUAGE_STORAGE_KEY = "qubnix_language";

export function isLanguageCode(value: unknown): value is LanguageCode {
  return LANGUAGES.some((l) => l.code === value);
}

/** `Intl.*` va `CusCalendar` uchun — til kodidan to'liq locale. */
export function intlLocaleOf(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.intlLocale ?? "ru-RU";
}

/**
 * Boshlang'ich til: 1) foydalanuvchi tanlagani (localStorage), 2) Telegram
 * foydalanuvchisining tili (`uz` → o'zbek lotin), 3) standart — rus.
 */
export function detectInitialLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguageCode(stored)) return stored;
  } catch {
    // localStorage yopiq bo'lishi mumkin (private rejim) — keyingi manbaga o'tiladi.
  }
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user as
    | { language_code?: string }
    | undefined;
  if (tgUser?.language_code?.toLowerCase().startsWith("uz")) return "uz";
  return DEFAULT_LANGUAGE;
}
