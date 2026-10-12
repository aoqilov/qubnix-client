import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuTriangleAlert, LuX } from "react-icons/lu";

/** Xato xabari + 4 soniyadan keyin avtomatik yopilish. */
export function useErrorToast() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);
  return { message, show: setMessage, hide: () => setMessage(null) };
}

interface ErrorToastProps {
  message: string | null;
  onClose: () => void;
}

export function ErrorToast({ message, onClose }: ErrorToastProps) {
  const { t } = useTranslation();
  if (!message) return null;
  return (
    <div
      className="fixed inset-x-4 z-toast flex items-center gap-2 rounded-card border px-4 py-3 shadow-md"
      style={{
        // Telegram notch/header ostiga tushmasligi uchun safe-area + 16px
        // (oddiy brauzerda o'zgaruvchilar yo'q — 16px qoladi).
        top: "calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px) + 16px)",
        background: "var(--status-error-bg)",
        borderColor: "var(--status-error-text)",
        color: "var(--status-error-text)",
      }}
    >
      <LuTriangleAlert size={16} className="flex-none" />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button type="button" aria-label={t("common.actions.close")} onClick={onClose} className="flex-none">
        <LuX size={14} />
      </button>
    </div>
  );
}
