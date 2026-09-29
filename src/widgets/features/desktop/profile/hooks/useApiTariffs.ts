import { useQuery } from "@tanstack/react-query";
import { myTariffsQuery, tariffsQuery, useBuyTariffMutation } from "@/queries/profile.queries";

// Kalit, so'rov va mutation umumiy — @/queries/profile.queries (hozircha mock).
export type { OrgTariff, Tariff } from "@/queries/profile.queries";

export function useTariffs() {
  return useQuery(tariffsQuery());
}

export const useBuyTariff = useBuyTariffMutation;

/** "Мои тарифы" — owner bo'lgan tashkilotlar moduli (doska bilan bitta so'rov/kesh). */
export function useMyTariffs() {
  return useQuery(myTariffsQuery());
}
