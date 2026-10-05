import { useQuery } from "@tanstack/react-query";
import {
  myTariffsQuery,
  tariffsQuery,
  useCreateTariffOrderMutation,
} from "@/queries/profile.queries";

// Kalit, so'rov va mutation umumiy — @/queries/profile.queries (hozircha mock).
export type {
  BillingPeriod,
  OrgTariff,
  PaymentProvider,
  Tariff,
  TariffOrder,
} from "@/queries/profile.queries";

export function useTariffs() {
  return useQuery(tariffsQuery());
}

/** Tarif xaridi: tashkilot nomi → buyurtma + Payme/Click havolalari. */
export const useCreateTariffOrder = useCreateTariffOrderMutation;

/** "Мои тарифы" — owner bo'lgan tashkilotlar moduli (doska bilan bitta so'rov/kesh). */
export function useMyTariffs() {
  return useQuery(myTariffsQuery());
}
