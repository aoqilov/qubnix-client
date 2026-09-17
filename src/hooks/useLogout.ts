import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth.api";
import { useSessionStore } from "@/store/session.store";

/**
 * Web uchun /auth/logout chaqiradi (cookie o'chadi), so'ng local sessiyani
 * tozalaydi — AppRoutes shundan keyin avtomatik /login'ga o'tkazadi.
 * Telegram Mini App'da chaqirishning ma'nosi yo'q: initdata backend tomonda
 * bekor bo'lmaydi, keyingi ochilishda baribir avtomatik qayta kiraveradi.
 */
export function useLogout() {
  const clearSession = useSessionStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => clearSession(),
  });
}
