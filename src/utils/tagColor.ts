/**
 * Teg/kategoriya ranglari (loyihalar, yorliqlar va h.k.).
 *
 * avatarColor.ts bilan bir xil g'oya, faqat boshqa palitra: globals.css
 * dagi `--accent-{teal|orange|pink|cyan}` — bular aynan shu maqsad uchun
 * ajratilgan (avatarlar `--avatar-1..6`dan foydalanadi). Rang qo'lda
 * tanlanmaydi, ID'dan barqaror hash orqali tanlanadi.
 */

const TAG_COLOR_KEYS = ["teal", "orange", "pink", "cyan"] as const;

export function tagColorVar(id: string | number): string {
  return `var(--accent-${TAG_COLOR_KEYS[hash(String(id)) % TAG_COLOR_KEYS.length]})`;
}

// djb2 + avalanche finalizer — avatarColor.ts'dagi bilan bir xil formula.
function hash(value: string): number {
  let h = 5381;
  for (let i = 0; i < value.length; i++) {
    h = ((h * 33) ^ value.charCodeAt(i)) >>> 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}
