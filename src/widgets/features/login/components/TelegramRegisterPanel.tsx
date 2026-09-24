import { useTranslation } from "react-i18next";
import { LuExternalLink, LuSend } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { BOT_URL, BOT_USERNAME, openBot } from "../lib/bot";

const STEP_KEYS = ["auth.register.step1", "auth.register.step2", "auth.register.step3"] as const;

export function TelegramRegisterPanel() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      <p className="text-base leading-relaxed text-secondary">
        {t("auth.register.introBefore")}{" "}
        <span className="font-semibold text-brand">@{BOT_USERNAME}</span>{" "}
        {t("auth.register.introAfter")}
      </p>

      <ol className="flex flex-col gap-3">
        {STEP_KEYS.map((key, index) => (
          <li
            key={key}
            className="flex items-start gap-3 text-base leading-relaxed text-secondary"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-on-brand">
              {index + 1}
            </span>
            {t(key)}
          </li>
        ))}
      </ol>

      <CusButton
        size="xl"
        leftIcon={<LuSend size={18} />}
        rightIcon={<LuExternalLink size={15} />}
        onClick={() => openBot("register")}
        style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
      >
        {t("auth.register.button")}
      </CusButton>

      <a
        href={BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto text-sm text-secondary transition hover:text-brand"
      >
        {BOT_URL.replace("https://", "")}
      </a>
    </div>
  );
}
