import { api } from "@/api-config/axiosInstance";
import type {
  NotificationSettings,
  UpdateNotificationSettingsRequest,
} from "@/api/notifications/notifications.types";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

export const notificationsApi = {
  /** Joriy foydalanuvchining shu tashkilotdagi bildirishnoma sozlamalari. */
  getSettings: (organizationID: string) =>
    api
      .get<
        ApiEnvelope<{ settings: NotificationSettings }>
      >(`/api/v1/organizations/${organizationID}/notification-settings`)
      .then((r) => r.data.data.settings),

  /** Yangilangan to'liq sozlamalarni qaytaradi. */
  updateSettings: (organizationID: string, payload: UpdateNotificationSettingsRequest) =>
    api
      .patch<
        ApiEnvelope<{ settings: NotificationSettings }>
      >(`/api/v1/organizations/${organizationID}/notification-settings`, { data: payload })
      .then((r) => r.data.data.settings),
};
