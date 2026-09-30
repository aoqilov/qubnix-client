import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { LuChevronLeft, LuUsers } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import TaskStatGrid from "@/components/shared/task-stat-grid/TaskStatGrid";
import { useProjectDetail } from "@/components/shared/settings/projects/hooks/useApiSettingsProjects";
import { useWorkspaceStore } from "@/store/workspace.store";
import { avatarColorVar } from "@/utils/avatarColor";
import { projectRoleLabel } from "@/utils/roleLabels";
import { tagColorVar } from "@/utils/tagColor";
import { SettingsSectionHeader } from "@/widgets/features/desktop/settings/components/SettingsSectionHeader";

export default function FeatureProjectDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  // Personal workspace'da boshqa xodim yo'q — "Сотрудники" bo'limi ko'rsatilmaydi.
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const { data: project, isPending, isError } = useProjectDetail(organizationId, projectId ?? null);
  const tagColor = project ? tagColorVar(project.id) : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <CusButton
          variant="ghost"
          size="sm"
          leftIcon={<LuChevronLeft size={16} />}
          onClick={() => navigate("/settings/projects")}
          style={{ color: "var(--text-secondary)", paddingLeft: 0 }}
        >
          {t("projects.title")}
        </CusButton>
      </div>

      <SettingsSectionHeader title={project?.name ?? t("projects.fallbackTitle")} />

      {isPending ? (
        <div className="h-[240px] animate-pulse rounded-card border border-subtle bg-surface" />
      ) : isError || !project ? (
        <p className="text-sm text-error-strong">{t("projects.detailLoadError")}</p>
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
          <CusCardbox className="flex flex-col gap-4 rounded-card bg-surface" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center gap-3">
              <span
                className="flex size-11 flex-none items-center justify-center rounded-input text-sm font-semibold text-on-brand"
                style={{ background: tagColor }}
              >
                {project.initials}
              </span>
              <span className="min-w-0 flex-1 truncate text-base font-semibold text-primary">{project.name}</span>
              <span className="font-condensed text-2xl font-semibold text-brand">{project.percent}%</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
              <div className="h-full rounded-full" style={{ width: `${project.percent}%`, background: tagColor }} />
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
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                {t("projects.members")}
              </span>

              {project.members.length === 0 ? (
                <CusCardbox
                  className="flex flex-col items-center gap-2 rounded-card bg-surface py-8 text-center"
                  style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}
                >
                  <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
                    <LuUsers size={20} />
                  </span>
                  <p className="text-sm text-secondary">{t("projects.noMembers")}</p>
                </CusCardbox>
              ) : (
                <CusCardbox
                  style={{ padding: 0, borderColor: "var(--border-subtle)" }}
                  className="flex flex-col divide-y divide-[var(--border-subtle)] rounded-card bg-surface"
                >
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                      <span
                        className="flex size-9 flex-none items-center justify-center rounded-avatar text-xs font-semibold text-on-brand"
                        style={{ background: avatarColorVar(member.id) }}
                      >
                        {member.initials}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary">{member.name}</span>
                      <CusBadge tone={member.role === "project_manager" ? "brand" : "neutral"}>
                        {projectRoleLabel(member.role)}
                      </CusBadge>
                    </div>
                  ))}
                </CusCardbox>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
