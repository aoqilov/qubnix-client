const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Sanagacha qolgan to'liq kunlar (yuqoriga yaxlitlanadi); o'tib ketgan bo'lsa 0. `daysSince` ning teskarisi. */
export function daysUntil(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / MS_PER_DAY));
}
