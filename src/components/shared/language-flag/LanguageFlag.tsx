import ruFlag from "@/assets/flags/ru.svg";
import uzFlag from "@/assets/flags/uz.svg";
import type { LanguageCode } from "@/i18n/languages";

// Emoji bayroqlar Windows'da harf ("RU") bo'lib chiqadi — shuning uchun SVG fayllar.
// Bayroq ranglari davlat ramzi, dizayn tokeni emas — faqat assets'da, komponentda hex yo'q.
const FLAG_SRC: Record<LanguageCode, string> = {
  ru: ruFlag,
  uz: uzFlag,
  "uz-Cyrl": uzFlag,
};

interface LanguageFlagProps {
  code: LanguageCode;
  /** Doira diametri, px. */
  size?: number;
}

/** Til bayrog'i — dumaloq ichida. */
export function LanguageFlag({ code, size = 18 }: LanguageFlagProps) {
  return (
    <img
      src={FLAG_SRC[code]}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className="flex-none rounded-avatar border border-subtle object-cover"
      style={{ width: size, height: size }}
    />
  );
}
