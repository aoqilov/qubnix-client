import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./locales/ru";
import uz from "./locales/uz";
import uzCyrlOverrides from "./locales/uz-Cyrl/overrides";
import { transliterateDictionary } from "./transliterate";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  detectInitialLanguage,
  type LanguageCode,
} from "./languages";

/**
 * `uz-Cyrl` alohida fayl emas — `uz` lug'atidan transliteratsiya qilinadi, qo'lda
 * tuzatishlar `locales/uz-Cyrl/overrides.ts` da.
 *
 * Barcha bo'limlar (common, ui, tasks, ...) bitta `translation` namespace ichida —
 * kalit to'liq yo'l bilan yoziladi: t("common.actions.save"), t("tasks.filters.title").
 * Shunda har bir komponentda namespace ro'yxatini sanash shart emas, kalitlar esa
 * baribir to'liq tiplangan.
 */
const uzCyrl = transliterateDictionary(uz, uzCyrlOverrides);

export const resources = {
  ru: { translation: ru },
  uz: { translation: uz },
  "uz-Cyrl": { translation: uzCyrl },
} as const;

export const defaultNS = "translation";

void i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS,
  interpolation: { escapeValue: false }, // React o'zi escape qiladi.
  returnNull: false,
});

function syncDocumentLanguage(lng: string) {
  document.documentElement.lang = lng;
}
syncDocumentLanguage(i18n.language);

i18n.on("languageChanged", (lng) => {
  syncDocumentLanguage(lng);
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  } catch {
    // localStorage yopiq bo'lsa — til faqat shu sessiyada saqlanadi.
  }
});

export function changeLanguage(code: LanguageCode) {
  return i18n.changeLanguage(code);
}

export default i18n;
