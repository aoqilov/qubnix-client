import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { LuChartBarIncreasing, LuChevronRight, LuSlidersVertical } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { PricingPlans } from "@/components/shared/pricing/PricingPlans";
import {
  OrgTariffCard,
  OrgTariffCardSkeleton,
  OrgTariffEmpty,
} from "@/components/shared/org-tariff-card/OrgTariffCard";
import { useBuyTariff, useMyTariffs, useTariffs } from "../hooks/useApiTariffs";

export type TariffPanelId = "current-tariff" | "tariffs-list";

interface TariffMenuRowProps {
  icon: ReactNode;
  title: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

function TariffMenuRow({ icon, title, count, active, onClick }: TariffMenuRowProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-secondary ${
        active ? "bg-surface-secondary" : ""
      }`}
    >
      <span className="flex-none text-secondary">{icon}</span>
      <span className="flex-1 text-sm font-medium text-primary">{title}</span>
      {count !== undefined && (
        <span className="flex-none text-sm font-semibold text-brand">{count}</span>
      )}
      <LuChevronRight size={16} className="flex-none text-secondary" />
    </button>
  );
}

interface TariffsSectionProps {
  activeId: TariffPanelId | null;
  onSelect: (id: TariffPanelId) => void;
}

export function TariffsSection({ activeId, onSelect }: TariffsSectionProps) {
  const { t } = useTranslation();
  // Egasi bo'lgan tashkilotlar soni — yuklanmaguncha son ko'rsatilmaydi.
  const { data: myTariffs } = useMyTariffs();
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold tracking-wide text-secondary">
        {t("profile.tariffs.section")}
      </div>

      <CusCardbox
        style={{ padding: 0 }}
        className="flex flex-col divide-y divide-[var(--border-default)] overflow-hidden rounded-card"
      >
        <TariffMenuRow
          icon={<LuSlidersVertical size={18} />}
          title={t("profile.tariffs.mine")}
          count={myTariffs?.length}
          active={activeId === "current-tariff"}
          onClick={() => onSelect("current-tariff")}
        />
        <TariffMenuRow
          icon={<LuChartBarIncreasing size={18} />}
          title={t("profile.tariffs.list")}
          active={activeId === "tariffs-list"}
          onClick={() => onSelect("tariffs-list")}
        />
      </CusCardbox>
    </div>
  );
}

interface CurrentTariffCardProps {
  /** "Продлить" — to'lov endpointi yo'q, hozircha "Тарифы и цены" panelini ochadi. */
  onRenew: () => void;
}

/** "Мои тарифы" — egasi bo'lgan tashkilotlar tarifi, o'ng panelda 2 ustunli grid. */
export function CurrentTariffCard({ onRenew }: CurrentTariffCardProps) {
  const { t } = useTranslation();
  const { data: tariffs = [], isPending, isError } = useMyTariffs();

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-secondary">
        {t("profile.tariffs.mine")}
      </div>
      {isPending ? (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <OrgTariffCardSkeleton />
          <OrgTariffCardSkeleton />
        </div>
      ) : isError ? (
        <p className="text-sm text-error-strong">{t("profile.tariffs.loadError")}</p>
      ) : tariffs.length === 0 ? (
        <OrgTariffEmpty />
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {tariffs.map((tariff) => (
            <OrgTariffCard key={tariff.id} tariff={tariff} onRenew={onRenew} />
          ))}
        </div>
      )}
    </div>
  );
}

/** "Тарифы и цены" — desktop o'ng panelida, keng ekranda 3 ustun. */
export function TariffsListCard() {
  const { t } = useTranslation();
  const { data: tariffs, isPending, isError } = useTariffs();
  const buyTariff = useBuyTariff();

  if (isPending) return <p className="text-sm text-secondary">{t("common.states.loading")}</p>;
  if (isError) return <p className="text-sm text-error-strong">{t("profile.tariffs.loadError")}</p>;

  return (
    <PricingPlans
      tariffs={tariffs}
      columns="three"
      pendingId={buyTariff.isPending ? buyTariff.variables?.tariffId : null}
      onChoose={(tariffId, period) => buyTariff.mutate({ tariffId, period })}
    />
  );
}
