import i18n from "@/i18n";

/**
 * Son + ot, joriy tilning ko'plik qoidasi bilan: "4 задачи" / "4 ta vazifa".
 * i18next `count` orqali Intl.PluralRules'dan foydalanadi (ru — one/few/many).
 * Render paytida chaqiriladi — chaqiruvchi komponent `useTranslation` ishlatgani
 * uchun til almashganda qayta hisoblanadi.
 */
export function tasksLabel(count: number): string {
  return i18n.t("common.count.tasks", { count });
}

/** Faqat so'z, raqamsiz — raqam alohida katta shriftda turganda: "задачи" / "vazifa". */
export function tasksWordLabel(count: number): string {
  return i18n.t("common.count.tasksWord", { count });
}

export function orgsLabel(count: number): string {
  return i18n.t("common.count.orgs", { count });
}

export function projectsLabel(count: number): string {
  return i18n.t("common.count.projects", { count });
}

export function membersLabel(count: number): string {
  return i18n.t("common.count.members", { count });
}

export function daysLabel(count: number): string {
  return i18n.t("common.count.days", { count });
}

/** Faqat so'z, raqamsiz: "дней" / "kun". */
export function daysWordLabel(count: number): string {
  return i18n.t("common.count.daysWord", { count });
}
