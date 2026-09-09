import { axiosInstance } from "@/api-config/axiosInstance";
import type { Notification } from "@/types/notification.types";
import type { Paginated } from "@/types/common.types";

export const notificationsApi = {
  list: () => axiosInstance.get<Paginated<Notification>>("/notifications").then((r) => r.data),
  markAsRead: (id: string) =>
    axiosInstance.patch<Notification>(`/notifications/${id}/read`).then((r) => r.data),
};
