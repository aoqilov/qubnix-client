import { useSelectedOrganization } from "@/hooks/useApiSettings";
import { useTranslation } from "react-i18next";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { NotificationSettingsList } from "@/components/shared/notification-settings/NotificationSettingsList";
import { useIsViewer } from "@/hooks/useIsViewer";

// Admin/owner — barcha bildirishnoma turlari.
const ALL_NOTIFICATIONS = ["new_task", "deadline_10_min", "task_completed", "task_overdue"] as const;

export default function FeatureSettingsReminders() {
  const { t } = useTranslation();
  const organizationQuery = useSelectedOrganization();
  // Viewer sozlamalarni ko'radi, lekin o'zgartira olmaydi.
  const isViewer = useIsViewer();

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title={t("settings.menu.reminders")} />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {(organizationQuery.data?.name ?? "").toUpperCase()}
      </p>

      <NotificationSettingsList items={ALL_NOTIFICATIONS} disabled={isViewer} />
    </div>
  );
}
