import type {
  AuthResponse,
  SendPhoneCodeRequest,
  SendPhoneCodeResponse,
  VerifyPhoneCodeRequest,
} from "@/types/auth.types";

// Backend'da telefon + OTP endpointlari tayyor bo'lguncha ishlatiladigan mock.
// Real endpoint ulanganda auth.api.ts dagi USE_MOCK_PHONE_AUTH ni false qiling.

/** Mock rejimda faqat shu kod to'g'ri hisoblanadi. */
export const MOCK_OTP_CODE = "123456";

export const MOCK_OTP_TTL_SEC = 120;

const MOCK_USER: AuthResponse["user"] = {
  id: "mock-akiylov",
  fullName: "@akiylov",
  role: "Admin",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockSendPhoneCode(
  payload: SendPhoneCodeRequest,
): Promise<SendPhoneCodeResponse> {
  await delay(700);
  // eslint-disable-next-line no-console
  console.info(
    `[mock auth] ${payload.phone} uchun tasdiqlash kodi: ${MOCK_OTP_CODE}`,
  );
  return { expiresIn: MOCK_OTP_TTL_SEC };
}

export async function mockVerifyPhoneCode(
  payload: VerifyPhoneCodeRequest,
): Promise<AuthResponse> {
  await delay(700);
  if (payload.code !== MOCK_OTP_CODE) {
    throw new Error("Tasdiqlash kodi noto'g'ri");
  }
  return { token: "mock-web-token", user: MOCK_USER };
}
