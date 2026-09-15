import type { ReactNode } from "react";
import { LuChevronRight, LuGem, LuPackage } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { useBuyTariff, useTariffs } from "../hooks/useApiTariffs";

export type TariffPanelId = "current-tariff" | "tariffs-list";

interface TariffMenuRowProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  active?: boolean;
  onClick: () => void;
}

function TariffMenuRow({ icon, title, subtitle, active, onClick }: TariffMenuRowProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--bg-hover)] ${
        active ? "bg-[var(--bg-hover)]" : ""
      }`}
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
  activeId: TariffPanelId | null;
  onSelect: (id: TariffPanelId) => void;
}

export function TariffsSection({ activeId, onSelect }: TariffsSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold tracking-wide text-vio">TARIFLAR</div>

      <CusCardbox style={{ padding: 0 }} className="flex flex-col divide-y divide-[var(--border-default)]">
        <TariffMenuRow
          icon={<LuPackage size={18} />}
          title="Mening tariflarim"
          subtitle="Sotib olingan workspace paketlari"
          active={activeId === "current-tariff"}
          onClick={() => onSelect("current-tariff")}
        />
        <TariffMenuRow
          icon={<LuGem size={18} />}
          title="Tariflar va narxlar"
          subtitle="Bepul · Start · Pro paketlari"
          active={activeId === "tariffs-list"}
          onClick={() => onSelect("tariffs-list")}
        />
      </CusCardbox>
    </div>
  );
}

// Backendda foydalanuvchi-darajasidagi tarif ma'lumoti hali yo'q —
// hozircha statik ko'rsatiladi (workspace.store'dagi mock konvensiyasiga mos).
const CURRENT_TARIFF = {
  name: "Pro",
  description: "Cheklovsiz vazifa va loyihalar",
  validUntil: "12.10.2026",
};

export function CurrentTariffCard() {
  return (
    <CusCardbox>
      <div className="mb-2 text-xs font-semibold tracking-wide text-[var(--text-muted)]">
        MENING TARIFLARIM
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold">{CURRENT_TARIFF.name}</div>
          <div className="mt-0.5 text-sm text-[var(--text-muted)]">
            {CURRENT_TARIFF.description}
          </div>
        </div>
        <span className="flex-none whitespace-nowrap bg-[var(--vio-10)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-vio">
          {CURRENT_TARIFF.validUntil} gacha
        </span>
      </div>
    </CusCardbox>
  );
}

export function TariffsListCard() {
  const { data: tariffs, isPending, isError } = useTariffs();
  const buyTariff = useBuyTariff();

  return (
    <CusCardbox>
      <div className="mb-3 text-xs font-semibold tracking-wide text-[var(--text-muted)]">
        TARIFLAR
      </div>

      {isPending && (
        <p className="text-sm text-[var(--text-muted)]">
          Yuklanmoqda...
        </p>
      )}

      {isError && (
        <p className="text-sm text-[var(--text-muted)]">
          Tariflarni olishda xatolik yuz berdi
        </p>
      )}

      {tariffs && tariffs.length > 0 && (
        <div className="flex flex-col divide-y divide-[var(--border-default)]">
          {tariffs.map((tariff) => (
            <div key={tariff.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <div className="font-medium">{tariff.name}</div>
                <div className="text-sm text-[var(--text-muted)]">
                  {tariff.price} {tariff.currency}
                </div>
              </div>
              <CusButton
                size="sm"
                variant="outline"
                isLoading={buyTariff.isPending && buyTariff.variables === tariff.id}
                onClick={() => buyTariff.mutate(tariff.id)}
              >
                Tanlash
              </CusButton>
            </div>
          ))}
        </div>
      )}
    </CusCardbox>
  );
}
