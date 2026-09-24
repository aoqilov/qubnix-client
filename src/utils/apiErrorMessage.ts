import axios from "axios";
import i18n from "@/i18n";

/**
 * Backend xato javobi `{statusCode, message, code, details}` shaklida keladi. Backend
 * `message` bersa — o'sha ko'rsatiladi, aks holda joriy tildagi umumiy matn.
 * Oldin har bir feature'da o'zining `getErrorMessage` nusxasi bor edi.
 */
export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message;
    if (typeof message === "string" && message) return message;
  }
  return i18n.t("common.states.actionError");
}
