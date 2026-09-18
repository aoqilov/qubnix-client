import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import type { SettingsWorkspace } from "../hooks/useApiSettings";

interface SettingsWorkspaceCardProps {
  workspace: SettingsWorkspace;
  membersCount?: number;
}

export function SettingsWorkspaceCard({ workspace, membersCount }: SettingsWorkspaceCardProps) {
  return (
    <CusCardbox
      className="flex items-center gap-3 rounded-card"
      style={{ background: "var(--bg-surface-secondary)" }}
    >
      <span className="flex size-11 flex-none items-center justify-center rounded-input bg-brand text-sm font-semibold text-on-brand">
        {workspace.initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-primary">{workspace.name}</span>
        <span className="block text-sm text-secondary">
          {membersCount ?? 0} сотрудников
        </span>
      </span>
    </CusCardbox>
  );
}
