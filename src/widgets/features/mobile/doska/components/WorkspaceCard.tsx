import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { avatarColorVar } from "@/utils/avatarColor";
import type { WorkspaceSummary } from "@/store/workspace.store";
import { tasksLabel } from "@/utils/pluralRu";

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

      <span className="min-w-0 flex-1 truncate font-semibold text-primary">
        {workspace.name}
      </span>

      <span className="flex-none whitespace-nowrap rounded-chip bg-brand-subtle px-2.5 py-1 text-xs font-semibold text-brand">
        {tasksLabel(workspace.tasksCount)}
      </span>
    </CusCardbox>
  );
}
