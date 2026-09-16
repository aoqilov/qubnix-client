import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth.api";
import { usersApi } from "@/api/users/users.api";
import { useSessionStore } from "@/store/session.store";
import type {
  RequestPhoneCodeRequest,
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

/** 1-qadam: raqamga tasdiqlash kodi yuborish — javobdagi verification_token 2-qadam uchun saqlanadi. */
export function useSendPhoneCode() {
  const setVerificationToken = useSessionStore((s) => s.setVerificationToken);

  return useMutation({
    mutationFn: (payload: RequestPhoneCodeRequest) => authApi.requestPhoneCode(payload),
    onSuccess: ({ verificationToken }) => setVerificationToken(verificationToken),
  });
}

/**
 * 2-qadam: kodni tekshirish. Muvaffaqiyatli bo'lsa backend qubnix_session
 * HttpOnly cookie'ni o'zi o'rnatadi (javobdagi init_data'ga web'da ehtiyoj
 * yo'q) — shundan keyingi /users/me so'rovi shu cookie orqali (withCredentials)
 * avtomatik autentifikatsiya qilinadi.
 */
export function useVerifyPhoneCode() {
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (payload: Omit<VerifyPhoneCodeRequest, "verificationToken">) => {
      const verificationToken = useSessionStore.getState().verificationToken;
      if (!verificationToken) {
        throw new Error("Tasdiqlash muddati tugadi, raqamni qaytadan yuboring");
      }

      await authApi.verifyPhoneCode({ verificationToken, code: payload.code });
      return usersApi.me();
    },
    onSuccess: (user) => setSession(user),
  });
}
