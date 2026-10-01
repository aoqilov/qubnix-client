import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LuChevronRight, LuSlidersVertical, LuX } from "react-icons/lu";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { useUiStore } from "@/store/ui.store";
import { TariffsSection, CurrentTariffCard, TariffsListCard } from "./components/TariffsSection";
import { ProfileUserCard } from "./components/ProfileUserCard";
import { ProfileEditCard } from "./components/ProfileEditCard";
import { ProfileSettingsCard } from "./components/ProfileSettingsCard";

type PanelId = "settings" | "current-tariff" | "tariffs-list" | "edit-profile" | null;

/**
 * Desktop profil — chapda menyu, tanlangan bo'lim o'ngdagi panelda ochiladi
 * (mobil'da har biri to'liq ekran drawer). Panel ochiq paytda sidebar yig'iladi.
 */
export default function FeatureProfile() {
  const { t } = useTranslation();
  const [activePanel, setActivePanel] = useState<PanelId>(null);
  const setSidebarCollapsed = useUiStore((s) => s.setSidebarCollapsed);

  function select(id: PanelId) {
    setActivePanel(id);
    setSidebarCollapsed(true);
  }

  function close() {
    setActivePanel(null);
    setSidebarCollapsed(false);
  }

  useEffect(() => {
    return () => setSidebarCollapsed(false);
  }, [setSidebarCollapsed]);

  return (
    <div className="flex flex-col gap-5">
      <CusPageTitle className="" title={t("profile.title")} subtitle={t("profile.description")} />

      <div className="flex gap-6">
        <div className="flex w-full max-w-xl flex-none flex-col gap-5">
          <ProfileUserCard
            active={activePanel === "edit-profile"}
            onEdit={() => select("edit-profile")}
          />

          <CusCardbox style={{ padding: 0 }} className="overflow-hidden rounded-card">
            <button
              onClick={() => select("settings")}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-secondary ${
                activePanel === "settings" ? "bg-surface-secondary" : ""
              }`}
            >
              <LuSlidersVertical size={18} className="flex-none text-secondary" />
              <span className="flex-1 text-sm font-medium text-primary">{t("profile.settings")}</span>
              <LuChevronRight size={16} className="flex-none text-secondary" />
            </button>
          </CusCardbox>

          <TariffsSection
            activeId={
              activePanel === "current-tariff" || activePanel === "tariffs-list" ? activePanel : null
            }
            onSelect={select}
          />
        </div>

        {activePanel && (
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex justify-end">
              <button
                onClick={close}
                aria-label={t("common.actions.close")}
                className="rounded-input p-1.5 text-secondary transition hover:bg-surface-secondary hover:text-primary"
              >
                <LuX size={18} />
              </button>
            </div>
            {activePanel === "edit-profile" && <ProfileEditCard onSaved={close} />}
            {activePanel === "settings" && <ProfileSettingsCard />}
            {activePanel === "current-tariff" && (
              <CurrentTariffCard onRenew={() => select("tariffs-list")} />
            )}
            {activePanel === "tariffs-list" && <TariffsListCard />}
          </div>
        )}
      </div>
    </div>
  );
}
