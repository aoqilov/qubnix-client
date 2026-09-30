import { currentIntlLocale } from "@/i18n/useIntlLocale";

/** Routine jadvali uchun umumiy yordamchilar — forma, karta matni va jadval dialogi bir xil manbadan oladi. */

/** Backend hafta kunlari: 1 = dushanba … 7 = yakshanba. */
export const WEEKDAY_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

export const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Hafta kunining qisqa nomi joriy tilda ("Пн" / "Du"). 2024-01-01 — dushanba,
 * shuning uchun 1…7 qiymatlari to'g'ridan-to'g'ri o'sha haftaning kunlariga tushadi.
 * Render paytida chaqiriladi — til almashsa yangilanadi.
 */
export function weekdayShortLabel(value: number): string {
  const date = new Date(2024, 0, value);
  return capitalize(new Intl.DateTimeFormat(currentIntlLocale(), { weekday: "short" }).format(date));
}

/** Yillik takrorlanish sanasi: "12 марта" / "12-mart" (ruschada oy nomi kelishikda). */
export function dayMonthLabel(month: number, day: number): string {
  return new Intl.DateTimeFormat(currentIntlLocale(), { day: "numeric", month: "long" }).format(
    new Date(2024, month - 1, day),
  );
}
