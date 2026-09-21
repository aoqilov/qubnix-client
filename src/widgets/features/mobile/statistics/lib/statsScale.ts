/**
 * value ni 0..100% ga max asosida masshtablaydi; 0 dan katta qiymatlar
 * minVisible % dan past bo'lmaydi — juda kichik ustunlar ko'rinmas bo'lib
 * qolmasligi uchun.
 */
export function scaleToPercent(value: number, max: number, minVisible = 4): number {
  if (max <= 0 || value <= 0) return 0;
  return Math.max((value / max) * 100, minVisible);
}
