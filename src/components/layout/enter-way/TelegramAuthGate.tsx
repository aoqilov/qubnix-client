import { motion } from "framer-motion";
import { LuRefreshCw, LuTriangleAlert } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { enterWayTelegram } from "./enter-way.telegram";

const SAFE_AREA_STYLE = {
  paddingTop:
    "calc(var(--tg-safe-area-inset-top,0px) + var(--tg-content-safe-area-inset-top,0px))",
  paddingBottom:
    "calc(var(--tg-safe-area-inset-bottom,0px) + var(--tg-content-safe-area-inset-bottom,0px))",
} as const;

const DOTS = [0, 1, 2];

/** enterWay (Telegram yoki web) /users/me javobini kutayotganda ko'rsatiladi. */
export function AuthLoading() {
  return (
    <div
      className="flex h-dvh w-full flex-col items-center justify-center gap-6 bg-canvas"
      style={SAFE_AREA_STYLE}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex h-20 w-20 items-center justify-center rounded-popover"
        style={{ background: "var(--brand-subtle-bg)" }}
      >
        <motion.div
          className="absolute inset-0 rounded-popover"
          style={{ border: "2px solid var(--brand-default)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-3xl font-bold" style={{ color: "var(--brand-default)" }}>
          Q
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex flex-col items-center gap-1"
      >
        <span className="text-base font-semibold text-primary">Qubnix</span>
        <div className="flex items-center gap-1.5 pt-1">
          {DOTS.map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--brand-default)" }}
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/** /users/me muvaffaqiyatsiz bo'lganda (noto'g'ri/eskirgan initData va h.k.) ko'rsatiladi. */
export function TelegramAuthError() {
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
        title="Не удалось войти"
        footer={
          <CusButton
            className="w-full"
            leftIcon={<LuRefreshCw size={16} />}
            onClick={() => void enterWayTelegram()}
          >
            Повторить
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
            Не удалось подтвердить вход через Telegram. Проверьте соединение и попробуйте снова.
          </p>
        </div>
      </CusDialog>
    </div>
  );
}
