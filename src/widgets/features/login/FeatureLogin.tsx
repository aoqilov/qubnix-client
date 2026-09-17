import { useState } from "react";
import { LuLogIn, LuUserPlus } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { LoginPhoneForm } from "./components/LoginPhoneForm";
import { TelegramRegisterPanel } from "./components/TelegramRegisterPanel";

const TABS = [
  { id: "login", label: "Login", icon: <LuLogIn size={17} /> },
  {
    id: "register",
    label: "Ro'yxatdan o'tish",
    icon: <LuUserPlus size={17} />,
  },
];

export default function FeatureLogin() {
  const [tab, setTab] = useState("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <CusCardbox className="w-full max-w-sm rounded-modal p-5 shadow-md sm:p-6">
        <div className="mb-5 text-center">
          <h1 className="font-condensed text-3xl tracking-wide text-brand">
            qubnix
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-secondary">
            Hisobingizga kiring yoki Telegram orqali ro'yxatdan o'ting
          </p>
        </div>

        <CusSegment
          items={TABS}
          value={tab}
          onValueChange={setTab}
          size="md"
          className="mb-5"
        />

        {tab === "login" ? <LoginPhoneForm /> : <TelegramRegisterPanel />}
      </CusCardbox>
    </div>
  );
}
