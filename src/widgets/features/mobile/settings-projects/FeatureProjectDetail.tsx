import { projectRoleLabel } from "@/utils/roleLabels";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { LuUsers } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import TaskStatGrid from "@/components/shared/task-stat-grid/TaskStatGrid";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { useWorkspaceStore } from "@/store/workspace.store";
import { avatarColorVar } from "@/utils/avatarColor";
import { tagColorVar } from "@/utils/tagColor";
import { useProjectDetail } from "./hooks/useApiSettingsProjects";

function CardSkeleton() {
  return <div className="h-[220px] animate-pulse rounded-input border border-subtle bg-surface" />;
}

export default function FeatureProjectDetail() {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  // Personal workspace'da boshqa xodim yo'q — "Сотрудники" bo'limi ko'rsatilmaydi.
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const { data: project, isPending, isError } = useProjectDetail(organizationId, projectId ?? null);
  const tagColor = project ? tagColorVar(project.id) : undefined;

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title={project?.name ?? t("projects.fallbackTitle")} to="/settings/projects" />

      {isPending ? (
        <CardSkeleton />
      ) : isError || !project ? (
        <p className="px-1 text-sm text-error-strong">{t("projects.detailLoadError")}</p>
      ) : (
        <>
          <CusCardbox className="flex flex-col gap-4 rounded-input">
            <div className="flex items-center gap-3">
              <span
                className="flex size-11 flex-none items-center justify-center rounded-input text-sm font-semibold text-on-brand"
                style={{ background: tagColor }}
              >
                {project.initials}
              </span>
              <span className="min-w-0 flex-1 truncate text-base font-semibold text-primary">
                {project.name}
              </span>
              <span className="text-lg font-bold text-brand">{project.percent}%</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
              <div
                className="h-full rounded-full"
                style={{ width: `${project.percent}%`, background: tagColor }}
              />
            </div>

            <TaskStatGrid
              done={project.done}
              completed={project.completed}
              inProgress={project.inProgress}
              overdue={project.overdue}
            />
          </CusCardbox>

          {!isPersonal && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                {t("projects.members")}
              </span>

              {project.members.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
                    <LuUsers size={20} />
                  </span>
                  <p className="text-sm text-secondary">{t("projects.noMembers")}</p>
                </div>
              ) : (
                <CusCardbox
                  style={{ padding: 0 }}
                  className="flex flex-col divide-y divide-[var(--border-default)] rounded-card"
                >
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                      <span
                        className="flex size-9 flex-none items-center justify-center rounded-avatar text-xs font-semibold text-on-brand"
                        style={{ background: avatarColorVar(member.id) }}
                      >
                        {member.initials}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                        {member.name}
                      </span>
                      <CusBadge tone={member.role === "project_manager" ? "brand" : "neutral"}>
                        {projectRoleLabel(member.role)}
                      </CusBadge>
                    </div>
                  ))}
                </CusCardbox>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
