import type { RawTask } from "@/api/tasks/tasks.types";
import { toTaskMemberCard } from "../hooks/useApiTasks";
import { TASK_STATUS_META } from "@/components/shared/task-card/taskStatusMeta";

/** RawTask -> qator/karta/drawer uchun tayyor ko'rinish (fayllar ajratilgan, a'zolar kartaga aylantirilgan). */
export function toTaskView(task: RawTask) {
  const meta = TASK_STATUS_META.find((m) => m.countKey === task.status) ?? TASK_STATUS_META[0];
  const audio = task.files.find((f) => f.kind === "description_audio");
  const attachments = task.files.filter((f) => f.kind === "attachment");
  return {
    meta,
    members: task.members.map(toTaskMemberCard),
    doneSubtasks: task.subtasks.filter((s) => s.checked).length,
    subtasks: task.subtasks.map((s) => ({ id: String(s.id), label: s.name, checked: s.checked })),
    descriptionText: task.description_type === "text" ? (task.description ?? "") : "",
    descriptionAudio: audio ? { url: audio.url, durationLabel: "0:00" } : undefined,
    attachmentsCount: attachments.length,
    photos: attachments
      .filter((f) => f.mime_type.startsWith("image/"))
      .map((f) => ({ id: String(f.id), url: f.url })),
    files: attachments
      .filter((f) => !f.mime_type.startsWith("image/"))
      .map((f) => ({ id: String(f.id), name: f.file_name, sizeLabel: `${Math.round(f.size_bytes / 1024)} KB` })),
  };
}

export type TaskView = ReturnType<typeof toTaskView>;
