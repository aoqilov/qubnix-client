import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { RoleGate } from "@/components/shared/role-gate/RoleGate";
import { useRenameOrganization } from "@/components/shared/settings/general/hooks/useApiSettingsGeneral";
import { MOCK_PRO_STATUS } from "@/components/shared/settings/general/lib/mockGeneralSettings";
import { WORKSPACE_ROLES } from "@/const/roles";
import { useSelectedOrganization, type SettingsWorkspace } from "@/hooks/useApiSettings";
import { useWorkspaceStore } from "@/store/workspace.store";
import { daysLabel } from "@/utils/countLabels";
import { SettingsSectionHeader } from "@/widgets/features/desktop/settings/components/SettingsSectionHeader";

const CARD_STYLE = { borderColor: "var(--border-subtle)" };

// `key={organization.id}` bilan mount qilinadi — local state faqat tashkilot almashganda
// qayta boshlanadi, fon so'rovlarda input serverdagi qiymatga qaytib ketmaydi (mobile bilan bir xil).
function WorkspaceNameField({ organization }: { organization: SettingsWorkspace }) {
  const { t } = useTranslation();
  const renameOrganization = useRenameOrganization();
  const [workspaceName, setWorkspaceName] = useState(organization.name);

  const trimmedName = workspaceName.trim();
  const isDirty = trimmedName.length > 0 && trimmedName !== organization.name;

  return (
    <CusCardbox className="flex flex-col gap-3 rounded-card bg-surface" style={CARD_STYLE}>
      <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
        {t("settings.general.orgName")}
      </span>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <CusInput value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
        </div>
        <CusButton
          isDisabled={!isDirty}
          isLoading={renameOrganization.isPending}
          onClick={() => renameOrganization.mutate(trimmedName)}
          style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
        >
          {t("common.actions.save")}
        </CusButton>
      </div>
    </CusCardbox>
  );
}

export default function FeatureSettingsGeneral() {
  const { t } = useTranslation();
  const organizationQuery = useSelectedOrganization();
  const ownerRoles = organizationQuery.data ? [organizationQuery.data.role] : [];
  // Personal workspace'da obuna (PRO) bo'limi ko'rsatilmaydi.
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionHeader title={t("settings.menu.general")} subtitle={organizationQuery.data?.name} />

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <RoleGate roles={ownerRoles} allow={[WORKSPACE_ROLES.OWNER]}>
          {organizationQuery.data ? (
            <WorkspaceNameField key={organizationQuery.data.id} organization={organizationQuery.data} />
          ) : (
            <div className="h-[106px] animate-pulse rounded-card border border-subtle bg-surface" />
          )}
        </RoleGate>

        {!isPersonal && (
          <CusCardbox className="flex flex-col gap-3 rounded-card bg-surface" style={CARD_STYLE}>
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
              <div className="h-full rounded-full bg-brand" style={{ width: `${MOCK_PRO_STATUS.percent}%` }} />
            </div>

            {/* Tarif uzaytirish oqimi hali ulanmagan — mobile'dagi kabi tugma ishlamaydi. */}
            <RoleGate roles={ownerRoles} allow={[WORKSPACE_ROLES.OWNER]}>
              <div>
                <CusButton style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}>
                  {t("settings.general.extend")}
                </CusButton>
              </div>
            </RoleGate>
          </CusCardbox>
        )}
      </div>
    </div>
  );
}
