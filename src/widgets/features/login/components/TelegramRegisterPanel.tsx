import { LuExternalLink, LuSend } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { BOT_URL, BOT_USERNAME, openBot } from "../lib/bot";

const STEPS = [
  "Quyidagi tugma orqali botni oching",
  "Botda «Start» bosing va telefon raqamingizni ulashing",
  "Ro'yxatdan o'tgach, shu yerga qaytib «Login» orqali kiring",
];

export function TelegramRegisterPanel() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-base leading-relaxed text-secondary">
        Tugmani bossangiz{" "}
        <span className="font-semibold text-brand">@{BOT_USERNAME}</span>{" "}
        yangi oynada ochiladi.
      </p>

      <ol className="flex flex-col gap-3">
        {STEPS.map((text, index) => (
          <li
            key={text}
            className="flex items-start gap-3 text-base leading-relaxed text-secondary"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-on-brand">
              {index + 1}
            </span>
            {text}
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
        Telegram bot orqali ro'yxatdan o'tish
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
