import { api } from "@/api-config/axiosInstance";
import type { RawUser } from "@/api/users/users.types";
import type { SessionUser } from "@/store/session.store";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

function toSessionUser(raw: RawUser): SessionUser {
  const qubnixName = [raw.first_name, raw.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const telegramName = [raw.telegram_first_name, raw.telegram_last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: raw.id,
    fullName: qubnixName || telegramName || raw.telegram_username,
    avatarUrl: raw.telegram_avatar_url || undefined,
  };
}

export const usersApi = {
  /** Telegram initdata yoki qubnix_session cookie orqali joriy foydalanuvchini oladi. */
  me: () =>
    api
      .get<ApiEnvelope<{ user: RawUser }>>("/api/v1/users/me")
      .then((r) => toSessionUser(r.data.data.user)),
};
