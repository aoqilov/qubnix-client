import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { LuChartBarIncreasing, LuChevronRight, LuSlidersVertical } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { PricingPlans } from "@/components/shared/pricing/PricingPlans";
import {
  OrgTariffAccordion,
  OrgTariffCardSkeleton,
  OrgTariffEmpty,
} from "@/components/shared/org-tariff-card/OrgTariffCard";
import { TariffCheckoutModal } from "@/components/shared/tariff-checkout/TariffCheckoutModal";
import { useTariffCheckoutSelection } from "@/components/shared/tariff-checkout/useTariffCheckoutSelection";
import { useMyTariffs, useTariffs, type OrgTariff } from "../hooks/useApiTariffs";

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
  /** "Продлить" — "Тарифы и цены" panelini shu tashkilot uchun ochadi. */
  onRenew: (tariff: OrgTariff) => void;
}

/** "Мои тарифы" — egasi bo'lgan tashkilotlar tarifi, o'ng panelda accordion. */
export function CurrentTariffCard({ onRenew }: CurrentTariffCardProps) {
  const { t } = useTranslation();
  const { data: tariffs = [], isPending, isError } = useMyTariffs();

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-secondary">
        {t("profile.tariffs.mine")}
      </div>
      {isPending ? (
        <div className="flex flex-col gap-2">
          <OrgTariffCardSkeleton />
          <OrgTariffCardSkeleton />
        </div>
      ) : isError ? (
        <p className="text-sm text-error-strong">{t("profile.tariffs.loadError")}</p>
      ) : tariffs.length === 0 ? (
        <OrgTariffEmpty />
      ) : (
        <OrgTariffAccordion tariffs={tariffs} onRenew={onRenew} />
      )}
    </div>
  );
}

interface TariffsListCardProps {
  /** Berilsa — shu tashkilot obunasi yangilanadi (yangi tashkilot ochilmaydi). */
  organization?: { id: string; name: string };
  /** Bepul tarif ulangach "Готово" — yangi tashkilot ko'rinadigan "Мои тарифы"ga o'tadi. */
  onDone: () => void;
}

/** "Тарифы и цены" — desktop o'ng panelida, keng ekranda 3 ustun. Tanlov → checkout dialog. */
export function TariffsListCard({ organization, onDone }: TariffsListCardProps) {
  const { t } = useTranslation();
  const { data: tariffs, isPending, isError } = useTariffs();
  const checkout = useTariffCheckoutSelection(tariffs, organization);

  if (isPending) return <p className="text-sm text-secondary">{t("common.states.loading")}</p>;
  if (isError) return <p className="text-sm text-error-strong">{t("profile.tariffs.loadError")}</p>;

  return (
    <>
      <PricingPlans tariffs={tariffs} columns="three" onChoose={checkout.choose} />
      {checkout.selection && (
        <TariffCheckoutModal
          key={checkout.selection.key}
          variant="dialog"
          open={checkout.isOpen}
          tariff={checkout.selection.tariff}
          period={checkout.selection.period}
          organization={checkout.selection.organization}
          onClose={checkout.close}
          onDone={() => {
            checkout.close();
            onDone();
          }}
        />
      )}
    </>
  );
}
