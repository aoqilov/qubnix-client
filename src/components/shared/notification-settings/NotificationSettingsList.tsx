import { useTranslation } from "react-i18next";
import { LuTriangleAlert } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";
import { useWorkspaceStore } from "@/store/workspace.store";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/hooks/useNotificationSettings";
import type { NotificationSettings } from "@/api/notifications/notifications.types";

export type NotificationSettingKey = keyof NotificationSettings;

// Matn kalitlari — render paytida t() orqali olinadi, til almashsa yangilanadi.
const LABEL_KEYS = {
  new_task: { titleKey: "settings.reminders.newTask", hintKey: "settings.reminders.newTaskHint" },
  deadline_10_min: { titleKey: "settings.reminders.deadline", hintKey: "settings.reminders.deadlineHint" },
  task_completed: {
    titleKey: "settings.reminders.taskCompleted",
    hintKey: "settings.reminders.taskCompletedHint",
  },
  task_overdue: { titleKey: "settings.reminders.taskOverdue", hintKey: "settings.reminders.taskOverdueHint" },
} as const satisfies Record<NotificationSettingKey, { titleKey: string; hintKey: string }>;

interface NotificationSettingsListProps {
  /** Qaysi sozlamalar va qaysi tartibda ko'rsatiladi. */
  items: readonly NotificationSettingKey[];
  /** Switch'lar bosilmaydi (masalan viewer uchun). */
  disabled?: boolean;
}

/** Joriy tashkilotdagi bildirishnoma sozlamalari — har biri switch bilan, darhol saqlanadi. */
export function NotificationSettingsList({ items, disabled = false }: NotificationSettingsListProps) {
  const { t } = useTranslation();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const settingsQuery = useNotificationSettings(organizationId);
  const updateSettings = useUpdateNotificationSettings(organizationId);

  if (settingsQuery.isPending) {
    return <div className="animate-pulse rounded-card bg-surface-secondary" style={{ height: items.length * 69 }} />;
  }

  if (settingsQuery.isError) {
    return <p className="px-1 text-sm text-error-strong">{t("settings.reminders.loadError")}</p>;
  }

  const settings = settingsQuery.data;

  return (
    <div className="flex flex-col gap-2">
      <CusCardbox className="flex flex-col rounded-card" style={{ padding: 0 }}>
        {items.map((key) => (
          <div
            key={key}
            className="flex w-full items-center justify-between gap-2 border-b border-subtle p-4 last:border-b-0"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-primary">
                {t(LABEL_KEYS[key].titleKey)}
              </span>
              <span className="truncate text-xs font-medium text-secondary">
                {t(LABEL_KEYS[key].hintKey)}
              </span>
            </div>
            <div className="flex-none">
              <CusSwitch
                checked={settings[key]}
                onCheckedChange={(checked) => updateSettings.mutate({ [key]: checked })}
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </CusCardbox>

      {updateSettings.isError && (
        <p className="flex items-center gap-1.5 px-1 text-xs text-error-strong">
          <LuTriangleAlert size={12} className="flex-none" />
          {getApiErrorMessage(updateSettings.error)}
        </p>
      )}
    </div>
  );
}
