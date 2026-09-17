import { useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LuCircle,
  LuLoaderCircle,
  LuCircleCheck,
  LuCircleX,
  LuTriangleAlert,
} from "react-icons/lu";
import type { TaskStatusColor } from "@/components/shared/task-card/mini-components/TaskStatusLabel";
import { projectsApi } from "@/api/projects/projects.api";
import ProjectsTabs from "@/components/shared/project-tab/ProjectsTabs";
import PageTitleDynamic from "@/components/shared/page-title-dynamic/PageTitleDynamic";
import StatusTab from "@/components/shared/status-tab/StatusTab";
import TaskCard from "@/components/shared/task-card/TaskCard";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import FilterSectionTask from "./components/FilterSectionTask";
import TaskAddButton, {
  TASK_ADD_BUTTON_OFFSET,
} from "@/components/shared/task-button/TaskAddButton";
import TaskModalAdd, {
  type TaskModalAddValues,
} from "@/components/shared/task-modals/TaskModalAdd";
import TaskModalEdit from "@/components/shared/task-modals/TaskModalEdit";
import TaskModalDelete from "@/components/shared/task-modals/TaskModalDelete";

const SORT_OPTIONS = [
  { value: "deadline", label: "Muddat bo'yicha" },
  { value: "priority", label: "Muhimlik bo'yicha" },
  { value: "created", label: "Yaratilgan sana bo'yicha" },
];

const STATUS_TABS = [
  { id: "assigned", label: "Berildi", count: 2, color: "gray" as const },
  { id: "in_progress", label: "Jarayonda", count: 2, color: "brand" as const },
  { id: "done", label: "Bajarildi", count: 1, color: "success" as const },
  { id: "failed", label: "Bajarilmadi", count: 1, color: "error" as const },
];

// Checkbox ustidagi CusMenuList uchun: har bir status uchun ikonka va rang.
// STATUS_TABS bilan id orqali mos keladi.
const STATUS_ICON: Record<string, ReactNode> = {
  assigned: <LuCircle size={14} />,
  in_progress: <LuLoaderCircle size={14} />,
  done: <LuCircleCheck size={14} />,
  failed: <LuCircleX size={14} />,
};

const STATUS_ICON_COLOR: Record<TaskStatusColor, string> = {
  gray: "var(--text-secondary)",
  brand: "var(--brand-default)",
  success: "var(--status-success-solid)",
  error: "var(--status-error-solid)",
};

const STATUS_MENU_OPTIONS = STATUS_TABS.map((tab) => ({
  id: tab.id,
  label: tab.label,
  icon: STATUS_ICON[tab.id],
  iconColor: STATUS_ICON_COLOR[tab.color],
}));

interface DemoTask {
  id: string;
  /** STATUS_TABS'dagi id bilan mos — filtrlash shu bo'yicha ishlaydi. */
  statusId: string;
  title: string;
  flagged: boolean;
  expanded: boolean;
  dateRangeLabel: string;
  subtaskCountLabel: string;
  fileCount: number;
  members: TaskCardMember[];
  overflowCount?: number;
  statusLabel: string;
  statusColor: TaskStatusColor;
  description: string;
  /** Berilsa, TaskCard description o'rniga shu ovozli xabarni ko'rsatadi. */
  descriptionAudio?: { url: string; durationLabel: string };
  projectTag: string;
  subtasks: { id: string; label: string; checked: boolean }[];
  files: { id: string; name: string; sizeLabel: string }[];
  photos: { id: string; url: string }[];
}

