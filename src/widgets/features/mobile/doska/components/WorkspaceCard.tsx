import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { avatarColorVar } from "@/utils/avatarColor";
import type { WorkspaceSummary } from "@/store/workspace.store";
import { tasksLabel } from "@/utils/countLabels";
import { organizationRoleLabel } from "@/utils/roleLabels";

interface WorkspaceCardProps {
  workspace: WorkspaceSummary;
  onClick: () => void;
}

export function WorkspaceCard({ workspace, onClick }: WorkspaceCardProps) {
  return (
    <CusCardbox
      onClick={onClick}
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex cursor-pointer items-center gap-3 rounded-card transition-colors hover:border-focus"
    >
      <span
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full font-semibold text-on-brand"
        style={{ background: avatarColorVar(workspace.id) }}
      >
        {workspace.initials}
      </span>

      <span className="min-w-0 flex-1">
        <p className="truncate font-semibold text-primary">{workspace.name}</p>
        {workspace.role && (
          <div className="mt-0.5">
            <CusBadge variant="subtle" tone="neutral" size="xs">
              {organizationRoleLabel(workspace.role)}
            </CusBadge>
          </div>
        )}
      </span>

      <span className="flex flex-none flex-col items-center rounded-chip bg-brand-subtle px-3 py-1.5 text-brand">
        <span className="text-lg font-bold leading-none">{workspace.tasksCount}</span>
        <span className="text-[10px] font-semibold leading-tight">
          {tasksLabel(workspace.tasksCount)}
        </span>
      </span>
    </CusCardbox>
  );
}
