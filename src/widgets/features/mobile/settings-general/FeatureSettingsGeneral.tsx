import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { LuCheck } from "react-icons/lu";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { useSelectedOrganization } from "@/hooks/useApiSettings";
import type { SettingsWorkspace } from "@/hooks/useApiSettings";
import { useRenameOrganization } from "@/components/shared/settings/general/hooks/useApiSettingsGeneral";
import { OrgSubscriptionCard } from "@/components/shared/settings/general/OrgSubscriptionCard";
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

      {!isPersonal && organizationQuery.data && (
        <OrgSubscriptionCard key={organizationQuery.data.id} organization={organizationQuery.data} />
      )}
    </div>
  );
}
