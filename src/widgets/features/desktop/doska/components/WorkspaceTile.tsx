import { useTranslation } from "react-i18next";
import { LuChevronRight } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { avatarColorVar } from "@/utils/avatarColor";
import { tasksWordLabel } from "@/utils/countLabels";
import { organizationRoleLabel } from "@/utils/roleLabels";
import type { WorkspaceSummary } from "@/store/workspace.store";

interface WorkspaceTileProps {
  workspace: WorkspaceSummary;
  onClick: () => void;
}

/** Tashkilot — 2 ustunli gridda keng karta: avatar, nom + rol, o'ngda vazifalar soni. */
export function WorkspaceTile({ workspace, onClick }: WorkspaceTileProps) {
  useTranslation(); // til almashsa rol/son matnlari qayta hisoblanadi
  return (
    <CusCardbox
      onClick={onClick}
      role="button"
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex cursor-pointer items-center gap-4 rounded-card transition-colors hover:border-focus"
    >
      <span
        className="flex size-12 flex-none items-center justify-center rounded-avatar text-base font-semibold text-on-brand"
        style={{ background: avatarColorVar(workspace.id) }}
      >
        {workspace.initials}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold text-primary">{workspace.name}</span>
        {workspace.role && (
          <span className="mt-1 block">
            <CusBadge variant="subtle" tone="neutral" size="xs">
              {organizationRoleLabel(workspace.role)}
            </CusBadge>
          </span>
        )}
      </span>

      <span className="flex flex-none items-center gap-3">
        <span className="flex flex-col items-center rounded-chip bg-brand-subtle px-3 py-1.5 text-brand">
          <span className="text-lg font-bold leading-none">{workspace.tasksCount}</span>
          <span className="text-[10px] font-semibold leading-tight">
            {tasksWordLabel(workspace.tasksCount)}
          </span>
        </span>
        <LuChevronRight size={20} className="text-disabled" />
      </span>
    </CusCardbox>
  );
}
