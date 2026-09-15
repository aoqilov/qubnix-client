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
export interface SendPhoneCodeRequest {
  /** E.164 formatda: +998901234567 */
  phone: string;
}

export interface SendPhoneCodeResponse {
  /** Kod necha sekunddan keyin eskiradi (timer shu qiymatdan boshlanadi). */
  expiresIn: number;
}

export interface VerifyPhoneCodeRequest {
  phone: string;
  /** 6 xonali raqam. */
  code: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    role: string;
  };
}
