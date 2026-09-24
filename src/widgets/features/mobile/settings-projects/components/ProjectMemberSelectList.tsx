import { useTranslation } from "react-i18next";
import { projectRoleLabel } from "@/utils/roleLabels";
import { forwardRef } from "react";
import type React from "react";
import { LuChevronDown } from "react-icons/lu";
import { CusCheckbox } from "@/components/ui/inputs/CusCheckbox";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import type { MemberPickerItem } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import type { ProjectMemberRole } from "../types";


// CusMenuList'ning Menu.Trigger asChild'i trigger DOM node'iga pozitsiya
// hisoblash uchun o'z proplarini beradi — CusButton esa faqat o'zi bilgan
// nomlangan proplarni forward qiladi, qolganini yutib yuboradi, shu sabab
// menyu har doim (0,0)da chiqib qolardi. Shuning uchun bu yerda ...propsni
// to'liq spread qiladigan oddiy <button> ishlatiladi.
const RoleTriggerButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }
>(function RoleTriggerButton({ label, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className="flex flex-none items-center gap-1 rounded-input border border-default bg-surface px-2 py-1 text-xs font-semibold text-primary hover:bg-surface-secondary"
    >
      {label}
      <LuChevronDown size={12} className="flex-none text-secondary" />
    </button>
  );
});

export function RoleDropdown({
  value,
  onChange,
}: {
  value: ProjectMemberRole;
  onChange: (role: ProjectMemberRole) => void;
}) {
  useTranslation(); // til almashsa rol nomlari qayta hisoblanadi
  return (
    <CusMenuList
      value={value}
      onValueChange={(v) => onChange(v as ProjectMemberRole)}
      items={[
        { value: "project_member", label: projectRoleLabel("project_member") },
        { value: "project_manager", label: projectRoleLabel("project_manager") },
      ]}
      width={140}
      trigger={<RoleTriggerButton label={projectRoleLabel(value)} />}
    />
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
              <RoleDropdown
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
