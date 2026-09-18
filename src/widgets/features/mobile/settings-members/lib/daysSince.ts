const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function daysSince(isoDate: string): number {
  const diff = Date.now() - new Date(isoDate).getTime();
  return Math.max(0, Math.floor(diff / MS_PER_DAY));
}
