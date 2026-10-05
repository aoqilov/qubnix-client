import { useQuery } from "@tanstack/react-query";
import { myTariffsQuery, tariffsQuery } from "@/queries/profile.queries";

// Kalit va so'rov umumiy — @/queries/profile.queries. Xarid oqimi — @/components/shared/tariff-checkout.
export type { OrgTariff, Tariff } from "@/queries/profile.queries";

export function useTariffs() {
  return useQuery(tariffsQuery());
}

/** "Мои тарифы" — owner bo'lgan tashkilotlar moduli (doska bilan bitta so'rov/kesh). */
export function useMyTariffs() {
  return useQuery(myTariffsQuery());
}
