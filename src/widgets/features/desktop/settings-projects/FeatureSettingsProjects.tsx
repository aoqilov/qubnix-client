import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuPlus, LuSearch, LuSearchX } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { useIsViewer } from "@/hooks/useIsViewer";
import { useWorkspaceStore } from "@/store/workspace.store";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { projectsLabel } from "@/utils/countLabels";
import { ProjectStatCard } from "@/components/shared/settings/projects/components/ProjectStatCard";
import { CreateProjectDrawer } from "@/components/shared/settings/projects/modals/CreateProjectDrawer";
import { EditProjectDrawer } from "@/components/shared/settings/projects/modals/EditProjectDrawer";
import { DeleteProjectDialog } from "@/components/shared/settings/projects/modals/DeleteProjectDialog";
import {
  useDeleteProject,
  useProjectsList,
} from "@/components/shared/settings/projects/hooks/useApiSettingsProjects";
import { SettingsSectionHeader } from "@/widgets/features/desktop/settings/components/SettingsSectionHeader";

const GRID_CLASS = "grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3";

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuSearchX size={20} />
      </span>
      <p className="text-sm font-medium text-primary">
        {hasQuery ? t("common.states.nothingFound") : t("projects.empty")}
      </p>
      {hasQuery && <p className="text-xs text-secondary">{t("projects.emptySearchHint")}</p>}
    </div>
  );
}

export default function FeatureSettingsProjects() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const projectsQuery = useProjectsList(organizationId);
  const deleteProject = useDeleteProject(organizationId);
  // Viewer loyihalarni ko'radi, lekin yaratish/tahrirlash/o'chirish yo'q.
  const isViewer = useIsViewer();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const projects = projectsQuery.data ?? [];
  const editingProject = projects.find((project) => project.id === editingProjectId) ?? null;
  const deletingProject = projects.find((project) => project.id === deletingProjectId) ?? null;

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? projects.filter((project) => project.name.toLowerCase().includes(query)) : projects;
  }, [projects, search]);

  const handleConfirmDelete = () => {
    if (!deletingProjectId) return;
    deleteProject.mutate(deletingProjectId, { onSuccess: () => setDeletingProjectId(null) });
  };

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionHeader
        title={t("projects.title")}
        subtitle={projectsQuery.data ? projectsLabel(projects.length) : undefined}
        actions={
          !isViewer && (
            <CusButton
              leftIcon={<LuPlus size={16} />}
              onClick={() => setCreateOpen(true)}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
            >
              {t("projects.newProject")}
            </CusButton>
          )
        }
      />

      <div className="max-w-md">
        <CusInput
          placeholder={t("projects.search")}
          clearable
          leftElementWidth="2.25rem"
          leftElement={<LuSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {projectsQuery.isPending ? (
        <div className={GRID_CLASS}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[240px] animate-pulse rounded-input border border-subtle bg-surface" />
          ))}
        </div>
      ) : projectsQuery.isError ? (
        <p className="text-sm text-error-strong">{t("projects.loadError")}</p>
      ) : filteredProjects.length === 0 ? (
        <EmptyState hasQuery={search.trim().length > 0} />
      ) : (
        <div className={GRID_CLASS}>
          {filteredProjects.map((project) => (
            <ProjectStatCard
              key={project.id}
              project={project}
              onOpen={() => navigate(`/settings/projects/${project.id}`)}
              onEdit={isViewer ? undefined : () => setEditingProjectId(project.id)}
              onDelete={isViewer ? undefined : () => setDeletingProjectId(project.id)}
            />
          ))}
        </div>
      )}

      <CreateProjectDrawer
        variant="dialog"
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        organizationId={organizationId}
      />

      <EditProjectDrawer
        variant="dialog"
        open={editingProjectId !== null}
        onClose={() => setEditingProjectId(null)}
        organizationId={organizationId}
        project={editingProject}
      />

      <DeleteProjectDialog
        open={deletingProjectId !== null}
        onClose={() => {
          setDeletingProjectId(null);
          deleteProject.reset();
        }}
        onConfirm={handleConfirmDelete}
        project={deletingProject}
        isLoading={deleteProject.isPending}
        errorMessage={deleteProject.isError ? getApiErrorMessage(deleteProject.error) : null}
      />
    </div>
  );
}
