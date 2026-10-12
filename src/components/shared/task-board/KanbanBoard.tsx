import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { RawTask } from "@/api/tasks/tasks.types";
import { TASK_STATUS_META, type TaskStatusMeta } from "@/components/shared/task-card/taskStatusMeta";
import { TaskTile } from "./TaskTile";

interface KanbanBoardProps {
  tasks: RawTask[];
  projectName: string;
  readOnly: boolean;
  onStatusChange: (task: RawTask, nextStatusId: string) => void;
  onOpen: (task: RawTask) => void;
  /**
   * "wide" (default) — desktop: 300px ustunlar, sichqoncha bilan sudrash.
   * "compact" — mobil: ekranning ~85% enidagi ustunlar (snap bilan suriladi), uzoq bosib sudrash.
   */
  variant?: "wide" | "compact";
}

const COLUMN_HEADER_COLOR: Record<TaskStatusMeta["color"], string> = {
  gray: "var(--text-secondary)",
  brand: "var(--brand-default)",
  success: "var(--status-success-solid)",
  error: "var(--status-error-solid)",
};

function KanbanCard({
  task,
  projectName,
  readOnly,
  onStatusChange,
  onOpen,
}: {
  task: RawTask;
  projectName: string;
  readOnly: boolean;
  onStatusChange: (nextStatusId: string) => void;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: String(task.id),
    disabled: readOnly,
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={{ opacity: isDragging ? 0.4 : 1 }}>
      <TaskTile
        task={task}
        projectName={projectName}
        readOnly={readOnly}
        onStatusChange={onStatusChange}
        onOpen={onOpen}
      />
    </div>
  );
}

function KanbanColumn({
  meta,
  tasks,
  projectName,
  readOnly,
  onStatusChange,
  onOpen,
  compact,
}: {
  meta: TaskStatusMeta;
  tasks: RawTask[];
  projectName: string;
  readOnly: boolean;
  onStatusChange: (task: RawTask, nextStatusId: string) => void;
  onOpen: (task: RawTask) => void;
  compact: boolean;
}) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: meta.id, disabled: readOnly });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-none flex-col gap-3 rounded-card border p-3 transition-colors ${
        compact ? "w-[85%] snap-start" : "w-[300px]"
      }`}
      style={{
        borderColor: isOver ? "var(--border-focus)" : "var(--border-subtle)",
        background: isOver ? "var(--bg-surface-secondary)" : "var(--bg-surface)",
      }}
    >
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm font-semibold" style={{ color: COLUMN_HEADER_COLOR[meta.color] }}>
          {t(meta.labelKey)}
        </span>
        <span className="ml-auto min-w-[22px] rounded-chip bg-surface-secondary px-1.5 text-center text-xs font-bold text-secondary">
          {tasks.length}
        </span>
      </div>
      <div className="flex min-h-[80px] flex-col gap-2 overflow-y-auto">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            projectName={projectName}
            readOnly={readOnly}
            onStatusChange={(next) => onStatusChange(task, next)}
            onOpen={() => onOpen(task)}
          />
        ))}
      </div>
    </div>
  );
}

/** Kanban ko'rinishi — 4 status ustuni, kartalar orasida drag & drop bilan status o'zgaradi. */
export function KanbanBoard({
  tasks,
  projectName,
  readOnly,
  onStatusChange,
  onOpen,
  variant = "wide",
}: KanbanBoardProps) {
  const compact = variant === "compact";
  const [activeTask, setActiveTask] = useState<RawTask | null>(null);
  const pointer = useSensor(PointerSensor, { activationConstraint: { distance: 8 } });
  const mouse = useSensor(MouseSensor, { activationConstraint: { distance: 8 } });
  // Teginishda sudrash uzoq bosishdan keyin boshlanadi — aks holda gorizontal surish va scroll bilan to'qnashadi.
  const touch = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } });
  const sensors = useSensors(...(compact ? [mouse, touch] : [pointer]));

  const columns = TASK_STATUS_META.map((meta) => ({
    meta,
    tasks: tasks.filter((task) => task.status === meta.countKey),
  }));

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => String(t.id) === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const task = tasks.find((t) => String(t.id) === active.id);
    const nextMeta = TASK_STATUS_META.find((m) => m.id === over.id);
    if (!task || !nextMeta || nextMeta.countKey === task.status) return;
    onStatusChange(task, nextMeta.id);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className={`flex gap-3 overflow-x-auto pb-2 ${
          compact ? "-mx-4 snap-x snap-proximity scroll-px-4 px-4" : ""
        }`}
      >
        {columns.map((col) => (
          <KanbanColumn
            key={col.meta.id}
            meta={col.meta}
            tasks={col.tasks}
            projectName={projectName}
            readOnly={readOnly}
            onStatusChange={onStatusChange}
            onOpen={onOpen}
            compact={compact}
          />
        ))}
      </div>
      {/* dropAnimation=null: standart animatsiya "ghost"ni eski joyga (hali React
          qayta render qilmagan DOM pozitsiyasiga) tortib, bir lahza "orqaga
          qaytgandek" ko'rinish beradi — optimistic update allaqachon darhol
          ishlagani uchun bu animatsiya shart emas. */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div
            className={compact ? undefined : "w-[276px]"}
            style={compact ? { width: "calc((100vw - 32px) * 0.85 - 24px)" } : undefined}
          >
            <TaskTile task={activeTask} projectName={projectName} readOnly onStatusChange={() => {}} onOpen={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
