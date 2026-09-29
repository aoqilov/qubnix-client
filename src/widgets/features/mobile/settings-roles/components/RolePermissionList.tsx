import { useTranslation } from "react-i18next";
import { LuCheck, LuX } from "react-icons/lu";
import type { RolePermission } from "../lib/rolesData";

interface RolePermissionListProps {
  /** Rolning qisqa tavsifi (`roles.<rol>.text`). */
  summary: string;
  permissions: readonly RolePermission[];
}

/** Rol tavsifi + checklist: ✓ qila oladi, ✗ qila olmaydi. */
export function RolePermissionList({ summary, permissions }: RolePermissionListProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-secondary">{summary}</p>
      <ul className="flex flex-col gap-2">
        {permissions.map(({ key, allowed }) => (
          <li key={key} className="flex items-start gap-2">
            <span
              className={`mt-0.5 flex size-4 flex-none items-center justify-center rounded-avatar ${
                allowed ? "bg-success-soft text-success-strong" : "bg-surface-secondary text-disabled"
              }`}
            >
              {allowed ? <LuCheck size={11} strokeWidth={3} /> : <LuX size={11} strokeWidth={3} />}
            </span>
            <span className={`text-sm ${allowed ? "text-primary" : "text-disabled line-through"}`}>
              {t(`roles.perms.${key}`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
