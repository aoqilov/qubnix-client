import { useTranslation } from "react-i18next";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import {
  OrgTariffAccordion,
  OrgTariffCardSkeleton,
  OrgTariffEmpty,
} from "@/components/shared/org-tariff-card/OrgTariffCard";
import { useMyTariffs, type OrgTariff } from "../hooks/useApiTariffs";

interface CurrentTariffModalProps {
  open: boolean;
  onClose: () => void;
  /** "Продлить" — "Тарифы и цены" drawer'ini shu tashkilot uchun ochadi. */
  onRenew: (tariff: OrgTariff) => void;
}

/** "Мои тарифы" — foydalanuvchi egasi bo'lgan tashkilotlar va ularning tarif holati. */
export function CurrentTariffModal({ open, onClose, onRenew }: CurrentTariffModalProps) {
  const { t } = useTranslation();
  const { data: tariffs = [], isPending, isError } = useMyTariffs();

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title={t("profile.tariffs.mine")}
    >
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
    </CusDrawer>
  );
}
