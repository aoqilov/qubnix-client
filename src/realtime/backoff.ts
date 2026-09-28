/** Qayta ulanish kechikishi: 1s, 2s, 4s, 8s, 16s, keyin 30s — ustiga jitter. */
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30_000;

export function backoffDelay(attempt: number): number {
  const exponential = Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS);
  // Jitter: ko'p mijoz bir vaqtda uzilsa serverga to'p bo'lib urilmasligi uchun.
  return exponential + Math.random() * 500;
}

/** Bir nechta muvaffaqiyatsiz urinishdan keyin sessiyani tekshirib ko'ramiz. */
export const SESSION_PROBE_AFTER_FAILURES = 3;
