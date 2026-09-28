import { usersApi } from "@/api/users/users.api";
import { isAxiosUnauthorized } from "./isAxiosUnauthorized";
import { SESSION_PROBE_AFTER_FAILURES, backoffDelay } from "./backoff";
import {
  SSE_CONNECTED_EVENT,
  SSE_EVENT_TYPES,
  type SseConnect,
  type SseEnvelope,
} from "./sse.types";

/**
 * Web (oddiy brauzer) uchun transport. Sessiya HttpOnly `qubnix_session`
 * cookie'sida, shuning uchun `withCredentials` — EventSource maxsus header
 * yubora olmaydi, lekin bu yerda kerak ham emas.
 *
 * EventSource o'zi qayta ulanadi (server `retry: 3000` beradi), shuning uchun
 * bu yerda backoff faqat brauzer butunlay taslim bo'lgan holat (readyState
 * CLOSED) uchun.
 */
export const connectWebSse: SseConnect = (url, handlers) => {
  let source: EventSource | null = null;
  let reopenTimer: ReturnType<typeof setTimeout> | null = null;
  let failures = 0;
  let closed = false;

  const open = () => {
    if (closed) return;
    handlers.onStatus("connecting");

    const es = new EventSource(url, { withCredentials: true });
    source = es;

    es.addEventListener(SSE_CONNECTED_EVENT, () => {
      failures = 0;
      handlers.onStatus("live");
      handlers.onConnected();
    });

    // `connected` kelmasa ham ulanish ochilgan hisoblanadi.
    es.onopen = () => {
      failures = 0;
      handlers.onStatus("live");
    };

    for (const type of SSE_EVENT_TYPES) {
      es.addEventListener(type, (event) => {
        try {
          const envelope = JSON.parse((event as MessageEvent<string>).data) as SseEnvelope;
          handlers.onEvent(envelope);
        } catch {
          // Buzuq JSON butun oqimni to'xtatmasligi kerak.
          if (import.meta.env.DEV) console.warn("[sse] JSON parse xatosi:", type);
        }
      });
    }

    es.onerror = () => {
      failures += 1;
      handlers.onStatus("offline");

      // EventSource xato sababini bermaydi (401 ham shu yerga tushadi).
      // Bir nechta urinishdan keyin sessiyani bitta REST so'rov bilan
      // tekshiramiz — yaroqsiz bo'lsa cheksiz qayta urinishning ma'nosi yo'q.
      if (failures === SESSION_PROBE_AFTER_FAILURES) void probeSession();

      if (es.readyState === EventSource.CLOSED && !closed) {
        es.close();
        reopenTimer = setTimeout(open, backoffDelay(failures));
      }
    };
  };

  const probeSession = async () => {
    try {
      await usersApi.me();
    } catch (err) {
      if (isAxiosUnauthorized(err)) {
        disconnect();
        handlers.onUnauthorized();
      }
    }
  };

  const disconnect = () => {
    closed = true;
    if (reopenTimer) clearTimeout(reopenTimer);
    reopenTimer = null;
    source?.close();
    source = null;
    handlers.onStatus("offline");
  };

  open();
  return disconnect;
};