const INITIAL_TASKS: DemoTask[] = [
  {
    id: "t1",
    statusId: "assigned",
    title:
      "Tuzilma bo'yicha texnik topshiriq wwwwwwwww eeeeeeeee rrrrrrr tttttt fg er etrhetw",
    flagged: false,
    expanded: false,
    dateRangeLabel: "12.09 - 14.09",
    subtaskCountLabel: "0/2",
    fileCount: 1,
    members: [
      {
        id: "u1",
        initials: "MK",
        name: "Malika Karimova",
        avatarUrl: "https://i.pravatar.cc/64?u=u1",
        readStatus: "sent",
      },
    ],
    statusLabel: "Berildi",
    statusColor: "gray",
    description: "Yangi bo'lim uchun texnik topshiriqni tayyorlash.",
    projectTag: "РЕДИЗАЙН",
    subtasks: [
      { id: "s1", label: "Talablarni yig'ish", checked: false },
      { id: "s2", label: "Maketlarni ko'rib chiqish", checked: false },
    ],
    files: [{ id: "f1", name: "tz.pdf", sizeLabel: "210 KB" }],
    photos: [],
  },
  {
    id: "t1",
    statusId: "assigned",
    title:
      "Tuzilma bo'yicha texnik topshiriq wwwwwwwww eeeeeeeee rrrrrrr tttttt fg er etrhetw",
    flagged: false,
    expanded: false,
    dateRangeLabel: "12.09 - 14.09",
    subtaskCountLabel: "0/2",
    fileCount: 1,
    members: [
      {
        id: "u1",
        initials: "MK",
        name: "Malika Karimova",
        avatarUrl: "https://i.pravatar.cc/64?u=u1",
        readStatus: "sent",
      },
    ],
    statusLabel: "Berildi",
    statusColor: "gray",
    description: "Yangi bo'lim uchun texnik topshiriqni tayyorlash.",
    projectTag: "РЕДИЗАЙН",
    subtasks: [
      { id: "s1", label: "Talablarni yig'ish", checked: false },
      { id: "s2", label: "Maketlarni ko'rib chiqish", checked: false },
    ],
    files: [{ id: "f1", name: "tz.pdf", sizeLabel: "210 KB" }],
    photos: [],
  },
  {
    id: "t1",
    statusId: "assigned",
    title:
      "Tuzilma bo'yicha texnik topshiriq wwwwwwwww eeeeeeeee rrrrrrr tttttt fg er etrhetw",
    flagged: false,
    expanded: false,
    dateRangeLabel: "12.09 - 14.09",
    subtaskCountLabel: "0/2",
    fileCount: 1,
    members: [
      {
        id: "u1",
        initials: "MK",
        name: "Malika Karimova",
        avatarUrl: "https://i.pravatar.cc/64?u=u1",
        readStatus: "sent",
      },
    ],
    statusLabel: "Berildi",
    statusColor: "gray",
    description: "Yangi bo'lim uchun texnik topshiriqni tayyorlash.",
    projectTag: "РЕДИЗАЙН",
    subtasks: [
      { id: "s1", label: "Talablarni yig'ish", checked: false },
      { id: "s2", label: "Maketlarni ko'rib chiqish", checked: false },
    ],
    files: [{ id: "f1", name: "tz.pdf", sizeLabel: "210 KB" }],
    photos: [],
  },
  {
    id: "t1",
    statusId: "assigned",
    title:
      "Tuzilma bo'yicha texnik topshiriq wwwwwwwww eeeeeeeee rrrrrrr tttttt fg er etrhetw",
    flagged: false,
    expanded: false,
    dateRangeLabel: "12.09 - 14.09",
    subtaskCountLabel: "0/2",
    fileCount: 1,
    members: [
      {
        id: "u1",
        initials: "MK",
        name: "Malika Karimova",
        avatarUrl: "https://i.pravatar.cc/64?u=u1",
        readStatus: "sent",
      },
    ],
    statusLabel: "Berildi",
    statusColor: "gray",
    description: "Yangi bo'lim uchun texnik topshiriqni tayyorlash.",
    projectTag: "РЕДИЗАЙН",
    subtasks: [
      { id: "s1", label: "Talablarni yig'ish", checked: false },
      { id: "s2", label: "Maketlarni ko'rib chiqish", checked: false },
    ],
    files: [{ id: "f1", name: "tz.pdf", sizeLabel: "210 KB" }],
    photos: [],
  },
  {
    id: "t1",
    statusId: "assigned",
    title:
      "Tuzilma bo'yicha texnik topshiriq wwwwwwwww eeeeeeeee rrrrrrr tttttt fg er etrhetw",
    flagged: false,
    expanded: false,
    dateRangeLabel: "12.09 - 14.09",
    subtaskCountLabel: "0/2",
    fileCount: 1,
    members: [
      {
        id: "u1",
        initials: "MK",
        name: "Malika Karimova",
        avatarUrl: "https://i.pravatar.cc/64?u=u1",
        readStatus: "sent",
      },
    ],
    statusLabel: "Berildi",
    statusColor: "gray",
    description: "Yangi bo'lim uchun texnik topshiriqni tayyorlash.",
    projectTag: "РЕДИЗАЙН",
    subtasks: [
      { id: "s1", label: "Talablarni yig'ish", checked: false },
      { id: "s2", label: "Maketlarni ko'rib chiqish", checked: false },
    ],
    files: [{ id: "f1", name: "tz.pdf", sizeLabel: "210 KB" }],
    photos: [],
  },
  {
    id: "t2",
    statusId: "in_progress",
    title: "Обновить набор иконок",
    flagged: false,
    expanded: false,
    dateRangeLabel: "14.09 - 16.09",
    subtaskCountLabel: "1/2",
    fileCount: 5,
    members: [
      {
        id: "u1",
        initials: "MK",
        name: "Malika Karimova",
        avatarUrl: "https://i.pravatar.cc/64?u=u1",
        readStatus: "seen",
      },
      {
        id: "u2",
        initials: "HC",
        name: "Husan Choriyev",
        avatarUrl: "https://i.pravatar.cc/64?u=u2",
        readStatus: "seen",
      },
      {
        id: "u3",
        initials: "TK",
        name: "Tohir Qodirov",
        avatarUrl: "https://i.pravatar.cc/100?u=u5",
        readStatus: "sent",
      },
    ],
    overflowCount: 7,
    statusLabel: "В процессе",
    statusColor: "brand",
    description: "Единый визуальный язык для всех разделов.",
    descriptionAudio: {
      url: "https://www.w3schools.com/html/horse.ogg",
      durationLabel: "0:14",
    },
    projectTag: "РЕДИЗАЙН",
    subtasks: [
      { id: "s1", label: "Список иконок", checked: true },
      { id: "s2", label: "Иконки навигации", checked: false },
    ],
    files: [{ id: "f1", name: "tz-redesign.pdf", sizeLabel: "840 KB" }],
    photos: [
      { id: "p1", url: "https://picsum.photos/seed/icon-set-1/1920/1080" },
      { id: "p2", url: "https://picsum.photos/seed/icon-set-2/1920/1080" },
      { id: "p3", url: "https://picsum.photos/seed/icon-set-3/1920/1080" },
    ],
  },
  {
    id: "t3",
    statusId: "done",
    title: "Onboarding oqimini yangilash",
    flagged: false,
    expanded: false,
    dateRangeLabel: "08.09 - 10.09",
    subtaskCountLabel: "3/3",
    fileCount: 2,
    members: [
      {
        id: "u4",
        initials: "AB",
        name: "Aziz Boltayev",
        avatarUrl: "https://i.pravatar.cc/64?u=u4",
        readStatus: "seen",
      },
      {
        id: "u5",
        initials: "DN",
        name: "Dilnoza Nazarova",
        avatarUrl: "https://i.pravatar.cc/64?u=u5",
        readStatus: "seen",
      },
    ],
    statusLabel: "Bajarildi",
    statusColor: "success",
    description:
      "Yangi foydalanuvchilar uchun onboarding ekranlari yangilandi.",
    projectTag: "ONBOARDING",
    subtasks: [
      { id: "s1", label: "Wireframe", checked: true },
      { id: "s2", label: "UI dizayn", checked: true },
      { id: "s3", label: "Ko'rib chiqish", checked: true },
    ],
    files: [],
    photos: [],
  },
  {
    id: "t4",
    statusId: "failed",
    title: "API integratsiyasini yakunlash",
    flagged: true,
    expanded: false,
    dateRangeLabel: "05.09 - 09.09",
    subtaskCountLabel: "1/4",
    fileCount: 0,
    members: [
      {
        id: "u6",
        initials: "RZ",
        name: "Rustam Zokirov",
        avatarUrl: "https://i.pravatar.cc/64?u=u6",
        readStatus: "sent",
      },
    ],
    statusLabel: "Просрочено",
    statusColor: "error",
    description:
      "Backend bilan asosiy endpointlar ulanmagan, muddat o'tib ketdi.",
    projectTag: "BACKEND",
    subtasks: [
      { id: "s1", label: "Auth", checked: true },
      { id: "s2", label: "Tasks API", checked: false },
      { id: "s3", label: "Workspace API", checked: false },
      { id: "s4", label: "Testlash", checked: false },
    ],
    files: [],
    photos: [],
  },
];

