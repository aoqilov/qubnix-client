import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { useSelectedOrganization } from "@/widgets/features/mobile/settings/hooks/useApiSettings";
import type { SettingsWorkspace } from "@/widgets/features/mobile/settings/hooks/useApiSettings";
import { useRenameOrganization } from "./hooks/useApiSettingsGeneral";
import { MOCK_PRO_STATUS } from "./lib/mockGeneralSettings";

// `key={organization.id}` bilan mount qilinadi (pastga qarang) — shu sabab local
// state faqat tashkilot ALMASHGANDA qayta boshlanadi, har qanday qayta-render yoki
// fon so'rovda emas (useEffect-based sinxronlash query obyekti yangi reference
// bergan har safar inputni serverdagi qiymatga qaytarib yuborar edi).
function WorkspaceNameField({
  organization,
}: {
  organization: SettingsWorkspace;
}) {
  const renameOrganization = useRenameOrganization();
  const [workspaceName, setWorkspaceName] = useState(organization.name);

  const trimmedName = workspaceName.trim();
  const isDirty = trimmedName.length > 0 && trimmedName !== organization.name;

  const handleSave = () => {
    if (!isDirty) return;
    renameOrganization.mutate(trimmedName);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-secondary">
        Название организации
      </span>
      <div className="flex items-center gap-2 rounded-input border border-subtle bg-surface px-3 py-2">
        <CusInput
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
        {isDirty && (
          <div
            onClick={handleSave}
            className="flex items-center gap-1 text-sm font-semibold bg-brand p-2 rounded-md"
          >
            <LuCheck size={14} color="white" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeatureSettingsGeneral() {
  const organizationQuery = useSelectedOrganization();

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title="Общие настройки" />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {(organizationQuery.data?.name ?? "").toUpperCase()}
      </p>

      {organizationQuery.data ? (
        <WorkspaceNameField
          key={organizationQuery.data.id}
          organization={organizationQuery.data}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-secondary">
            Название организации
          </span>
          <CusInput value="" disabled placeholder="Yuklanmoqda..." />
        </div>
      )}

      <CusCardbox className="flex flex-col gap-3 rounded-input">
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-primary">
            PRO режим
          </span>
          <CusBadge tone="success">Активно</CusBadge>
        </div>

        <span className="text-sm text-secondary">
          Осталось {MOCK_PRO_STATUS.daysLeft} дней - до{" "}
          {MOCK_PRO_STATUS.untilDate}
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
          style={{
            background: "var(--brand-default)",
            color: "var(--text-on-brand)",
          }}
        >
          Продлить подписку
        </CusButton>
      </CusCardbox>
    </div>
  );
}
