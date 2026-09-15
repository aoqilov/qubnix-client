import { axiosInstance } from "@/api-config/axiosInstance";
import { mockSendPhoneCode, mockVerifyPhoneCode } from "./auth.mock";
import type {
  AuthByTelegramInitDataRequest,
  AuthResponse,
  SendPhoneCodeRequest,
  SendPhoneCodeResponse,
  TelegramLoginWidgetPayload,
  VerifyPhoneCodeRequest,
} from "@/types/auth.types";

// Telefon + OTP backend'i hali yo'q — tayyor bo'lganda shuni false qiling,
// qolgan kod (hooklar, UI) o'zgarishsiz real endpointga o'tadi.
const USE_MOCK_PHONE_AUTH = true;

export const authApi = {
  byTelegramInitData: (payload: AuthByTelegramInitDataRequest) =>
    axiosInstance.post<AuthResponse>("/auth/telegram", payload).then((r) => r.data),

  byTelegramWidget: (payload: TelegramLoginWidgetPayload) =>
    axiosInstance.post<AuthResponse>("/auth/telegram-widget", payload).then((r) => r.data),

  /** Telefon raqamga tasdiqlash kodini yuborish (kod Telegram bot orqali keladi). */
  sendPhoneCode: (payload: SendPhoneCodeRequest): Promise<SendPhoneCodeResponse> =>
    USE_MOCK_PHONE_AUTH
      ? mockSendPhoneCode(payload)
      : axiosInstance
          .post<SendPhoneCodeResponse>("/auth/phone/send-code", payload)
          .then((r) => r.data),

  /** Kodni tekshirish va sessiya ochish. */
  verifyPhoneCode: (payload: VerifyPhoneCodeRequest): Promise<AuthResponse> =>
    USE_MOCK_PHONE_AUTH
      ? mockVerifyPhoneCode(payload)
      : axiosInstance
          .post<AuthResponse>("/auth/phone/verify", payload)
          .then((r) => r.data),

  me: () => axiosInstance.get<AuthResponse["user"]>("/auth/me").then((r) => r.data),
};
