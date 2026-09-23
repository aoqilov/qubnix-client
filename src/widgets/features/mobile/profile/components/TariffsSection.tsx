import type { ReactNode } from "react";
import { LuChartBarIncreasing, LuChevronRight, LuSlidersVertical } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { useWorkspaceStore } from "@/store/workspace.store";

interface TariffMenuRowProps {
  icon: ReactNode;
  title: string;
  count?: number;
  onClick: () => void;
}

function TariffMenuRow({ icon, title, count, onClick }: TariffMenuRowProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-secondary"
    >
      <span className="flex-none text-secondary">{icon}</span>
      <span className="flex-1 text-sm font-medium">{title}</span>
      {count !== undefined && (
        <span className="flex-none text-sm font-semibold text-brand">{count}</span>
      )}
      <LuChevronRight size={16} className="flex-none text-secondary" />
    </button>
  );
}

interface TariffsSectionProps {
  onSelectCurrent: () => void;
  onSelectList: () => void;
}

export function TariffsSection({ onSelectCurrent, onSelectList }: TariffsSectionProps) {
  const myTariffsCount = useWorkspaceStore((s) => s.workspaces.length);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold tracking-wide text-secondary">
        TARIFLAR
      </div>

      <CusCardbox
        style={{ padding: 0 }}
        className="flex flex-col divide-y divide-[var(--border-default)] rounded-card"
      >
        <TariffMenuRow
          icon={<LuSlidersVertical size={18} />}
          title="Mening tariflarim"
          count={myTariffsCount}
          onClick={onSelectCurrent}
        />
        <TariffMenuRow
          icon={<LuChartBarIncreasing size={18} />}
          title="Tariflar va narxlar"
          onClick={onSelectList}
        />
      </CusCardbox>
    </div>
  );
}
