/** YYYY-MM-DD — backend `date`/`from`/`to` parametrlari uchun, mahalliy (local) sana bo'yicha. */
export function toApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayApiDate(): string {
  return toApiDate(new Date());
}

/** `YYYY-MM-DD` -> mahalliy (local) Date. `new Date(string)` ishlatilmaydi — u UTC deb o'qib, ba'zi zonalarda kunni bir kunga surib yuboradi. */
export function fromApiDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
