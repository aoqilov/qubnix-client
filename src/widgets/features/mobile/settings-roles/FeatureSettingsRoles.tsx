import { useState } from "react";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusAccordion } from "@/components/ui/accordion/CusAccordion";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { ORGANIZATION_ROLE_ITEMS, PROJECT_ROLE_ITEMS } from "./lib/rolesData";

type RoleScope = "organization" | "project";

export default function FeatureSettingsRoles() {
  const [scope, setScope] = useState<RoleScope>("organization");

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title="Роли" />

      <CusSegment
        value={scope}
        onValueChange={(v) => setScope(v as RoleScope)}
        items={[
          { id: "organization", label: "Организация" },
          { id: "project", label: "Проект" },
        ]}
      />

      <CusAccordion
        key={scope}
        items={scope === "organization" ? ORGANIZATION_ROLE_ITEMS : PROJECT_ROLE_ITEMS}
      />
    </div>
  );
}
