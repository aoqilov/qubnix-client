import { axiosInstance } from "@/api-config/axiosInstance";
import type {
  AuthByTelegramInitDataRequest,
  AuthResponse,
  RequestPhoneCodeRequest,
  RequestPhoneCodeResponse,
  TelegramLoginWidgetPayload,
  VerifyPhoneCodeRequest,
  VerifyPhoneCodeResponse,
} from "@/types/auth.types";

// Backend hamma javobni shu qobiq ichida qaytaradi.
interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

export const authApi = {
  byTelegramInitData: (payload: AuthByTelegramInitDataRequest) =>
    axiosInstance
      .post<AuthResponse>("/auth/telegram", payload)
      .then((r) => r.data),

  byTelegramWidget: (payload: TelegramLoginWidgetPayload) =>
    axiosInstance
      .post<AuthResponse>("/auth/telegram-widget", payload)
      .then((r) => r.data),

  /** 1-qadam: raqamga tasdiqlash kodi yuborish (kod Telegram bot orqali keladi). */
  requestPhoneCode: (payload: RequestPhoneCodeRequest) =>
    axiosInstance
      .post<
        ApiEnvelope<{
          verification_token: string;
          expires_in: number;
          retry_after: number;
          message: string;
        }>
      >("/api/v1/auth/request-code", { data: { phone_number: payload.phone } })
      .then(
        (r): RequestPhoneCodeResponse => ({
          verificationToken: r.data.data.verification_token,
          expiresIn: r.data.data.expires_in,
          retryAfter: r.data.data.retry_after,
        }),
      ),

  /** 2-qadam: kodni tekshirish — muvaffaqiyatli bo'lsa init_data qaytadi. */
  verifyPhoneCode: (payload: VerifyPhoneCodeRequest) =>
    axiosInstance
      .post<ApiEnvelope<{ init_data: string }>>("/api/v1/auth/verify-code", {
        data: {
          verification_token: payload.verificationToken,
          code: payload.code,
        },
      })
      .then(
        (r): VerifyPhoneCodeResponse => ({ initData: r.data.data.init_data }),
      ),
};

// Auth qanday ishlaydi (hozirgi holat)
// 1. Ilova ochilganda — kim ekanligini aniqlash
// main.tsx React chizishdan oldin enterWay()ni chaqiradi, u ikkiga bo'linadi:

// Telegram Mini App bo'lsa:

// Telegram SDK beradigan xom initDatani oladi (window.Telegram.WebApp.initData).
// Shuni darhol session'ga yozadi.
// GET /api/v1/users/me chaqiradi — bu so'rovga initdata header avtomatik qo'shiladi.
// Muvaffaqiyatli bo'lsa — foydalanuvchi tayyor, ilova ochiladi. Bo'lmasa — "unauthenticated".
// Oddiy brauzer (web) bo'lsa:

// Hech narsa tekshirmasdan to'g'ridan-to'g'ri GET /api/v1/users/me chaqiradi.
// Bu so'rov initdata header'siz ketadi — o'rniga brauzerning o'zi avval saqlangan qubnix_session cookie'ni avtomatik biriktiradi (withCredentials: true shuning uchun kerak).
// Cookie bor va yaroqli bo'lsa — 200, ilova ochiladi. Cookie yo'q/eskirgan bo'lsa — 401, /loginga tushadi.
// 2. /login sahifasi — faqat web uchun (2 qadam)
// Telefon kiritiladi → POST /api/v1/auth/request-code → javobda verification_token keladi, u vaqtincha (faqat xotirada) saqlanadi.
// Telegram bot orqali kelgan kod kiritiladi → POST /api/v1/auth/verify-code (verification_token + kod) → muvaffaqiyatli bo'lsa backend o'zi qubnix_session cookie'ni o'rnatadi (biz hech narsa saqlamaymiz).
// Shundan keyin darhol GET /api/v1/users/me chaqiriladi (endi cookie bilan) — foydalanuvchi ma'lumoti olinadi va sessiya "authenticated" bo'ladi.
// 3. Har bir API so'rovda avtomatik ishlaydigan narsalar
// Telegram: initdata: <xom initData> header qo'shiladi (interceptors.ts).
// Web: hech qanday maxsus header — faqat qubnix_session cookie (brauzer o'zi yuboradi).
// Har ikkalasida ham javob 401 kelsa — sessiya avtomatik tozalanadi (clearSession).
// Muhim tushuncha
// Web va Telegram — ikki mustaqil "kalit" turi: Telegram uchun header (har safar yangi, saqlanmaydi), web uchun cookie (backend boshqaradi, brauzer o'zi eslab qoladi). Bizning frontend kodimiz endi token/init_data'ni localStorageda alohida saqlamaydi — bu ishni butunlay backend + brauzer cookie mexanizmi qiladi.
