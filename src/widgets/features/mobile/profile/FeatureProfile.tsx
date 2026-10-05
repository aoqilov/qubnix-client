import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LuChevronRight, LuDownload, LuSlidersVertical } from "react-icons/lu";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { ProfileUserCard } from "./components/ProfileUserCard";
import { TariffsSection } from "./components/TariffsSection";
import { ProfileSettingsModal } from "./modals/ProfileSettingsModal";
import { ProfileEditModal } from "./modals/ProfileEditModal";
import { CurrentTariffModal } from "./modals/CurrentTariffModal";
import { TariffsListModal } from "./modals/TariffsListModal";
import { InstallAppModal } from "./modals/InstallAppModal";
import { usePwaStore } from "@/store/pwa.store";

type DrawerId =
  | "settings"
  | "current-tariff"
  | "tariffs-list"
  | "edit-profile"
  | "install-app"
  | null;

export default function FeatureProfile() {
  const { t } = useTranslation();
  const [activeDrawer, setActiveDrawer] = useState<DrawerId>(null);
  const isInstalled = usePwaStore((s) => s.isInstalled);
  const [searchParams, setSearchParams] = useSearchParams();

  // Telegram'dan "Открыть в браузере" → /profile?install=1 — yo'riqnoma o'zi ochiladi.
  useEffect(() => {
    if (searchParams.get("install") !== "1") return;
    setActiveDrawer("install-app");
    const next = new URLSearchParams(searchParams);
    next.delete("install");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  function close() {
    setActiveDrawer(null);
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <CusPageTitle title={t("profile.title")} description={t("profile.description")} />

      <ProfileUserCard onEdit={() => setActiveDrawer("edit-profile")} />

      <CusCardbox style={{ padding: 0 }} className="flex flex-col divide-y divide-default rounded-card">
        <button
          onClick={() => setActiveDrawer("settings")}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-secondary"
        >
          <LuSlidersVertical size={18} className="flex-none text-secondary" />
          <span className="flex-1 text-sm font-medium">{t("profile.settings")}</span>
          <LuChevronRight size={16} className="flex-none text-secondary" />
        </button>
        {!isInstalled && (
          <button
            onClick={() => setActiveDrawer("install-app")}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-secondary"
          >
            <LuDownload size={18} className="flex-none text-secondary" />
            <span className="flex-1 text-sm font-medium">{t("profile.install.title")}</span>
            <LuChevronRight size={16} className="flex-none text-secondary" />
          </button>
        )}
      </CusCardbox>

      <TariffsSection
        onSelectCurrent={() => setActiveDrawer("current-tariff")}
        onSelectList={() => setActiveDrawer("tariffs-list")}
      />

      <p className="text-center text-xs text-disabled">
        {t("profile.version", { version: __APP_VERSION__ })}
      </p>

      <ProfileSettingsModal open={activeDrawer === "settings"} onClose={close} />
      <ProfileEditModal open={activeDrawer === "edit-profile"} onClose={close} />
      <CurrentTariffModal
        open={activeDrawer === "current-tariff"}
        onClose={close}
        onRenew={() => setActiveDrawer("tariffs-list")}
      />
      <TariffsListModal open={activeDrawer === "tariffs-list"} onClose={close} />
      <InstallAppModal open={activeDrawer === "install-app"} onClose={close} />
    </div>
  );
}
