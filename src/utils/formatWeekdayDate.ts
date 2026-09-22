/**
 * Sarlavha ostidagi sana qatori: "СРЕДА - 14.09.2026".
 *
 * Hafta kuni ru-RU locale'dan olinadi va bosh harflarga o'giriladi; sana esa
 * qo'lda `dd.MM.yyyy` ko'rinishida yig'iladi, chunki Intl ba'zi muhitlarda
 * `14.09.2026` o'rniga `14.09.26` qaytarishi mumkin.
 */
export function formatWeekdayDate(date: Date = new Date()): string {
  const weekday = new Intl.DateTimeFormat("ru-RU", { weekday: "long" })
    .format(date)
    .toUpperCase();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${weekday} - ${day}.${month}.${date.getFullYear()}`;
}
