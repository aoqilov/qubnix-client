import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications/notifications.api";
import type {
  NotificationSettings,
  UpdateNotificationSettingsRequest,
} from "@/api/notifications/notifications.types";

export const NOTIFICATION_KEYS = {
  settings: (organizationId: string) =>
    ["organizations", organizationId, "notification-settings"] as const,
};

/** Joriy foydalanuvchining shu tashkilotdagi bildirishnoma sozlamalari. */
export function useNotificationSettings(organizationId: string | null) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.settings(organizationId ?? ""),
    queryFn: () => notificationsApi.getSettings(organizationId!),
    enabled: !!organizationId,
  });
}

/**
 * Switch bosilgan zahoti yangi qiymat ko'rsatiladi (optimistic), so'rov xato
 * bersa oldingi holatga qaytariladi.
 */
export function useUpdateNotificationSettings(organizationId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = NOTIFICATION_KEYS.settings(organizationId ?? "");

  return useMutation({
    mutationFn: (payload: UpdateNotificationSettingsRequest) =>
      notificationsApi.updateSettings(organizationId!, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<NotificationSettings>(queryKey);
      if (previous) queryClient.setQueryData(queryKey, { ...previous, ...payload });
      return { previous };
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKey, settings);
    },
  });
}
