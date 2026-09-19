import { forwardRef } from "react";
import type React from "react";
import { LuFilter, LuSearch, LuUsers } from "react-icons/lu";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";

export type StatsSortOrder = "most" | "least";

const SORT_ITEMS = [
  { value: "most", label: "Сначала больше выполненных" },
  { value: "least", label: "Сначала меньше выполненных" },
];

const iconButtonStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "var(--radius-input)",
  border: "1px solid var(--border-default)",
  background: "var(--bg-surface)",
};

// CusMenuList'ning Menu.Trigger asChild'i o'z proplarini (onClick, ref, aria-*)
// trigger DOM node'iga beradi — shuning uchun ...propsni to'liq spread qiladigan
// forwardRef button kerak (MembersToolbar'dagi IconTriggerButton bilan bir xil sabab).
const IconTriggerButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function IconTriggerButton(props, ref) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className="flex flex-none items-center justify-center self-stretch text-secondary hover:bg-surface-secondary"
      style={iconButtonStyle}
    >
      <LuFilter size={16} />
    </button>
  );
});

interface StatsFilterRowProps {
  value: string;
  onValueChange: (value: string) => void;
  sortOrder: StatsSortOrder;
  onSortOrderChange: (order: StatsSortOrder) => void;
  onOpenMembersFilter: () => void;
}

export function StatsFilterRow({
  value,
  onValueChange,
  sortOrder,
  onSortOrderChange,
  onOpenMembersFilter,
}: StatsFilterRowProps) {
  return (
    <div className="flex items-center gap-2">
      <CusInput
        placeholder="Поиск сотрудников"
        clearable
        leftElementWidth="2.25rem"
        leftElement={<LuSearch size={18} />}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
      <CusMenuList
        value={sortOrder}
        onValueChange={(v) => onSortOrderChange(v as StatsSortOrder)}
        items={SORT_ITEMS}
        width={220}
        trigger={<IconTriggerButton />}
      />
      <button
        type="button"
        onClick={onOpenMembersFilter}
        className="flex flex-none items-center justify-center self-stretch text-secondary hover:bg-surface-secondary"
        style={iconButtonStyle}
      >
        <LuUsers size={16} />
      </button>
    </div>
  );
}
