import { useTranslation } from "react-i18next";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { avatarColorVar } from "@/utils/avatarColor";
import type { WorkspaceSummary } from "@/store/workspace.store";
import { isWorkspaceBlocked } from "@/queries/doska.queries";
import { tasksWordLabel } from "@/utils/countLabels";
import { organizationRoleLabel } from "@/utils/roleLabels";

interface WorkspaceCardProps {
  workspace: WorkspaceSummary;
  onClick: () => void;
}

export function WorkspaceCard({ workspace, onClick }: WorkspaceCardProps) {
  const { t } = useTranslation();
  const blocked = isWorkspaceBlocked(workspace);
  const status = workspace.moduleStatus ?? "active";
  return (
    <CusCardbox
      onClick={onClick}
      style={{ borderColor: "var(--border-subtle)" }}
      className={`flex items-center gap-3 rounded-card transition-colors ${
        blocked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-focus"
      }`}
    >
      <span
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full font-semibold text-on-brand"
        style={{ background: avatarColorVar(workspace.id) }}
      >
        {workspace.initials}
      </span>

      <span className="min-w-0 flex-1">
        <p className="truncate font-semibold text-primary">{workspace.name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {workspace.role && (
            <CusBadge variant="subtle" tone="neutral" size="xs">
              {organizationRoleLabel(workspace.role)}
            </CusBadge>
          )}
            <CusBadge variant="subtle" tone={status === "active" ? "success" : status === "expired" ? "error" : "neutral"} size="xs">
              {t(`profile.tariffs.state.${status}`)}
            </CusBadge>
        </div>
      </span>

      <span className="flex flex-none flex-col items-center rounded-chip bg-brand-subtle px-3 py-1.5 text-brand">
        <span className="text-lg font-bold leading-none">{workspace.tasksCount}</span>
        <span className="text-[10px] font-semibold leading-tight">
          {tasksWordLabel(workspace.tasksCount)}
        </span>
      </span>
    </CusCardbox>
  );
}
