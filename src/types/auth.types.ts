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

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    role: string;
  };
}
