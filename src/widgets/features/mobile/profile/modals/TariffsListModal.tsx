import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { PricingPlans } from "@/components/shared/pricing/PricingPlans";
import { useTariffs, type BillingPeriod, type Tariff } from "../hooks/useApiTariffs";
import { TariffCheckoutModal } from "./TariffCheckoutModal";

interface TariffsListModalProps {
  open: boolean;
  onClose: () => void;
}

interface CheckoutSelection {
  tariff: Tariff;
  period: BillingPeriod;
  /** Har tanlovda yangi — checkout holati (bosqich, nom) noldan boshlanadi. */
  key: number;
}

/** "Тарифы и цены" — mobil'da to'liq ekran drawer, kartalar ustma-ust. Tanlov → checkout drawer. */
export function TariffsListModal({ open, onClose }: TariffsListModalProps) {
  const { t } = useTranslation();
  const { data: tariffs, isPending, isError } = useTariffs();
  // Yopilganda tanlov saqlanib qoladi — drawer yopilish animatsiyasi bo'sh qolmasin.
  const [checkout, setCheckout] = useState<CheckoutSelection | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function choose(tariffId: Tariff["id"], period: BillingPeriod) {
    const tariff = tariffs?.find((item) => item.id === tariffId);
    if (!tariff) return;
    setCheckout({ tariff, period, key: Date.now() });
    setCheckoutOpen(true);
  }

  function finish() {
    setCheckoutOpen(false);
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
        <PricingPlans tariffs={tariffs} onChoose={choose} />
      )}

      {checkout && (
        <TariffCheckoutModal
          key={checkout.key}
          open={checkoutOpen}
          tariff={checkout.tariff}
          period={checkout.period}
          onClose={() => setCheckoutOpen(false)}
          onDone={finish}
        />
      )}
    </CusDrawer>
  );
}
