import type { ReactNode } from "react";
import { LuChevronRight, LuGem, LuPackage } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";

interface TariffMenuRowProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

function TariffMenuRow({ icon, title, subtitle, onClick }: TariffMenuRowProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--bg-hover)]"
    >
      <span className="flex-none text-[var(--text-muted)]">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-[var(--text-muted)]">
          {subtitle}
        </span>
      </span>
      <LuChevronRight size={16} className="flex-none text-[var(--text-muted)]" />
    </button>
  );
}

interface TariffsSectionProps {
  onSelectCurrent: () => void;
  onSelectList: () => void;
}

export function TariffsSection({ onSelectCurrent, onSelectList }: TariffsSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold tracking-wide text-vio">TARIFLAR</div>

      <CusCardbox style={{ padding: 0 }} className="flex flex-col divide-y divide-[var(--border-default)]">
        <TariffMenuRow
          icon={<LuPackage size={18} />}
          title="Mening tariflarim"
          subtitle="Sotib olingan workspace paketlari"
          onClick={onSelectCurrent}
        />
        <TariffMenuRow
          icon={<LuGem size={18} />}
          title="Tariflar va narxlar"
          subtitle="Bepul · Start · Pro paketlari"
          onClick={onSelectList}
        />
      </CusCardbox>
    </div>
  );
}