export default function FeatureTasks() {
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get("organizationId");

  const projectsQuery = useQuery({
    queryKey: ["organizations", organizationId, "projects"] as const,
    queryFn: () => projectsApi.list(organizationId!, { limit: 100 }),
    enabled: !!organizationId,
  });
  const projectTabs =
    projectsQuery.data?.projects.map((p) => ({
      id: p.id,
      projectName: p.name,
      // Backend hozircha loyiha bo'yicha vazifalar sonini bermaydi.
      projectTaskCount: 0,
    })) ?? [];

  const [activeTabId, setActiveTabId] = useState("1");
  const [sort, setSort] = useState("deadline");
  const [statusId, setStatusId] = useState("in_progress");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  // "Bajarildi"ga o'tkazishdan oldin, hali bajarilmagan subtasklar bo'lsa,
  // shu yerda tasdiq kutiladi — CusDialog shu holatga qarab ochiladi.
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    taskId: string;
    nextStatusId: string;
  } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const updateTask = (id: string, patch: Partial<DemoTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const addTask = ({ title, description }: TaskModalAddValues) => {
    const assigned = STATUS_TABS.find((tab) => tab.id === "assigned")!;
    setTasks((prev) => [
      ...prev,
      {
        id: `t${Date.now()}`,
        statusId: assigned.id,
        title,
        flagged: false,
        expanded: false,
        dateRangeLabel: "",
        subtaskCountLabel: "0/0",
        fileCount: 0,
        members: [],
        statusLabel: assigned.label,
        statusColor: assigned.color,
        description,
        projectTag: "",
        subtasks: [],
        files: [],
        photos: [],
      },
    ]);
  };

  const editingTask = tasks.find((t) => t.id === editingTaskId);
  const deletingTask = tasks.find((t) => t.id === deletingTaskId);

  const applyStatusChange = (taskId: string, nextStatusId: string) => {
    const meta = STATUS_TABS.find((tab) => tab.id === nextStatusId);
    if (!meta) return;
    updateTask(taskId, {
      statusId: nextStatusId,
      statusLabel: meta.label,
      statusColor: meta.color,
    });
  };

  const requestStatusChange = (task: DemoTask, nextStatusId: string) => {
    const hasUnfinishedSubtasks = task.subtasks.some((s) => !s.checked);
    if (nextStatusId === "done" && hasUnfinishedSubtasks) {
      setPendingStatusChange({ taskId: task.id, nextStatusId });
      return;
    }
    applyStatusChange(task.id, nextStatusId);
  };

  const pendingTask = pendingStatusChange
    ? tasks.find((t) => t.id === pendingStatusChange.taskId)
    : undefined;

  return (
    <div>
      <div
        className="flex flex-col gap-3 p-4"
        style={{
          paddingBottom: `calc(${TASK_ADD_BUTTON_OFFSET} + 56px + 12px)`,
        }}
      >
        <PageTitleDynamic
          title="Mening vazifalarim"
          date="CHORSHANBA - 14.09.2026"
          doneCount={1}
          totalCount={6}
          statusLabel="Выполнено"
        />
        <ProjectsTabs
          tabs={projectTabs}
          activeId={activeTabId}
          onChange={setActiveTabId}
        />
        <FilterSectionTask
          label="ПО СРОКАМ"
          value={sort}
          onValueChange={setSort}
          menulist={SORT_OPTIONS}
        />
        <StatusTab
          items={STATUS_TABS}
          activeId={statusId}
          onChange={setStatusId}
          className="sticky top-0 z-sticky -mx-4 bg-canvas px-4 py-2"
        />

        {tasks
          .filter((task) => task.statusId === statusId)
          .map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              statusOptions={STATUS_MENU_OPTIONS}
              statusId={task.statusId}
              onStatusChange={(nextStatusId) =>
                requestStatusChange(task, nextStatusId)
              }
              flagged={task.flagged}
              dateRangeLabel={task.dateRangeLabel}
              subtaskCountLabel={task.subtaskCountLabel}
              fileCount={task.fileCount}
              members={task.members}
              overflowCount={task.overflowCount}
              statusLabel={task.statusLabel}
              statusColor={task.statusColor}
              expanded={task.expanded}
              onToggleExpanded={() =>
                updateTask(task.id, { expanded: !task.expanded })
              }
              description={task.description}
              descriptionAudio={task.descriptionAudio}
              projectTag={task.projectTag}
              subtasks={task.subtasks}
              onSubtaskChange={(id, checked) =>
                updateTask(task.id, {
                  subtasks: task.subtasks.map((s) =>
                    s.id === id ? { ...s, checked } : s,
                  ),
                })
              }
              photos={task.photos}
              files={task.files}
              onDownloadFile={() => {}}
              onAttachFile={() => {}}
              onDelete={() => setDeletingTaskId(task.id)}
              onEdit={() => setEditingTaskId(task.id)}
            />
          ))}
      </div>

      <CusDialog
        open={pendingStatusChange !== null}
        onClose={() => setPendingStatusChange(null)}
        title="Subtasklar bajarilmagan"
        size="sm"
        centered
        footer={
          <>
            <CusButton
              variant="outline"
              onClick={() => setPendingStatusChange(null)}
            >
              Bekor qilish
            </CusButton>
            <CusButton
              onClick={() => {
                if (pendingStatusChange) {
                  applyStatusChange(
                    pendingStatusChange.taskId,
                    pendingStatusChange.nextStatusId,
                  );
                }
                setPendingStatusChange(null);
              }}
              style={{
                background: "var(--brand-default)",
                color: "var(--text-on-brand)",
              }}
            >
              Ha, bajarildi
            </CusButton>
          </>
        }
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: "50%",
              background: "var(--status-warning-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LuTriangleAlert size={18} color="var(--status-warning-text)" />
          </div>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {pendingTask?.title}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              {pendingTask?.subtasks.filter((s) => !s.checked).length} ta
              subtask hali bajarilmagan. Baribir "Bajarildi" deb belgilaysizmi?
            </p>
          </div>
        </div>
      </CusDialog>

      <TaskAddButton onClick={() => setIsAddOpen(true)} />

      <TaskModalAdd
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={addTask}
      />

      <TaskModalEdit
        open={editingTaskId !== null}
        onClose={() => setEditingTaskId(null)}
        initialValues={{
          title: editingTask?.title ?? "",
          description: editingTask?.description ?? "",
        }}
        onSubmit={(values) => {
          if (editingTaskId) updateTask(editingTaskId, values);
        }}
      />

      <TaskModalDelete
        open={deletingTaskId !== null}
        onClose={() => setDeletingTaskId(null)}
        taskTitle={deletingTask?.title}
        onConfirm={() =>
          setTasks((prev) => prev.filter((t) => t.id !== deletingTaskId))
        }
      />
    </div>
  );
}
