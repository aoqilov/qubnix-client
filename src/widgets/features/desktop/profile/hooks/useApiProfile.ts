import { useMutation } from "@tanstack/react-query";
import type { SessionUser } from "@/store/session.store";

// Backend profil-yangilash endpointi hali tayyor emas — hozircha mock-data
// bilan yoziladi. Keyinchalik backend tayyor bo'lganda mutationFn'ni haqiqiy
// axiosInstance chaqiruviga almashtirish kifoya.
export function useUpdateProfile() {
  return useMutation({
    mutationFn: (patch: Partial<SessionUser>) =>
      Promise.resolve({ status: 200, data: patch }),
  });
}
