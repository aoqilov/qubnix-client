import { useMutation, useQuery } from "@tanstack/react-query";

export interface Tariff {
  id: string;
  name: string;
  price: number;
  currency: string;
}

// Backend'da tariff endpointlari hali yo'q (swiger.json'da yo'q) — hozircha
// mock-data bilan yoziladi. Backend tayyor bo'lganda queryFn/mutationFn'ni
// haqiqiy so'rovlarga almashtirish kifoya.
const MOCK_TARIFFS: Tariff[] = [
  // Tarif nomlari — brend, tarjima qilinmaydi.
  { id: "basic", name: "Basic", price: 0, currency: "UZS" }, // i18n-ignore
  { id: "pro", name: "Pro", price: 149000, currency: "UZS" }, // i18n-ignore
  { id: "business", name: "Business", price: 349000, currency: "UZS" }, // i18n-ignore
];

export const TARIFFS_KEYS = {
  list: () => ["tariffs"] as const,
};

export function useTariffs() {
  return useQuery({
    queryKey: TARIFFS_KEYS.list(),
    queryFn: () => Promise.resolve(MOCK_TARIFFS),
  });
}

export function useBuyTariff() {
  return useMutation({
    mutationFn: (tariffId: string) => Promise.resolve({ tariffId }),
  });
}
