import { LuExternalLink, LuInfo, LuSend } from "react-icons/lu";
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
      <div className="flex items-start gap-3 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4">
        <LuInfo size={20} className="mt-0.5 shrink-0 text-[var(--vio)]" />
        <p className="text-base font-medium leading-relaxed text-[var(--text-2)]">
          Dasturga ro'yxatdan o'tish{" "}
          <span className="text-[var(--vio)]">faqat Telegram bot orqali</span>{" "}
          amalga oshiriladi. Boshqa ro'yxatdan o'tish usuli mavjud emas.
        </p>
      </div>

      <p className="text-base leading-relaxed text-[var(--text-3)]">
        Tugmani bossangiz{" "}
        <span className="font-semibold text-[var(--vio)]">@{BOT_USERNAME}</span>{" "}
        yangi oynada ochiladi.
      </p>

      <ol className="flex flex-col gap-3">
        {STEPS.map((text, index) => (
          <li
            key={text}
            className="flex items-start gap-3 text-base leading-relaxed text-[var(--text-3)]"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--vio)] text-sm font-semibold text-[var(--text-on-accent)]">
              {index + 1}
            </span>
            {text}
          </li>
        ))}
      </ol>

      <CusButton
        colorPalette="purple"
        size="xl"
        leftIcon={<LuSend size={18} />}
        rightIcon={<LuExternalLink size={15} />}
        onClick={() => openBot("register")}
      >
        Telegram bot orqali ro'yxatdan o'tish
      </CusButton>

      <a
        href={BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto text-sm text-[var(--text-muted)] transition hover:text-[var(--vio)]"
      >
        {BOT_URL.replace("https://", "")}
      </a>
    </div>
  );
}
