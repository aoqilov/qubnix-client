import { useSessionStore } from "@/store/session.store";
import { backoffDelay } from "./backoff";
import { parseSseFrames } from "./parseSseFrames";
import {
  SSE_CONNECTED_EVENT,
  isSseEventType,
  type SseConnect,
  type SseEnvelope,
} from "./sse.types";

/**
 * `initdata` header'li transport — Telegram Mini App va web login (saqlangan
 * init_data) uchun. EventSource maxsus header yubora olmaydi, sessiya esa
 * `initdata` header'ida (interceptors.ts dagi kabi) — shuning uchun fetch streaming.
 *
 * Bu yerda qayta ulanish qo'lda: fetch oqimi tugasa yoki uzilsa, backoff
 * bilan yangi urinish boshlanadi.
 */
export const connectTelegramSse: SseConnect = (url, handlers) => {
  let closed = false;
  let controller: AbortController | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  // Ketma-ket muvaffaqiyatsiz urinishlar. Oqim ochilishi bilan nolga qaytadi —
  // aks holda server idle ulanishni yopib turganda kechikish 30s'da qotib qoladi.
  let failures = 0;

  const handleFrameData = (event: string, data: string) => {
    if (event === SSE_CONNECTED_EVENT) {
      handlers.onStatus("live");
      handlers.onConnected();
      return;
    }
    if (!isSseEventType(event)) {
      if (import.meta.env.DEV) console.warn("[sse] noma'lum hodisa:", event);
      return;
    }
    try {
      handlers.onEvent(JSON.parse(data) as SseEnvelope);
    } catch {
      if (import.meta.env.DEV) console.warn("[sse] JSON parse xatosi:", event);
    }
  };

  /** Bitta urinish. `true` — qayta urinish mumkin, `false` — butunlay to'xtaymiz. */
  const attempt = async (): Promise<boolean> => {
    const initData = useSessionStore.getState().initData;
    if (!initData) return false;

    controller = new AbortController();
    handlers.onStatus("connecting");

    const response = await fetch(url, {
      headers: { initdata: initData, Accept: "text/event-stream" },
      cache: "no-store",
      signal: controller.signal,
    });

    if (response.status === 401) {
      handlers.onUnauthorized();
      return false;
    }
    if (!response.ok) {
      handlers.onStatus("offline");
      return true;
    }
    if (!response.body) {
      // Juda eski WebView — oqim o'qilmaydi. Real-time o'chadi, ilova
      // refetchOnWindowFocus bilan ishlashda davom etadi.
      if (import.meta.env.DEV) console.warn("[sse] ReadableStream qo'llanmaydi");
      handlers.onStatus("offline");
      return false;
    }

    // `connected` hodisasi kelmasa ham ulanish ochilgan hisoblanadi.
    failures = 0;
    handlers.onStatus("live");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { frames, rest } = parseSseFrames(buffer);
        buffer = rest;

        for (const frame of frames) handleFrameData(frame.event, frame.data);
      }
    } finally {
      reader.cancel().catch(() => {});
    }

    // Oqim tugadi (server yopdi yoki tarmoq uzildi) — qayta ulanamiz.
    handlers.onStatus("offline");
    return true;
  };

  const run = async () => {
    while (!closed) {
      let canRetry = false;
      try {
        canRetry = await attempt();
      } catch (err) {
        // disconnect() chaqirilganda abort bo'ladi — bu xato emas.
        if (closed || (err instanceof DOMException && err.name === "AbortError")) break;
        handlers.onStatus("offline");
        canRetry = true;
      }

      if (closed || !canRetry) break;

      failures += 1;
      await new Promise<void>((resolve) => {
        retryTimer = setTimeout(resolve, backoffDelay(failures));
      });
    }
  };

  void run();

  return () => {
    closed = true;
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = null;
    controller?.abort();
    controller = null;
    handlers.onStatus("offline");
  };
};
