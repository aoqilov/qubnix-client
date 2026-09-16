import { useState } from "react";
import type { TaskStatusColor } from "@/components/shared/task-card/mini-components/TaskStatusLabel";
import ProjectsTabs from "@/components/shared/project-tab/ProjectsTabs";
import PageTitleDynamic from "@/components/shared/page-title-dynamic/PageTitleDynamic";
import StatusTab from "@/components/shared/status-tab/StatusTab";
import TaskCard from "@/components/shared/task-card/TaskCard";
import FilterSectionTask from "./components/FilterSectionTask";

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

interface DemoTask {
  id: string;
  /** STATUS_TABS'dagi id bilan mos — filtrlash shu bo'yicha ishlaydi. */
  statusId: string;
  title: string;
  checked: boolean;
  flagged: boolean;
  expanded: boolean;
  dateRangeLabel: string;
  subtaskCountLabel: string;
  fileCount: number;
  members: { id: string; initials: string }[];
  overflowCount?: number;
  statusLabel: string;
  statusColor: TaskStatusColor;
  description: string;
  projectTag: string;
  subtasks: { id: string; label: string; checked: boolean }[];
  files: { id: string; name: string; sizeLabel: string }[];
  photos: { id: string; url: string }[];
}

const INITIAL_TASKS: DemoTask[] = [
  {
    id: "t1",
    statusId: "assigned",
    title: "Tuzilma bo'yicha texnik topshiriq",
    checked: false,
    flagged: false,
    expanded: false,
    dateRangeLabel: "12.09 - 14.09",
    subtaskCountLabel: "0/2",
    fileCount: 1,
    members: [{ id: "u1", initials: "MK" }],
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
    checked: false,
    flagged: false,
    expanded: false,
    dateRangeLabel: "14.09 - 16.09",
    subtaskCountLabel: "1/2",
    fileCount: 5,
    members: [
      { id: "u1", initials: "MK" },
      { id: "u2", initials: "HC" },
      { id: "u3", initials: "TK" },
    ],
    overflowCount: 7,
    statusLabel: "В процессе",
    statusColor: "brand",
    description: "Единый визуальный язык для всех разделов.",
    projectTag: "РЕДИЗАЙН",
    subtasks: [
      { id: "s1", label: "Список иконок", checked: true },
      { id: "s2", label: "Иконки навигации", checked: false },
    ],
    files: [{ id: "f1", name: "tz-redesign.pdf", sizeLabel: "840 KB" }],
    photos: [
      { id: "p1", url: "https://picsum.photos/seed/icon-set-1/96" },
      { id: "p2", url: "https://picsum.photos/seed/icon-set-2/96" },
      { id: "p3", url: "https://picsum.photos/seed/icon-set-3/96" },
    ],
  },
  {
    id: "t3",
    statusId: "done",
    title: "Onboarding oqimini yangilash",
    checked: true,
    flagged: false,
    expanded: false,
    dateRangeLabel: "08.09 - 10.09",
    subtaskCountLabel: "3/3",
    fileCount: 2,
    members: [
      { id: "u4", initials: "AB" },
      { id: "u5", initials: "DN" },
    ],
    statusLabel: "Bajarildi",
    statusColor: "success",
    description: "Yangi foydalanuvchilar uchun onboarding ekranlari yangilandi.",
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
    checked: false,
    flagged: true,
    expanded: false,
    dateRangeLabel: "05.09 - 09.09",
    subtaskCountLabel: "1/4",
    fileCount: 0,
    members: [{ id: "u6", initials: "RZ" }],
    statusLabel: "Просрочено",
    statusColor: "error",
    description: "Backend bilan asosiy endpointlar ulanmagan, muddat o'tib ketdi.",
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
  const [activeTabId, setActiveTabId] = useState("1");
  const [sort, setSort] = useState("deadline");
  const [statusId, setStatusId] = useState("in_progress");
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const updateTask = (id: string, patch: Partial<DemoTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  return (
    <div>
      <div className="flex flex-col gap-3 p-4">
        <PageTitleDynamic
          title="Mening vazifalarim"
          date="CHORSHANBA - 14.09.2026"
          doneCount={1}
          totalCount={6}
          statusLabel="Выполнено"
        />
        <ProjectsTabs
          tabs={[
            { id: "1", projectName: "Project 1", projectTaskCount: 5 },
            { id: "2", projectName: "Project 2", projectTaskCount: 3 },
            { id: "3", projectName: "Project 3", projectTaskCount: 7 },
            { id: "4", projectName: "Project 4", projectTaskCount: 2 },
          ]}
          activeId={activeTabId}
          onChange={setActiveTabId}
        />
        <FilterSectionTask
          label="ПО СРОКАМ"
          value={sort}
          onValueChange={setSort}
          menulist={SORT_OPTIONS}
        />
        <StatusTab items={STATUS_TABS} activeId={statusId} onChange={setStatusId} />

        {tasks
          .filter((task) => task.statusId === statusId)
          .map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              checked={task.checked}
              onCheckedChange={(checked) => updateTask(task.id, { checked })}
              flagged={task.flagged}
              onFlagClick={() => updateTask(task.id, { flagged: !task.flagged })}
              dateRangeLabel={task.dateRangeLabel}
              subtaskCountLabel={task.subtaskCountLabel}
              fileCount={task.fileCount}
              members={task.members}
              overflowCount={task.overflowCount}
              statusLabel={task.statusLabel}
              statusColor={task.statusColor}
              expanded={task.expanded}
              onToggleExpanded={() => updateTask(task.id, { expanded: !task.expanded })}
              description={task.description}
              projectTag={task.projectTag}
              subtasks={task.subtasks}
              onSubtaskChange={(id, checked) =>
                updateTask(task.id, {
                  subtasks: task.subtasks.map((s) => (s.id === id ? { ...s, checked } : s)),
                })
              }
              photos={task.photos}
              onAddPhoto={() =>
                updateTask(task.id, {
                  photos: [
                    ...task.photos,
                    {
                      id: `p${task.photos.length + 1}`,
                      url: `https://picsum.photos/seed/${task.id}-${task.photos.length + 1}/96`,
                    },
                  ],
                })
              }
              files={task.files}
              onDownloadFile={() => {}}
              onAttachFile={() => {}}
              onDelete={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
              onEdit={() => {}}
            />
          ))}
      </div>
    </div>
  );
}
