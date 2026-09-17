import type { SessionUser } from "@/store/session.store";

export interface TelegramLoginWidgetPayload {
  id: number;
  first_name: string;
  username?: string;
  auth_date: number;
  hash: string;
}

export interface RequestPhoneCodeRequest {
  phone: string;
}

export interface RequestPhoneCodeResponse {
  verificationToken: string;
  expiresIn: number;
  retryAfter: number;
}

export interface VerifyPhoneCodeRequest {
  verificationToken: string;
  code: string;
}

export interface VerifyPhoneCodeResponse {
  initData: string;
}

export interface AuthResponse {
  token: string;
  user: SessionUser;
}

export interface LogoutResponse {
  loggedOut: boolean;
}
