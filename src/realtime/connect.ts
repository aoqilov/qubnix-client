import { isTelegramMiniApp } from "@/utils/platform";
import { connectTelegramSse } from "./sse.client.telegram";
import { connectWebSse } from "./sse.client.web";
import type { SseDisconnect, SseHandlers } from "./sse.types";

/**
 * Transport forki — enter-way/index.ts bilan bir xil mantiq: platformani
 * shu yerda bir marta tanlaymiz, yuqoridagi kod (RealtimeBridge) qaysi
 * transport ishlayotganini bilmaydi.
 */
const EVENTS_PATH = "/api/v1/events";

function eventsUrl(): string {
  const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
  return `${base}${EVENTS_PATH}`;
}

// Modul darajasida bitta ulanish: hot reload yoki ikki marta mount bo'lganda
// ikkinchi oqim ochilib qolmaydi.
let activeDisconnect: SseDisconnect | null = null;

export function connectRealtime(handlers: SseHandlers): SseDisconnect {
  activeDisconnect?.();

  const connect = isTelegramMiniApp() ? connectTelegramSse : connectWebSse;
  const disconnect = connect(eventsUrl(), handlers);
  activeDisconnect = disconnect;

  return () => {
    if (activeDisconnect === disconnect) activeDisconnect = null;
    disconnect();
  };
}
