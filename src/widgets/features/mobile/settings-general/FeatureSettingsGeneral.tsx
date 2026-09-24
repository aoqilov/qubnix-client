import { daysLabel } from "@/utils/countLabels";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
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
import { RoleGate } from "@/components/shared/role-gate/RoleGate";
import { WORKSPACE_ROLES } from "@/const/roles";

// `key={organization.id}` bilan mount qilinadi (pastga qarang) — shu sabab local
// state faqat tashkilot ALMASHGANDA qayta boshlanadi, har qanday qayta-render yoki
// fon so'rovda emas (useEffect-based sinxronlash query obyekti yangi reference
// bergan har safar inputni serverdagi qiymatga qaytarib yuborar edi).
function WorkspaceNameField({ organization }: { organization: SettingsWorkspace }) {
  const { t } = useTranslation();
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
        {t("settings.general.orgName")}
      </span>
      <div className="flex items-center gap-2 rounded-input border border-subtle bg-surface px-3 py-2">
        <CusInput value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
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
  const { t } = useTranslation();
  const organizationQuery = useSelectedOrganization();
  const ownerRoles = organizationQuery.data ? [organizationQuery.data.role] : [];
  // Personal workspace'da obuna (PRO) bo'limi ko'rsatilmaydi.
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title={t("settings.menu.general")} />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {(organizationQuery.data?.name ?? "").toUpperCase()}
      </p>

      <RoleGate roles={ownerRoles} allow={[WORKSPACE_ROLES.OWNER]}>
        {organizationQuery.data ? (
          <WorkspaceNameField
            key={organizationQuery.data.id}
            organization={organizationQuery.data}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-secondary">
              {t("settings.general.orgName")}
            </span>
            <CusInput value="" disabled placeholder={t("common.states.loading")} />
          </div>
        )}
      </RoleGate>

      {!isPersonal && (
        <CusCardbox className="flex flex-col gap-3 rounded-input">
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-semibold text-primary">{t("settings.general.proMode")}</span>
            <CusBadge tone="success">{t("settings.general.active")}</CusBadge>
          </div>

          <span className="text-sm text-secondary">
            {t("settings.general.remaining", {
              label: daysLabel(MOCK_PRO_STATUS.daysLeft),
              date: MOCK_PRO_STATUS.untilDate,
            })}
          </span>

          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${MOCK_PRO_STATUS.percent}%` }}
            />
          </div>

          <RoleGate roles={ownerRoles} allow={[WORKSPACE_ROLES.OWNER]}>
            <CusButton
              className="w-full"
              size="lg"
              rounded="9999px"
              style={{
                background: "var(--brand-default)",
                color: "var(--text-on-brand)",
              }}
            >
              {t("settings.general.extend")}
            </CusButton>
          </RoleGate>
        </CusCardbox>
      )}
    </div>
  );
}
