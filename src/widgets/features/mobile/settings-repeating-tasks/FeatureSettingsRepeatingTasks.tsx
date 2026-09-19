import { useMemo, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import ProjectsTabs from "@/components/shared/project-tab/ProjectsTabs";
import TaskCardRoutine from "@/components/shared/task-card-routine/TaskCardRoutine";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { RoutineFrequencyTabs } from "./components/RoutineFrequencyTabs";
import { MOCK_ROUTINE_PROJECTS, MOCK_ROUTINE_TASKS } from "./lib/mockRepeatingTasks";
import type { RoutineFilter } from "./types";

const ALL_PROJECTS_ID = "all";

export default function FeatureSettingsRepeatingTasks() {
  const [projectId, setProjectId] = useState(ALL_PROJECTS_ID);
  const [frequency, setFrequency] = useState<RoutineFilter>("all");
  const [tasks, setTasks] = useState(MOCK_ROUTINE_TASKS);

  const projectTabs = useMemo(
    () => [
      { id: ALL_PROJECTS_ID, projectName: "Все проекты", projectTaskCount: tasks.length },
      ...MOCK_ROUTINE_PROJECTS.map((project) => ({
        id: project.id,
        projectName: project.name,
        projectTaskCount: tasks.filter((task) => task.projectId === project.id).length,
      })),
    ],
    [tasks],
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesProject = projectId === ALL_PROJECTS_ID || task.projectId === projectId;
    const matchesFrequency = frequency === "all" || task.frequency === frequency;
    return matchesProject && matchesFrequency;
  });

  const toggleActive = (id: string, active: boolean) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, active } : task)));
  };

  const disableTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, active: false } : task)));
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title="Повторные задачи" />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {tasks.length} регулярных задач
      </p>

      <ProjectsTabs tabs={projectTabs} activeId={projectId} onChange={setProjectId} />

      <RoutineFrequencyTabs value={frequency} onChange={setFrequency} />

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
      >
        Добавить задачу
      </CusButton>

      <div className="flex flex-col gap-3">
        {filteredTasks.map((task) => (
          <TaskCardRoutine
            key={task.id}
            title={task.title}
            projectLabel={task.projectLabel}
            active={task.active}
            onToggleActive={(active) => toggleActive(task.id, active)}
            repeatLabel={task.repeatLabel}
            nextRunLabel={task.nextRunLabel}
            members={task.members}
            overflowCount={task.overflowCount}
            onDisable={() => disableTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
