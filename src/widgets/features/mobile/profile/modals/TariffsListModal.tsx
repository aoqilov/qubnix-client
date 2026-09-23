import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { useBuyTariff, useTariffs } from "../hooks/useApiTariffs";

interface TariffsListModalProps {
  open: boolean;
  onClose: () => void;
}

export function TariffsListModal({ open, onClose }: TariffsListModalProps) {
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
      title="Tariflar va narxlar"
    >
      <CusCardbox className="rounded-card">
        {isPending && (
          <p className="text-sm text-secondary">Yuklanmoqda...</p>
        )}

        {isError && (
          <p className="text-sm text-secondary">
            Tariflarni olishda xatolik yuz berdi
          </p>
        )}

        {tariffs && tariffs.length > 0 && (
          <div className="flex flex-col divide-y divide-[var(--border-default)]">
            {tariffs.map((tariff) => (
              <div key={tariff.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{tariff.name}</div>
                  <div className="text-sm text-secondary">
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
    </CusDrawer>
  );
}
