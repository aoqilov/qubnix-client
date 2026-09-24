import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";

interface MemberReminderItem {
  id: string;
  /** settings.memberReminders.* kalitlari — matn render paytida olinadi. */
  titleKey: "settings.memberReminders.deadline" | "settings.memberReminders.newTask";
  descriptionKey: "settings.memberReminders.deadlineHint" | "settings.memberReminders.newTaskHint";
  enabled: boolean;
}

// Hali real API ulanmagan — endpoint tayyor bo'lgach shu massiv backend so'roviga almashtiriladi.
const MOCK_MEMBER_REMINDERS: MemberReminderItem[] = [
  {
    id: "task-deadline-10min",
    titleKey: "settings.memberReminders.deadline",
    descriptionKey: "settings.memberReminders.deadlineHint",
    enabled: true,
  },
  {
    id: "new-task",
    titleKey: "settings.memberReminders.newTask",
    descriptionKey: "settings.memberReminders.newTaskHint",
    enabled: true,
  },
];

/** Oddiy a'zo (member) uchun shaxsiy bildirishnoma sozlamalari. */
export function MemberReminderSettings() {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState(MOCK_MEMBER_REMINDERS);

  const toggleReminder = (id: string, enabled: boolean) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, enabled } : reminder)),
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold tracking-wide text-secondary">
        {t("settings.memberReminders.title")}
      </div>

      <CusCardbox className="flex flex-col rounded-card" style={{ padding: 0 }}>
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex w-full items-center justify-between gap-2 border-b border-subtle p-4 last:border-b-0"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-primary">
                {t(reminder.titleKey)}
              </span>
              <span className="truncate text-xs font-medium text-secondary">
                {t(reminder.descriptionKey)}
              </span>
            </div>
            <div className="flex-none">
              <CusSwitch
                checked={reminder.enabled}
                onCheckedChange={(checked) => toggleReminder(reminder.id, checked)}
              />
            </div>
          </div>
        ))}
      </CusCardbox>
    </div>
  );
}
