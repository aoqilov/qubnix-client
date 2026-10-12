interface PickedDay {
  year: number;
  month: number;
  day: number;
}

/**
 * Vazifaning `start_at` qiymati (task qo'shish va tahrirlash modallari uchun umumiy).
 * Oraliq tanlangan bo'lsa — oraliq boshi; bitta sana kelajakda bo'lsa — shu kunning boshi.
 * Ikkalasida ham kun boshiga (00:00). Bugungi/o'tgan sana yoki tezkor rejimda null.
 */
export function buildTaskStartAt(
  mode: "quick" | "custom",
  customDate: readonly PickedDay[] | undefined,
): string | null {
  if (mode !== "custom" || !customDate?.[0]) return null;
  const v = customDate[0];
  const start = new Date(v.year, v.month - 1, v.day, 0, 0, 0, 0);
  if (customDate.length < 2) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start.getTime() <= today.getTime()) return null;
  }
  return start.toISOString();
}
