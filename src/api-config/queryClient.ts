import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // "always" — staleTime tugamagan bo'lsa ham, oynaga qaytilganda so'rov
      // yuboradi. Natija keshdagi bilan bir xil bo'lsa (structural sharing),
      // komponent qayta render bo'lmaydi — faqat farq bo'lsa yangilanadi.
      refetchOnWindowFocus: "always",
    },
  },
});
