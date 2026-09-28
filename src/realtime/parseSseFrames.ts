/**
 * text/event-stream oqimini kadrlarga ajratish. Faqat Telegram (fetch
 * streaming) klienti uchun kerak — web'da buni EventSource o'zi qiladi.
 *
 * Sof funksiya: chala kadr `rest` sifatida qaytadi va keyingi chunk bilan
 * birga qayta uzatiladi.
 */
export interface SseFrame {
  /** `event:` qatori; ko'rsatilmagan bo'lsa spetsifikatsiya bo'yicha "message". */
  event: string;
  /** Bir necha `data:` qatori `\n` bilan birlashtiriladi. */
  data: string;
  id?: string;
}

export interface ParsedSseChunk {
  frames: SseFrame[];
  rest: string;
}

export function parseSseFrames(buffer: string): ParsedSseChunk {
  // Serverlar \r\n ham yuborishi mumkin — bo'lishdan oldin normallashtiramiz.
  const normalized = buffer.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized.split("\n\n");
  // Oxirgi bo'lak har doim chala deb hisoblanadi: to'liq bo'lsa oqimda
  // undan keyin "\n\n" turadi va split bo'sh satr qoldiradi.
  const rest = blocks.pop() ?? "";

  const frames: SseFrame[] = [];

  for (const block of blocks) {
    let event = "";
    let id: string | undefined;
    const dataLines: string[] = [];

    for (const line of block.split("\n")) {
      // ":" bilan boshlanadigan qator — izoh (keep-alive), e'tiborsiz.
      if (!line || line.startsWith(":")) continue;

      const colon = line.indexOf(":");
      const field = colon === -1 ? line : line.slice(0, colon);
      // Qiymat oldidagi bitta bo'sh joy spetsifikatsiya bo'yicha tashlanadi.
      const rawValue = colon === -1 ? "" : line.slice(colon + 1);
      const value = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;

      if (field === "event") event = value;
      else if (field === "data") dataLines.push(value);
      else if (field === "id") id = value;
      // `retry:` — faqat EventSource uchun ma'noli, bu yerda backoff o'zimizda.
    }

    if (!dataLines.length && !event) continue;
    frames.push({ event: event || "message", data: dataLines.join("\n"), id });
  }

  return { frames, rest };
}
