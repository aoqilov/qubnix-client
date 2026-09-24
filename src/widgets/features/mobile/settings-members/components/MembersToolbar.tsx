import i18n from "@/i18n";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";
import type React from "react";
import { LuSearch, LuFilter, LuLayoutGrid, LuList } from "react-icons/lu";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import { organizationRoleLabel } from "@/utils/roleLabels";
import type { MemberViewStyle } from "../hooks/useMemberViewStyle";
import type { MemberRoleFilter } from "../lib/mockMembers";

// Matnlar render paytida olinadi — til almashsa yangilanadi.
const buildViewStyleItems = () => [
  { value: "list", label: i18n.t("members.toolbar.list"), icon: <LuList size={14} /> },
  { value: "card", label: i18n.t("members.toolbar.cards"), icon: <LuLayoutGrid size={14} /> },
];

const buildRoleFilterItems = () => [
  { value: "all", label: i18n.t("members.toolbar.allRoles") },
  { value: "admin", label: organizationRoleLabel("admin") },
  { value: "member", label: organizationRoleLabel("member") },
  { value: "viewer", label: organizationRoleLabel("viewer") },
];

const iconButtonStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "var(--radius-input)",
  border: "1px solid var(--border-default)",
  background: "var(--bg-surface)",
};

// CusMenuList'ning Menu.Trigger asChild'i trigger DOM node'iga pozitsiya
// hisoblash uchun o'z proplarini beradi — CusButton esa faqat o'zi bilgan
// nomlangan proplarni forward qiladi, qolganini yutib yuboradi, shu sabab
// menyu har doim (0,0)da chiqib qolardi. Shuning uchun bu yerda ...propsni
// to'liq spread qiladigan oddiy <button> ishlatiladi (CusMenuList'ning o'z
// ishlatish namunasidagi TriggerButton bilan bir xil yondashuv).
const IconTriggerButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode }
>(function IconTriggerButton({ icon, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className="flex flex-none items-center justify-center self-stretch text-secondary hover:bg-surface-secondary"
      style={iconButtonStyle}
    >
      {icon}
    </button>
  );
});

interface MembersToolbarProps {
  value: string;
  onValueChange: (value: string) => void;
  viewStyle: MemberViewStyle;
  onViewStyleChange: (style: MemberViewStyle) => void;
  roleFilter: MemberRoleFilter;
  onRoleFilterChange: (role: MemberRoleFilter) => void;
}

export function MembersToolbar({
  value,
  onValueChange,
  viewStyle,
  onViewStyleChange,
  roleFilter,
  onRoleFilterChange,
}: MembersToolbarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <CusInput
        placeholder={t("members.toolbar.search")}
        clearable
        leftElementWidth="2.25rem"
        leftElement={<LuSearch size={18} />}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
      <CusMenuList
        value={roleFilter}
        onValueChange={(v) => onRoleFilterChange(v as MemberRoleFilter)}
        items={buildRoleFilterItems()}
        width={160}
        trigger={<IconTriggerButton icon={<LuFilter size={16} />} />}
      />
      <CusMenuList
        value={viewStyle}
        onValueChange={(v) => onViewStyleChange(v as MemberViewStyle)}
        items={buildViewStyleItems()}
        width={160}
        trigger={<IconTriggerButton icon={<LuLayoutGrid size={16} />} />}
      />
    </div>
  );
}
