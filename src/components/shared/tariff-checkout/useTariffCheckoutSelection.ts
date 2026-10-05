import { useState } from "react";
import type { BillingPeriod, Tariff, TariffId } from "@/queries/profile.queries";

export interface CheckoutSelection {
  tariff: Tariff;
  period: BillingPeriod;
  /** Har tanlovda yangi — `TariffCheckoutModal`ga `key` bo'lib, holatni (bosqich, nom) noldan boshlaydi. */
  key: number;
}

/**
 * Tarif kartasidagi "Выбрать" → checkout (mobil drawer va desktop dialog uchun umumiy).
 * Yopilganda tanlov saqlanib qoladi — yopilish animatsiyasi bo'sh oynada o'tmasin.
 */
export function useTariffCheckoutSelection(tariffs: Tariff[] | undefined) {
  const [selection, setSelection] = useState<CheckoutSelection | null>(null);
  const [isOpen, setOpen] = useState(false);

  function choose(tariffId: TariffId, period: BillingPeriod) {
    const tariff = tariffs?.find((item) => item.id === tariffId);
    if (!tariff) return;
    setSelection({ tariff, period, key: Date.now() });
    setOpen(true);
  }

  return { selection, isOpen, choose, close: () => setOpen(false) };
}
