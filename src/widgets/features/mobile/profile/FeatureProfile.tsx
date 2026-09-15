import { useState } from "react";
import { LuChevronRight, LuSettings } from "react-icons/lu";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { ProfileUserCard } from "./components/ProfileUserCard";
import { TariffsSection } from "./components/TariffsSection";
import { ProfileSettingsModal } from "./modals/ProfileSettingsModal";
import { ProfileEditModal } from "./modals/ProfileEditModal";
import { CurrentTariffModal } from "./modals/CurrentTariffModal";
import { TariffsListModal } from "./modals/TariffsListModal";

type DrawerId = "settings" | "current-tariff" | "tariffs-list" | "edit-profile" | null;

export default function FeatureProfile() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerId>(null);

  function close() {
    setActiveDrawer(null);
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <CusPageTitle title="Profil" description="Hisob va sozlamalar" />

      <ProfileUserCard onEdit={() => setActiveDrawer("edit-profile")} />

      <CusCardbox style={{ padding: 0 }}>
        <button
          onClick={() => setActiveDrawer("settings")}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--bg-hover)]"
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
        onSelectCurrent={() => setActiveDrawer("current-tariff")}
        onSelectList={() => setActiveDrawer("tariffs-list")}
      />

      <ProfileSettingsModal open={activeDrawer === "settings"} onClose={close} />
      <ProfileEditModal open={activeDrawer === "edit-profile"} onClose={close} />
      <CurrentTariffModal open={activeDrawer === "current-tariff"} onClose={close} />
      <TariffsListModal open={activeDrawer === "tariffs-list"} onClose={close} />
    </div>
  );
}
