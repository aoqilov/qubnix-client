import { Link } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import type { SettingsMenuItem } from "../types";

export function SettingsMenuRow({ to, icon, title, subtitle, badgeCount }: SettingsMenuItem) {
  return (
    <Link
      to={to}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-secondary"
    >
      <span className="flex size-9 flex-none items-center justify-center rounded-input bg-surface-secondary text-secondary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-primary">{title}</span>
        <span className="block truncate text-xs text-secondary">{subtitle}</span>
      </span>
      {typeof badgeCount === "number" && (
        <CusBadge variant="subtle" colorPalette="purple">
          {badgeCount}
        </CusBadge>
      )}
      <LuChevronRight size={16} className="flex-none text-disabled" />
    </Link>
  );
}
