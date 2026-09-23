import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuPlus, LuSearch, LuSearchX } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { useWorkspaceStore } from "@/store/workspace.store";
import { ProjectStatCard } from "./components/ProjectStatCard";
import { CreateProjectDrawer } from "./modals/CreateProjectDrawer";
import { EditProjectDrawer } from "./modals/EditProjectDrawer";
import { DeleteProjectDialog } from "./modals/DeleteProjectDialog";
import { useDeleteProject, useProjectsList } from "./hooks/useApiSettingsProjects";

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuSearchX size={20} />
      </span>
      <p className="text-sm font-medium text-primary">
        {hasQuery ? "Hech narsa topilmadi" : "Loyihalar hali yo'q"}
      </p>
      {hasQuery && <p className="text-xs text-secondary">Qidiruvni o'zgartirib ko'ring</p>}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="h-[220px] animate-pulse rounded-input border border-subtle bg-surface" />
  );
}

export default function FeatureSettingsProjects() {
  const navigate = useNavigate();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const projectsQuery = useProjectsList(organizationId);
  const deleteProject = useDeleteProject(organizationId);

  const [search, setSearch] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const projects = projectsQuery.data ?? [];
  const editingProject = projects.find((project) => project.id === editingProjectId) ?? null;
  const deletingProject = projects.find((project) => project.id === deletingProjectId) ?? null;

  const handleConfirmDelete = () => {
    if (!deletingProjectId) return;
    deleteProject.mutate(deletingProjectId, { onSuccess: () => setDeletingProjectId(null) });
  };

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? projects.filter((project) => project.name.toLowerCase().includes(query)) : projects;
  }, [projects, search]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title="Проекты" />

      <CusInput
        placeholder="Поиск проектов"
        clearable
        leftElementWidth="2.25rem"
        leftElement={<LuSearch size={18} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <CusButton
        variant="plain"
        className="w-full"
        style={{
          height: "48px",
          width: "100%",
          border: "1px dashed var(--border-default)",
          borderRadius: "var(--radius-card)",
          color: "var(--brand-default)",
          fontWeight: 600,
        }}
        leftIcon={<LuPlus size={16} />}
        onClick={() => setCreateOpen(true)}
      >
        Новый проект
      </CusButton>

      {projectsQuery.isPending ? (
        <div className="flex flex-col gap-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : projectsQuery.isError ? (
        <p className="px-1 text-sm text-error-strong">Не удалось загрузить проекты.</p>
      ) : filteredProjects.length === 0 ? (
        <EmptyState hasQuery={search.trim().length > 0} />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProjects.map((project) => (
            <ProjectStatCard
              key={project.id}
              project={project}
              onOpen={() => navigate(`/settings/projects/${project.id}`)}
              onEdit={() => setEditingProjectId(project.id)}
              onDelete={() => setDeletingProjectId(project.id)}
            />
          ))}
        </div>
      )}

      <CreateProjectDrawer
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        organizationId={organizationId}
      />

      <EditProjectDrawer
        open={editingProjectId !== null}
        onClose={() => setEditingProjectId(null)}
        organizationId={organizationId}
        project={editingProject}
      />

      <DeleteProjectDialog
        open={deletingProjectId !== null}
        onClose={() => setDeletingProjectId(null)}
        onConfirm={handleConfirmDelete}
        project={deletingProject}
        isLoading={deleteProject.isPending}
      />
    </div>
  );
}
