// O'zbekiston raqamlari: +998 dan keyin 9 ta raqam (90 123 45 67).

export const UZ_DIAL_CODE = "+998";
export const UZ_PHONE_LENGTH = 9;

/** Foydalanuvchi kiritgan matndan faqat milliy 9 raqamni ajratib oladi. */
export function extractUzDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  return digits.slice(0, UZ_PHONE_LENGTH);
}

/** 901234567 -> "90 123 45 67" */
export function formatUzPhone(digits: string): string {
  const groups = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);
  return groups.join(" ");
}

/** 901234567 -> "+998901234567" (backendga shu ketadi) */
export function toE164(digits: string): string {
  return `${UZ_DIAL_CODE}${digits}`;
}

export function isValidUzPhone(digits: string): boolean {
  return digits.length === UZ_PHONE_LENGTH;
}
