import type { SessionUser } from "@/store/session.store";

export interface AuthByTelegramInitDataRequest {
  initData: string;
}

export interface TelegramLoginWidgetPayload {
  id: number;
  first_name: string;
  username?: string;
  auth_date: number;
  hash: string;
}

// Telefon + SMS-siz OTP: kod foydalanuvchiga Telegram bot orqali yuboriladi.
export interface RequestPhoneCodeRequest {
  /** E.164 formatda: +998901234567 */
  phone: string;
}

export interface RequestPhoneCodeResponse {
  /** 2-qadamda kerak — verify-code so'roviga shu token yuboriladi (telefon emas). */
  verificationToken: string;
  /** Kod necha sekunddan keyin eskiradi (timer shu qiymatdan boshlanadi). */
  expiresIn: number;
  /** Qayta yuborish so'rovi shundan keyin ruxsat etiladi (backend: 60s). */
  retryAfter: number;
}

export interface VerifyPhoneCodeRequest {
  verificationToken: string;
  /** 6 xonali raqam — yetakchi nollar ham bo'lishi mumkin, shuning uchun string. */
  code: string;
}

export interface VerifyPhoneCodeResponse {
  /** Sessiya token o'rniga shu — interceptor har so'rovga `initdata` header sifatida qo'shadi. */
  initData: string;
}

export interface AuthResponse {
  token: string;
  user: SessionUser;
}
