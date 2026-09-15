import { useEffect, useState } from "react";
import { LuChevronRight, LuSettings, LuX } from "react-icons/lu";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { useUiStore } from "@/store/ui.store";
import {
  TariffsSection,
  CurrentTariffCard,
  TariffsListCard,
} from "./components/TariffsSection";
import { ProfileUserCard } from "./components/ProfileUserCard";
import { ProfileEditCard } from "./components/ProfileEditCard";
import { ProfileSettingsCard } from "./components/ProfileSettingsCard";

type PanelId =
  | "settings"
  | "current-tariff"
  | "tariffs-list"
  | "edit-profile"
  | null;

export default function FeatureProfile() {
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
    <>
      <CusPageTitle title="Profil" description="Hisob va sozlamalar" />
      <div className="flex gap-6">
        <div className="flex w-full max-w-xl flex-none flex-col gap-5">
          <ProfileUserCard
            active={activePanel === "edit-profile"}
            onEdit={() => select("edit-profile")}
          />

          <CusCardbox style={{ padding: 0 }}>
            <button
              onClick={() => select("settings")}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--bg-hover)] ${
                activePanel === "settings" ? "bg-[var(--bg-hover)]" : ""
              }`}
            >
              <LuSettings
                size={18}
                className="flex-none text-[var(--text-muted)]"
              />
              <span className="flex-1 text-sm font-medium">Sozlamalar</span>
              <LuChevronRight
                size={16}
                className="flex-none text-[var(--text-muted)]"
              />
            </button>
          </CusCardbox>

          <TariffsSection
            activeId={
              activePanel === "current-tariff" || activePanel === "tariffs-list"
                ? activePanel
                : null
            }
            onSelect={select}
          />
        </div>

        {activePanel && (
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex justify-end">
              <button
                onClick={close}
                className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-3)]"
              >
                <LuX size={18} />
              </button>
            </div>
            {activePanel === "edit-profile" && (
              <ProfileEditCard onSaved={close} />
            )}
            {activePanel === "settings" && <ProfileSettingsCard />}
            {activePanel === "current-tariff" && <CurrentTariffCard />}
            {activePanel === "tariffs-list" && <TariffsListCard />}
          </div>
        )}
      </div>
    </>
  );
}
