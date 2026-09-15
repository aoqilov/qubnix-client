import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth.api";
import { useSessionStore } from "@/store/session.store";
import type {
  SendPhoneCodeRequest,
  VerifyPhoneCodeRequest,
} from "@/types/auth.types";

/** Axios yoki oddiy Error'dan foydalanuvchiga ko'rsatsa bo'ladigan matn chiqaradi. */
export function authErrorMessage(error: unknown, fallback: string): string {
  const response = (error as { response?: { data?: { message?: string } } })
    ?.response;
  if (response?.data?.message) return response.data.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** 1-qadam: raqamga tasdiqlash kodi yuborish. */
export function useSendPhoneCode() {
  return useMutation({
    mutationFn: (payload: SendPhoneCodeRequest) => authApi.sendPhoneCode(payload),
  });
}

/** 2-qadam: kodni tekshirish va sessiyani ochish. */
export function useVerifyPhoneCode() {
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: VerifyPhoneCodeRequest) =>
      authApi.verifyPhoneCode(payload),
    onSuccess: ({ token, user }) => setSession(token, user),
  });
}
