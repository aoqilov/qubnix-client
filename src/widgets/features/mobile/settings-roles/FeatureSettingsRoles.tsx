import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusAccordion } from "@/components/ui/accordion/CusAccordion";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { buildOrganizationRoleItems, buildProjectRoleItems } from "./lib/rolesData";

type RoleScope = "organization" | "project";

export default function FeatureSettingsRoles() {
  const { t } = useTranslation();
  const [scope, setScope] = useState<RoleScope>("organization");

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title={t("roles.title")} />

      <CusSegment
        value={scope}
        onValueChange={(v) => setScope(v as RoleScope)}
        items={[
          { id: "organization", label: t("roles.scope.organization") },
          { id: "project", label: t("roles.scope.project") },
        ]}
      />

      <CusAccordion
        key={scope}
        items={scope === "organization" ? buildOrganizationRoleItems(t) : buildProjectRoleItems(t)}
      />
    </div>
  );
}
