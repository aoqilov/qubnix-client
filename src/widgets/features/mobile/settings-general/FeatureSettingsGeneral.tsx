import { useState } from "react";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import {
  MOCK_PRO_STATUS,
  MOCK_WORKSPACE_DISPLAY_NAME,
  MOCK_WORKSPACE_NAME,
} from "./lib/mockGeneralSettings";

export default function FeatureSettingsGeneral() {
  const [workspaceName, setWorkspaceName] = useState(MOCK_WORKSPACE_DISPLAY_NAME);

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title="Общие настройки" />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {MOCK_WORKSPACE_NAME.toUpperCase()}
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-secondary">
          Название workspace
        </span>
        <CusInput value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
      </div>

      <CusCardbox className="flex flex-col gap-3 rounded-input">
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-primary">PRO режим</span>
          <CusBadge tone="success">Активно</CusBadge>
        </div>

        <span className="text-sm text-secondary">
          Осталось {MOCK_PRO_STATUS.daysLeft} дней - до {MOCK_PRO_STATUS.untilDate}
        </span>

        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${MOCK_PRO_STATUS.percent}%` }}
          />
        </div>

        <CusButton
          className="w-full"
          size="lg"
          rounded="9999px"
          style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
        >
          Продлить подписку
        </CusButton>
      </CusCardbox>
    </div>
  );
}
