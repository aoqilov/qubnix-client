import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionStore } from "@/store/session.store";
import { connectRealtime } from "./connect";
import {
  cancelPendingInvalidations,
  invalidateForEvent,
  resyncAll,
} from "./invalidation";
import type { SseStatus } from "./sse.types";

/**
 * UI'siz komponent: real-time oqimini sessiya holatiga bog'laydi.
 *
 * Nega main.tsx emas — enterWay() tugamaguncha sessiya yo'q, oqim esa
 * autentifikatsiya talab qiladi. Nega AppRoutes emas — u useRoutes bilan
 * shartli shoxlarga bo'linadi, bu esa ulanishni keraksiz uzib-ulaydi.
 */
export function RealtimeBridge() {
  const queryClient = useQueryClient();
  const sessionStatus = useSessionStore((s) => s.status);
  const initData = useSessionStore((s) => s.initData);
  const clearSession = useSessionStore((s) => s.clearSession);

  const statusRef = useRef<SseStatus>("offline");
  // Oyna ko'rinadigan holatga qaytganda majburiy qayta ulanish uchun.
  const [reconnectNonce, setReconnectNonce] = useState(0);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    const disconnect = connectRealtime({
      onEvent: (envelope) => invalidateForEvent(queryClient, envelope),
      // Server hodisa tarixini saqlamaydi — har ulanishda to'liq sinxronlanadi.
      onConnected: () => resyncAll(queryClient),
      onStatus: (status) => {
        statusRef.current = status;
        if (import.meta.env.DEV) console.info("[sse]", status);
      },
      onUnauthorized: () => clearSession(),
    });

    return () => {
      cancelPendingInvalidations();
      disconnect();
    };
  }, [sessionStatus, initData, queryClient, clearSession, reconnectNonce]);

  // Mobil OS (ayniqsa Telegram WebView) fon rejimida oqimni o'ldirishi mumkin,
  // lekin bu har doim `error` bo'lib bilinmaydi. Oyna qaytganda tirikligini
  // tekshiramiz: "live" bo'lmasa qaytadan ulanamiz.
  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && statusRef.current !== "live") {
        setReconnectNonce((n) => n + 1);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [sessionStatus]);

  return null;
}
