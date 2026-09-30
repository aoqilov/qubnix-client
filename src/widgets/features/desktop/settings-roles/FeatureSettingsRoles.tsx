import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import {
  buildOrganizationRoleItems,
  buildProjectRoleItems,
} from "@/components/shared/settings/roles/lib/rolesData";
import { SettingsSectionHeader } from "@/widgets/features/desktop/settings/components/SettingsSectionHeader";

type RoleScope = "organization" | "project";

export default function FeatureSettingsRoles() {
  const { t } = useTranslation();
  const [scope, setScope] = useState<RoleScope>("organization");
  // Mobil'da accordion — desktop'da joy yetadi, har bir rol ochiq karta bo'lib turadi.
  const roles = scope === "organization" ? buildOrganizationRoleItems(t) : buildProjectRoleItems(t);

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionHeader title={t("roles.title")} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <CusSegment
          layout="inline"
          value={scope}
          onValueChange={(v) => setScope(v as RoleScope)}
          items={[
            { id: "organization", label: t("roles.scope.organization") },
            { id: "project", label: t("roles.scope.project") },
          ]}
        />
        <p className="text-xs text-secondary">{t("roles.combineHint")}</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-2">
        {roles.map((role) => (
          <CusCardbox
            key={role.value}
            className="flex flex-col gap-3 rounded-card bg-surface"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 flex-none items-center justify-center rounded-input bg-brand-subtle text-brand">
                {role.icon}
              </span>
              <span className="min-w-0 flex-1 truncate text-base font-semibold text-primary">{role.title}</span>
              {role.badge}
            </div>
            {role.content}
          </CusCardbox>
        ))}
      </div>
    </div>
  );
}
