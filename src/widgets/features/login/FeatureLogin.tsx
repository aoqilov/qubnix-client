import { useTranslation } from "react-i18next";
import { useState } from "react";
import { LuLogIn, LuUserPlus } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { LoginPhoneForm } from "./components/LoginPhoneForm";
import { TelegramRegisterPanel } from "./components/TelegramRegisterPanel";

export default function FeatureLogin() {
  const { t } = useTranslation();
  const tabs = [
    { id: "login", label: t("auth.tabs.login"), icon: <LuLogIn size={17} /> },
    { id: "register", label: t("auth.tabs.register"), icon: <LuUserPlus size={17} /> },
  ];
  const [tab, setTab] = useState("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <CusCardbox className="w-full max-w-sm rounded-modal p-5 shadow-md sm:p-6">
        <div className="mb-5 text-center">
          <h1 className="font-condensed text-3xl tracking-wide text-brand">
            qubnix {/* i18n-ignore — brend */}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-secondary">
            {t("auth.subtitle")}
          </p>
        </div>

        <CusSegment
          items={tabs}
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
