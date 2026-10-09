import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { PricingPlans } from "@/components/shared/pricing/PricingPlans";
import { tariffsQuery } from "@/queries/profile.queries";
import { TariffCheckoutModal } from "./TariffCheckoutModal";
import { useTariffCheckoutSelection } from "./useTariffCheckoutSelection";

interface TariffsListModalProps {
  open: boolean;
  onClose: () => void;
  /** Berilsa — shu tashkilot obunasi yangilanadi (yangi tashkilot ochilmaydi). */
  organization?: { id: string; name: string };
}

/**
 * "Тарифы и цены" — mobil'da to'liq ekran drawer, kartalar ustma-ust. Tanlov → checkout drawer.
 * Ikki joydan ochiladi: /profile ("Тарифы и цены") va /doska ("Создать организацию").
 */
export function TariffsListModal({ open, onClose, organization }: TariffsListModalProps) {
  const { t } = useTranslation();
  const { data: tariffs, isPending, isError } = useQuery(tariffsQuery());
  const checkout = useTariffCheckoutSelection(tariffs, organization);

  function finish() {
    checkout.close();
    onClose();
  }

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
        <PricingPlans tariffs={tariffs} onChoose={checkout.choose} />
      )}

      {checkout.selection && (
        <TariffCheckoutModal
          key={checkout.selection.key}
          open={checkout.isOpen}
          tariff={checkout.selection.tariff}
          period={checkout.selection.period}
          organization={checkout.selection.organization}
          onClose={checkout.close}
          onDone={finish}
        />
      )}
    </CusDrawer>
  );
}
