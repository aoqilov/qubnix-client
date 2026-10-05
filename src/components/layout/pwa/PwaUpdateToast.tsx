import { useTranslation } from "react-i18next";
import { LuRefreshCw } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { usePwaStore } from "@/store/pwa.store";

/**
 * Yangi versiya fonda yuklab bo'lingach chiqadi (src/pwa/registerPwa.ts → needRefresh).
 * Yangilanish o'zi qo'llanmaydi: "Обновить" — darhol qayta yuklash, "Позже" — keyingi to'liq
 * yopib-ochishda qo'llanadi. Telegram ichida service worker yo'q — u yerda hech qachon chiqmaydi.
 */
export function PwaUpdateToast() {
  const { t } = useTranslation();
  const needRefresh = usePwaStore((s) => s.needRefresh);
  const setNeedRefresh = usePwaStore((s) => s.setNeedRefresh);
  const applyUpdate = usePwaStore((s) => s.applyUpdate);

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 z-toast mx-auto flex max-w-md flex-col gap-3 rounded-card border border-default bg-surface p-4 shadow-dropdown"
      style={{
        // Telegram/iOS notch ostiga tushmasligi uchun safe-area + 16px (oddiy brauzerda 16px).
        top: "calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px) + env(safe-area-inset-top, 0px) + 16px)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-8 flex-none items-center justify-center rounded-avatar bg-brand-subtle text-brand">
          <LuRefreshCw size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-primary">{t("layout.pwaUpdate.title")}</div>
          <div className="mt-0.5 text-sm text-secondary">{t("layout.pwaUpdate.text")}</div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <CusButton variant="ghost" colorPalette="gray" size="sm" onClick={() => setNeedRefresh(false)}>
          {t("layout.pwaUpdate.later")}
        </CusButton>
        <CusButton size="sm" onClick={applyUpdate}>
          {t("layout.pwaUpdate.apply")}
        </CusButton>
      </div>
    </div>
  );
}
