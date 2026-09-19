import type React from "react";
import { CusCheckbox } from "@/components/ui/inputs/CusCheckbox";
import type { MemberPickerItem } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import type { ProjectMemberRole } from "../types";

// Rangni className orqali emas, style orqali beramiz — Chakra provayder
// ostida raw <button>'larga bg-*/text-* util sinflari ba'zan bosilmay qoladi,
// inline style esa har doim aniq qiymatni beradi.
const baseStyle: React.CSSProperties = {
  borderRadius: "5px",
  padding: "2px 6px",
  fontSize: "10px",
  fontWeight: 600,
  border: "1px solid var(--border-default)",
  background: "var(--bg-surface)",
  color: "var(--text-secondary)",
};

const activeStyle: React.CSSProperties = {
  ...baseStyle,
  border: "1px solid var(--brand-default)",
  background: "var(--brand-default)",
  color: "var(--text-on-brand)",
};

export function RoleToggle({
  value,
  onChange,
}: {
  value: ProjectMemberRole;
  onChange: (role: ProjectMemberRole) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("project_member")}
        style={value === "project_member" ? activeStyle : baseStyle}
      >
        Xodim
      </button>
      <button
        type="button"
        onClick={() => onChange("project_manager")}
        style={value === "project_manager" ? activeStyle : baseStyle}
      >
        Manager
      </button>
    </div>
  );
}

interface ProjectMemberSelectListProps {
  members: MemberPickerItem[];
  selections: Record<string, ProjectMemberRole>;
  onToggle: (id: string) => void;
  onRoleChange: (id: string, role: ProjectMemberRole) => void;
}

export function ProjectMemberSelectList({
  members,
  selections,
  onToggle,
  onRoleChange,
}: ProjectMemberSelectListProps) {
  return (
    <div className="flex flex-col">
      {members.map((member) => {
        const isSelected = member.id in selections;
        return (
          <div
            key={member.id}
            className="flex w-full items-center gap-3 border-b border-subtle py-3 last:border-b-0"
          >
            {/* CusCheckbox ichidagi Field.Root width:100% oladi va butun
            qatorni egallab, ism matnini siqib chiqarardi — flex-none wrapper
            bilan tuzatiladi (CusSwitch'da ham xuddi shu muammo bor edi). */}
            <div className="flex-none">
              <CusCheckbox checked={isSelected} onChange={() => onToggle(member.id)} />
            </div>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
              {member.name}
            </span>
            {isSelected && (
              <RoleToggle
                value={selections[member.id]}
                onChange={(role) => onRoleChange(member.id, role)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
