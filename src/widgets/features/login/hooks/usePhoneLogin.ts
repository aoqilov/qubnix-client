import i18n from "@/i18n";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth.api";
import { usersApi } from "@/api/users/users.api";
import { useSessionStore } from "@/store/session.store";
import type {
  RequestPhoneCodeRequest,
  VerifyPhoneCodeRequest,
} from "@/api/auth/auth.types";

/** Axios yoki oddiy Error'dan foydalanuvchiga ko'rsatsa bo'ladigan matn chiqaradi. */
export function authErrorMessage(error: unknown, fallback: string): string {
  const response = (error as { response?: { data?: { message?: string } } })
    ?.response;
  if (response?.data?.message) return response.data.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Backend 404 USER_NOT_FOUND (ro'yxatdan o'tmagan raqam) qaytarganini aniqlaydi. */
export function isUserNotFoundError(error: unknown): boolean {
  const response = (error as { response?: { data?: { code?: string } } })
    ?.response;
  return response?.data?.code === "USER_NOT_FOUND";
}

/** 1-qadam: raqamga tasdiqlash kodi yuborish — javobdagi verification_token 2-qadam uchun saqlanadi. */
export function useSendPhoneCode() {
  const setVerificationToken = useSessionStore((s) => s.setVerificationToken);

  return useMutation({
    mutationFn: (payload: RequestPhoneCodeRequest) =>
      authApi.requestPhoneCode(payload),
    onSuccess: ({ verificationToken }) =>
      setVerificationToken(verificationToken),
  });
}

/**
 * 2-qadam: kodni tekshirish. Javobdagi init_data saqlanadi va shundan keyingi har
 * so'rovga (/users/me'dan boshlab) `initdata` header bo'lib qo'shiladi. Backend
 * qo'shimcha qubnix_session cookie ham o'rnatadi, lekin unga tayanmaymiz — iOS uni
 * boshqa domen cookie'si deb saqlamaydi (session.store.ts).
 */
export function useVerifyPhoneCode() {
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (
      payload: Omit<VerifyPhoneCodeRequest, "verificationToken">,
    ) => {
      const verificationToken = useSessionStore.getState().verificationToken;
      if (!verificationToken) {
        throw new Error(i18n.t("auth.code.sessionExpired"));
      }

      const { initData } = await authApi.verifyPhoneCode({ verificationToken, code: payload.code });
      useSessionStore.getState().setWebInitData(initData);
      return usersApi.me();
    },
    onSuccess: (user) => setSession(user),
  });
}
