import { useTranslation } from "react-i18next";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import type { SettingsWorkspace } from "@/hooks/useApiSettings";
import { membersLabel } from "@/utils/countLabels";

interface SettingsWorkspaceCardProps {
  workspace: SettingsWorkspace;
  membersCount?: number;
  isPersonal?: boolean;
}

export function SettingsWorkspaceCard({ workspace, membersCount, isPersonal }: SettingsWorkspaceCardProps) {
  const { t } = useTranslation();
  return (
    <CusCardbox
      className="flex items-center gap-3 rounded-card bg-brand-subtle p-3"
      style={{ borderColor: "var(--brand-default)" }}
    >
      <span className="flex size-9 flex-none items-center justify-center rounded-input bg-brand text-sm font-semibold text-on-brand">
        {workspace.initials}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-primary">{workspace.name}</span>
        <span className="truncate text-xs text-secondary">
          {isPersonal ? t("settings.personalSpace") : membersLabel(membersCount ?? 0)}
        </span>
      </span>
    </CusCardbox>
  );
}
