import { useTranslation } from "react-i18next";
import { NotificationSettingsList } from "@/components/shared/notification-settings/NotificationSettingsList";
import { useSelectedOrganization } from "@/hooks/useApiSettings";
import { useIsViewer } from "@/hooks/useIsViewer";
import { SettingsSectionHeader } from "@/widgets/features/desktop/settings/components/SettingsSectionHeader";

// Admin/owner — barcha bildirishnoma turlari.
const ALL_NOTIFICATIONS = ["new_task", "deadline_10_min", "task_completed", "task_overdue"] as const;

export default function FeatureSettingsReminders() {
  const { t } = useTranslation();
  const organizationQuery = useSelectedOrganization();
  // Viewer sozlamalarni ko'radi, lekin o'zgartira olmaydi.
  const isViewer = useIsViewer();

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionHeader title={t("settings.menu.reminders")} subtitle={organizationQuery.data?.name} />

      <div className="max-w-2xl">
        <NotificationSettingsList items={ALL_NOTIFICATIONS} disabled={isViewer} />
      </div>
    </div>
  );
}
