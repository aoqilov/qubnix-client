import { useQuery } from "@tanstack/react-query";
import { myTariffsQuery } from "@/queries/profile.queries";

// Kalit va so'rov umumiy — @/queries/profile.queries. "Тарифы и цены" + xarid oqimi
// /doska bilan umumiy bo'lgani uchun @/components/shared/tariff-checkout'da.
export type { OrgTariff } from "@/queries/profile.queries";

/** "Мои тарифы" — owner bo'lgan tashkilotlar moduli (doska bilan bitta so'rov/kesh). */
export function useMyTariffs() {
  return useQuery(myTariffsQuery());
}
