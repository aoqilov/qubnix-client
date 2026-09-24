/** Routine jadvali uchun umumiy konstantalar — forma, karta matni va jadval dialogi bir xil manbadan oladi. */

/** Backend hafta kunlari: 1 = dushanba … 7 = yakshanba. */
export const WEEKDAY_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Dush" },
  { value: 2, label: "Sesh" },
  { value: 3, label: "Chor" },
  { value: 4, label: "Pay" },
  { value: 5, label: "Jum" },
  { value: 6, label: "Shan" },
  { value: 7, label: "Yak" },
];

export const WEEKDAY_SHORT: Record<number, string> = Object.fromEntries(
  WEEKDAY_OPTIONS.map((o) => [o.value, o.label]),
);

export const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export const MONTH_NOMINATIVE = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];
