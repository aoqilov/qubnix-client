/**
 * GET /api/v1/events oqimidagi hodisalar. Server faqat joriy foydalanuvchiga
 * tegishli (uning tashkilot/loyihalaridagi) hodisalarni yuboradi.
 *
 * Server hodisa tarixini saqlamaydi: uzilish davridagi hodisalar yo'qoladi,
 * shuning uchun har bir (qayta) ulanishdan keyin ro'yxatlar REST orqali
 * to'liq sinxronlanadi — RealtimeBridge'dagi `connected` ishlovchisiga qarang.
 */
export const SSE_EVENT_TYPES = [
  "project.created",
  "project.updated",
  "project.deleted",
  "project.member_added",
  "project.member_removed",

  "organization.invitation.created",
  "organization.invitation.accepted",
  "organization.invitation.rejected",
  "organization.invitation.cancelled",

  "task.created",
  "task.updated",
  "task.deleted",
  "task.status_changed",
  "task.assignees_changed",
  "task.subtasks_changed",
  "task.access_revoked",

  "routine.task_created",
] as const;

export type SseEventType = (typeof SSE_EVENT_TYPES)[number];

/** Ulanish ochilganda server yuboradigan boshqaruv hodisasi — ro'yxatda emas. */
export const SSE_CONNECTED_EVENT = "connected";

export interface SseEnvelope<T = Record<string, unknown>> {
  id: string;
  type: SseEventType;
  version: number;
  /** ISO-8601. */
  occurred_at: string;
  /** Hodisani keltirib chiqargan foydalanuvchi — o'z amalini filtrlash uchun. */
  actor_id: string;
  organization_id: string | null;
  project_id: string | null;
  resource_id: string;
  data: T;
}

/** `task.status_changed` — 2-fazadagi toast/indikator uchun. */
export interface TaskStatusChangedData {
  task_id: string;
  from: string;
  to: string;
}

export type SseStatus = "connecting" | "live" | "offline";

export interface SseHandlers {
  /** Ro'yxatga kirmagan (noma'lum) hodisa nomlari bu yerga yetib kelmaydi. */
  onEvent: (envelope: SseEnvelope) => void;
  /** Ulanish ochilganda — to'liq resync shu yerdan boshlanadi. */
  onConnected: () => void;
  onStatus: (status: SseStatus) => void;
  /** Sessiya yaroqsiz (401). Qayta ulanish to'xtatiladi. */
  onUnauthorized: () => void;
}

export type SseDisconnect = () => void;
export type SseConnect = (url: string, handlers: SseHandlers) => SseDisconnect;

const EVENT_TYPE_SET = new Set<string>(SSE_EVENT_TYPES);

export function isSseEventType(value: string): value is SseEventType {
  return EVENT_TYPE_SET.has(value);
}
