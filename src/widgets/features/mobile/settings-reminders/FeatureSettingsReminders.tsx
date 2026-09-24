import { useSelectedOrganization } from "@/widgets/features/mobile/settings/hooks/useApiSettings";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { MOCK_REMINDERS } from "./lib/mockReminders";

export default function FeatureSettingsReminders() {
  const { t } = useTranslation();
  // Sarlavhadagi nom — mock "Synapse" emas, haqiqiy tanlangan tashkilot.
  const organizationQuery = useSelectedOrganization();
  const [reminders, setReminders] = useState(MOCK_REMINDERS);

  const toggleReminder = (id: string, enabled: boolean) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, enabled } : reminder)),
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title={t("settings.menu.reminders")} />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {(organizationQuery.data?.name ?? "").toUpperCase()}
      </p>

      <CusCardbox className="rounded-input p-0">
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
