import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { LuLoaderCircle, LuRefreshCw, LuTriangleAlert } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { QubnixLogoIntro } from "@/components/shared/enter-logo-page/EnterLogoPage";
import { useUiStore } from "@/store/ui.store";
import { enterWayTelegram } from "./enter-way.telegram";

const SAFE_AREA_STYLE = {
  paddingTop:
    "calc(var(--tg-safe-area-inset-top,0px) + var(--tg-content-safe-area-inset-top,0px))",
  paddingBottom:
    "calc(var(--tg-safe-area-inset-bottom,0px) + var(--tg-content-safe-area-inset-bottom,0px))",
} as const;

interface AuthLoadingProps {
  /** true — to'liq logo intro (faqat birinchi ochilish, introSeen.ts); false — pulsatsiyali icon + spinner. */
  intro?: boolean;
  /** Intro oxirigacha o'ynab bo'lganda. */
  onIntroComplete?: () => void;
}

/** enterWay (Telegram yoki web) /users/me javobini kutayotganda ko'rsatiladi. */
export function AuthLoading({ intro = false, onIntroComplete }: AuthLoadingProps) {
  const { t } = useTranslation();
  // "system" emas: ui.store faqat `.dark` qo'yadi — OS dark + ilova light bo'lsa matn oq chiqardi.
  const logoTheme = useUiStore((s) => (s.isDarkMode ? "dark" : "light"));

  return (
    <div
      className="flex h-dvh w-full flex-col items-center justify-center bg-canvas"
      style={SAFE_AREA_STYLE}
    >
      {intro ? (
        <QubnixLogoIntro theme={logoTheme} onComplete={onIntroComplete} className="w-56" />
      ) : (
        // Intro'dan keyin kelsa — keskin almashmasligi uchun yumshoq paydo bo'ladi.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ opacity: [1, 0.45, 1], scale: [1, 0.96, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <QubnixLogoIntro theme={logoTheme} animated={false} wordmark={false} className="w-20" />
          </motion.div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <LuLoaderCircle size={16} className="animate-spin text-brand" />
            {t("common.states.loading")}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/** /users/me muvaffaqiyatsiz bo'lganda (noto'g'ri/eskirgan initData va h.k.) ko'rsatiladi. */
export function TelegramAuthError() {
  const { t } = useTranslation();
  return (
    <div
      className="flex h-dvh w-full flex-col items-center justify-center bg-canvas"
      style={SAFE_AREA_STYLE}
    >
      <CusDialog
        open
        onClose={() => {}}
        closeOnBackdrop={false}
        centered
        size="sm"
        title={t("layout.authError.title")}
        footer={
          <CusButton
            className="w-full"
            leftIcon={<LuRefreshCw size={16} />}
            onClick={() => void enterWayTelegram()}
          >
            {t("common.actions.retry")}
          </CusButton>
        }
      >
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: "var(--status-error-bg)", color: "var(--status-error-solid)" }}
          >
            <LuTriangleAlert size={24} />
          </span>
          <p className="text-sm text-secondary">
            {t("layout.authError.text")}
          </p>
        </div>
      </CusDialog>
    </div>
  );
}
