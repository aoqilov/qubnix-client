import { axiosInstance } from "@/api-config/axiosInstance";
import type {
  AuthByTelegramInitDataRequest,
  AuthResponse,
  TelegramLoginWidgetPayload,
} from "@/types/auth.types";

export const authApi = {
  byTelegramInitData: (payload: AuthByTelegramInitDataRequest) =>
    axiosInstance.post<AuthResponse>("/auth/telegram", payload).then((r) => r.data),

  byTelegramWidget: (payload: TelegramLoginWidgetPayload) =>
    axiosInstance.post<AuthResponse>("/auth/telegram-widget", payload).then((r) => r.data),

  me: () => axiosInstance.get<AuthResponse["user"]>("/auth/me").then((r) => r.data),
};
