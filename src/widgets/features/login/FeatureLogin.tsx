import { useState } from "react";
import { LuLogIn, LuUserPlus } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { LoginPhoneForm } from "./components/LoginPhoneForm";
import { TelegramRegisterPanel } from "./components/TelegramRegisterPanel";

const TABS = [
  { id: "login", label: "Login", icon: <LuLogIn size={17} /> },
  { id: "register", label: "Ro'yxatdan o'tish", icon: <LuUserPlus size={17} /> },
];

export default function FeatureLogin() {
  const [tab, setTab] = useState("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-default)] bg-[var(--bg-second)] p-6 shadow-sm sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="font-condensed text-4xl tracking-wide text-[var(--vio)]">
            qubnix
          </h1>
          <p className="mt-2 text-base leading-relaxed text-[var(--text-muted)]">
            Hisobingizga kiring yoki Telegram orqali ro'yxatdan o'ting
          </p>
        </div>

        <CusSegment
          items={TABS}
          value={tab}
          onValueChange={setTab}
          size="lg"
          className="mb-7"
        />

        {tab === "login" ? <LoginPhoneForm /> : <TelegramRegisterPanel />}
      </div>
    </div>
  );
}
