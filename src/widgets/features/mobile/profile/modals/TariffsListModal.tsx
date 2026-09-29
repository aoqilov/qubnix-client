import { useTranslation } from "react-i18next";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { PricingPlans } from "@/components/shared/pricing/PricingPlans";
import { useBuyTariff, useTariffs } from "../hooks/useApiTariffs";

interface TariffsListModalProps {
  open: boolean;
  onClose: () => void;
}

/** "Тарифы и цены" — mobil'da to'liq ekran drawer, kartalar ustma-ust. */
export function TariffsListModal({ open, onClose }: TariffsListModalProps) {
  const { t } = useTranslation();
  const { data: tariffs, isPending, isError } = useTariffs();
  const buyTariff = useBuyTariff();

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title={t("profile.tariffs.list")}
    >
      {isPending ? (
        <p className="text-sm text-secondary">{t("common.states.loading")}</p>
      ) : isError ? (
        <p className="text-sm text-error-strong">{t("profile.tariffs.loadError")}</p>
      ) : (
        <PricingPlans
          tariffs={tariffs}
          pendingId={buyTariff.isPending ? buyTariff.variables?.tariffId : null}
          onChoose={(tariffId, period) => buyTariff.mutate({ tariffId, period })}
        />
      )}
    </CusDrawer>
  );
}
