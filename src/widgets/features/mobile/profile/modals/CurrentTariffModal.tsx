import { useTranslation } from "react-i18next";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";

// Backendda foydalanuvchi-darajasidagi tarif ma'lumoti hali yo'q —
// hozircha statik ko'rsatiladi (workspace.store'dagi mock konvensiyasiga mos).
const CURRENT_TARIFF = {
  name: "Pro", // i18n-ignore — tarif nomi (brend)
  descriptionKey: "profile.tariffs.proDescription",
  validUntil: "12.10.2026",
} as const;

interface CurrentTariffModalProps {
  open: boolean;
  onClose: () => void;
}

export function CurrentTariffModal({ open, onClose }: CurrentTariffModalProps) {
  const { t } = useTranslation();
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
      <CusCardbox className="rounded-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold">{CURRENT_TARIFF.name}</div>
            <div className="mt-0.5 text-sm text-secondary">
              {t(CURRENT_TARIFF.descriptionKey)}
            </div>
          </div>
          <span className="flex-none whitespace-nowrap rounded-chip bg-brand-subtle px-2.5 py-1 text-[11px] font-semibold tracking-wide text-brand">
            {t("profile.tariffs.until", { date: CURRENT_TARIFF.validUntil })}
          </span>
        </div>
      </CusCardbox>
    </CusDrawer>
  );
}
