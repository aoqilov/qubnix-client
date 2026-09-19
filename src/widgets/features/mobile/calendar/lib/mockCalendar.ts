import { addDays, toDateKey } from "./calendarWeek";

const today = new Date();

/** Kelajakda vazifalar/eventlar API'sidan keladi — hozircha joriy haftaga yaqin 2 ta sana mock qilingan. */
export const MOCK_EVENT_DATES = new Set<string>([toDateKey(addDays(today, 3)), toDateKey(addDays(today, -2))]);
