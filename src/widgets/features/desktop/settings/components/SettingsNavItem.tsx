import { NavLink } from "react-router-dom";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import type { SettingsNavItemData } from "../types";

export function SettingsNavItem({ to, icon, title, subtitle, badgeCount }: SettingsNavItemData) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex min-h-[52px] items-center gap-3 rounded-input border-l-[3px] px-3 py-2 transition-colors ${
          isActive ? "border-brand bg-brand-subtle" : "border-transparent hover:bg-surface-secondary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`flex flex-none items-center justify-center ${isActive ? "text-brand" : "text-secondary"}`}>
            {icon}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={`truncate text-sm font-semibold ${isActive ? "text-brand" : "text-primary"}`}>
              {title}
            </span>
            <span className="truncate text-xs text-secondary">{subtitle}</span>
          </span>
          {typeof badgeCount === "number" && (
            <CusBadge variant="subtle" tone="brand" size="sm">
              {badgeCount}
            </CusBadge>
          )}
        </>
      )}
    </NavLink>
  );
}
