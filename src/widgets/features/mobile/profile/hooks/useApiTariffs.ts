import { useMutation, useQuery } from "@tanstack/react-query";
import type { Tariff } from "@/types/workspace.types";

// Backend tariff endpointlari hali tayyor emas — hozircha mock-data bilan
// yoziladi. Keyinchalik backend tayyor bo'lganda faqat queryFn/mutationFn'ni
// workspaceApi.tariffs/.buy bilan almashtirish kifoya (src/api/workspace/workspace.api.ts).
const MOCK_TARIFFS: Tariff[] = [
  { id: "basic", name: "Basic", price: 0, currency: "UZS" },
  { id: "pro", name: "Pro", price: 149000, currency: "UZS" },
  { id: "business", name: "Business", price: 349000, currency: "UZS" },
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
