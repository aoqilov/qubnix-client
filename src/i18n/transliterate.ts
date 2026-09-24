/**
 * O'zbek lotin → kirill transliteratsiyasi. `uz-Cyrl` lug'ati alohida yozilmaydi —
 * `uz` lug'atidan shu funksiya orqali hosil qilinadi, shunda ikkala variant hech
 * qachon bir-biridan ajralib qolmaydi. Qoidaga tushmaydigan so'zlar
 * `locales/uz-Cyrl/overrides.ts` da qo'lda beriladi.
 *
 * `{{...}}` interpolatsiya joylari va lotin yozuvida qolishi kerak bo'lgan
 * atamalar (PRO, Telegram, ...) o'zgarmaydi.
 */

const KEEP_LATIN = ["Telegram", "Workspace", "workspace", "PRO", "Sub-Task", "Basic", "Business", "Push", "email", "OTP", "ID"];

// Apostrof variantlari: ' ‘ ’ ʻ ʼ `
const APOS = "['‘’ʻʼ`]";

type Rule = [RegExp, string];

const RULES: Rule[] = [
  // Ikki harfli birikmalar birinchi — aks holda s+h, c+h alohida o'giriladi.
  [new RegExp(`O${APOS}`, "g"), "Ў"],
  [new RegExp(`o${APOS}`, "g"), "ў"],
  [new RegExp(`G${APOS}`, "g"), "Ғ"],
  [new RegExp(`g${APOS}`, "g"), "ғ"],
  [/SH/g, "Ш"],
  [/Sh/g, "Ш"],
  [/sh/g, "ш"],
  [/CH/g, "Ч"],
  [/Ch/g, "Ч"],
  [/ch/g, "ч"],
  [/YO/g, "Ё"],
  [/Yo/g, "Ё"],
  [/yo/g, "ё"],
  [/YU/g, "Ю"],
  [/Yu/g, "Ю"],
  [/yu/g, "ю"],
  [/YA/g, "Я"],
  [/Ya/g, "Я"],
  [/ya/g, "я"],
  [/YE/g, "Е"],
  [/Ye/g, "Е"],
  [/ye/g, "е"],
  // So'z boshidagi va unlidan keyingi "e" — "э".
  [/(^|[^A-Za-zʻʼ'‘’`])E/g, "$1Э"],
  [/(^|[^A-Za-zʻʼ'‘’`])e/g, "$1э"],
  [/([aeiouAEIOU])e/g, "$1э"],
  // Tutuq belgisi (ma'lumot → маълумот).
  [new RegExp(APOS, "g"), "ъ"],
];

const SINGLE: Record<string, string> = {
  A: "А", a: "а", B: "Б", b: "б", D: "Д", d: "д", E: "Е", e: "е", F: "Ф", f: "ф",
  G: "Г", g: "г", H: "Ҳ", h: "ҳ", I: "И", i: "и", J: "Ж", j: "ж", K: "К", k: "к",
  L: "Л", l: "л", M: "М", m: "м", N: "Н", n: "н", O: "О", o: "о", P: "П", p: "п",
  Q: "Қ", q: "қ", R: "Р", r: "р", S: "С", s: "с", T: "Т", t: "т", U: "У", u: "у",
  V: "В", v: "в", X: "Х", x: "х", Y: "Й", y: "й", Z: "З", z: "з", C: "С", c: "с",
  W: "В", w: "в",
};

function transliterateChunk(text: string): string {
  let out = text;
  for (const [pattern, replacement] of RULES) out = out.replace(pattern, replacement);
  return out.replace(/[A-Za-z]/g, (ch) => SINGLE[ch] ?? ch);
}

/** Bitta satrni o'giradi, `{{...}}` va KEEP_LATIN atamalarini himoyalab. */
export function latinToCyrillic(text: string): string {
  const protectedParts: string[] = [];
  const guard = (value: string) => {
    protectedParts.push(value);
    return `\u0000${protectedParts.length - 1}\u0000`;
  };

  let masked = text.replace(/\{\{[^}]+\}\}/g, guard);
  for (const word of KEEP_LATIN) {
    masked = masked.replace(new RegExp(`\\b${word}\\b`, "g"), guard);
  }

  return transliterateChunk(masked).replace(/\u0000(\d+)\u0000/g, (_, i) => protectedParts[Number(i)]);
}

type Dictionary = { [key: string]: string | Dictionary };

/**
 * Butun lug'atni (ichma-ich obyekt) o'giradi. `overrides` — "namespace.kalit.yo'li"
 * bo'yicha qo'lda berilgan kirill matnlar; ular transliteratsiya natijasini almashtiradi.
 */
export function transliterateDictionary<T extends Dictionary>(
  source: T,
  overrides: Record<string, string> = {},
  path = "",
): T {
  const result: Dictionary = {};
  for (const [key, value] of Object.entries(source)) {
    const fullKey = path ? `${path}.${key}` : key;
    result[key] =
      typeof value === "string"
        ? (overrides[fullKey] ?? latinToCyrillic(value))
        : transliterateDictionary(value, overrides, fullKey);
  }
  return result as T;
}
