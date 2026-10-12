import { useState } from "react";
import { todayApiDate } from "@/utils/apiDate";

export type DateMode = "today" | "calendar";

const DATE_MODE_KEY = "qubnix_tasks_date_mode";

// Safari private rejimi va bloklangan saqlash localStorage'da xato tashlaydi.
function readDateMode(): DateMode {
  try {
    return localStorage.getItem(DATE_MODE_KEY) === "calendar" ? "calendar" : "today";
  } catch {
    return "today";
  }
}

function writeDateMode(mode: DateMode) {
  try {
    localStorage.setItem(DATE_MODE_KEY, mode);
  } catch {
    // saqlanmasa ham tanlov joriy sessiyada ishlaydi
  }
}

/**
 * /tasks sarlavhasidagi "Bugun / Kalendar" toggle holati (mobil va desktop umumiy).
 * "today" — kun bugunga qotirilgan; "calendar" — ustida haftalik lenta chiqadi va kun almashtiriladi.
 * Tanlov localStorage'da eslab qolinadi; /calendar'dan boshqa sana bilan kelinsa lenta majburan
 * ochiladi (saqlangan tanlov o'zgarmaydi).
 */
export function useDateMode(initialDate: string, setSelectedDate: (date: string) => void) {
  const [dateMode, setDateMode] = useState<DateMode>(() =>
    initialDate !== todayApiDate() ? "calendar" : readDateMode(),
  );

  function changeMode(mode: DateMode) {
    setDateMode(mode);
    writeDateMode(mode);
  }

  /** Bugunga qaytadi va lentani yopadi. */
  function showToday() {
    changeMode("today");
    setSelectedDate(todayApiDate());
  }

  function onModeChange(mode: DateMode) {
    if (mode === "today") showToday();
    else changeMode("calendar");
  }

  return { dateMode, showToday, onModeChange };
}
