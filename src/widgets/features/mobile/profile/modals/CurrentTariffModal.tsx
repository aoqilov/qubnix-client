import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";

// Backendda foydalanuvchi-darajasidagi tarif ma'lumoti hali yo'q —
// hozircha statik ko'rsatiladi (workspace.store'dagi mock konvensiyasiga mos).
const CURRENT_TARIFF = {
  name: "Pro",
  description: "Cheklovsiz vazifa va loyihalar",
  validUntil: "12.10.2026",
};

interface CurrentTariffModalProps {
  open: boolean;
  onClose: () => void;
}

export function CurrentTariffModal({ open, onClose }: CurrentTariffModalProps) {
  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title="Mening tariflarim"
    >
      <CusCardbox>
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
    </CusDrawer>
  );
}
