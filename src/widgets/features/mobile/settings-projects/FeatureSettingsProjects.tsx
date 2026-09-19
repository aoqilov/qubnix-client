import { useMemo, useState } from "react";
import { LuPlus, LuSearch, LuSearchX } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { ProjectStatCard } from "./components/ProjectStatCard";
import { CreateProjectDrawer } from "./modals/CreateProjectDrawer";
import { EditProjectDrawer } from "./modals/EditProjectDrawer";
import { MOCK_AVAILABLE_MEMBERS, MOCK_PROJECTS } from "./lib/mockProjects";
import type { ProjectFormInput, ProjectFormMember, ProjectMember, ProjectStatsItem } from "./types";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuSearchX size={20} />
      </span>
      <p className="text-sm font-medium text-primary">Hech narsa topilmadi</p>
      <p className="text-xs text-secondary">Qidiruvni o'zgartirib ko'ring</p>
    </div>
  );
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
}

function toProjectMembers(formMembers: ProjectFormMember[]): ProjectMember[] {
  return formMembers
    .map((formMember) => {
      const member = MOCK_AVAILABLE_MEMBERS.find((m) => m.id === formMember.userId);
      return member && { id: member.id, initials: initialsOf(member.name), name: member.name, role: formMember.role };
    })
    .filter((member): member is ProjectMember => !!member);
}

export default function FeatureSettingsProjects() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const editingProject = projects.find((project) => project.id === editingProjectId) ?? null;

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const createProject = (input: ProjectFormInput) => {
    const newProject: ProjectStatsItem = {
      id: `project-${Date.now()}`,
      name: input.name,
      initials: initialsOf(input.name),
      done: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      percent: 0,
      members: toProjectMembers(input.members),
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  const saveProject = (id: string, input: { name: string; members: ProjectFormMember[] }) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              name: input.name,
              initials: initialsOf(input.name),
              members: toProjectMembers(input.members),
            }
          : project,
      ),
    );
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

      {filteredProjects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProjects.map((project) => (
            <ProjectStatCard
              key={project.id}
              project={project}
              onEdit={() => setEditingProjectId(project.id)}
              onDelete={() => deleteProject(project.id)}
            />
          ))}
        </div>
      )}

      <CreateProjectDrawer
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createProject}
      />

      <EditProjectDrawer
        open={editingProjectId !== null}
        onClose={() => setEditingProjectId(null)}
        project={editingProject}
        onSave={(input) => editingProjectId && saveProject(editingProjectId, input)}
      />
    </div>
  );
}
