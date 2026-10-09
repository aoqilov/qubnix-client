import type { TaskModalAddValues } from "@/components/shared/task-modals/TaskModalAdd";
import type { TaskModalEditValues } from "@/components/shared/task-modals/TaskModalEdit";
import {
  useCreateTask,
  useRemoveTaskFile,
  useUpdateTask,
  useUploadTaskFile,
} from "@/queries/tasks.queries";

type DescriptionPayload = string | { type: "audio"; file_id: number } | null | undefined;

interface UseTaskSubmitOptions {
  organizationId: string | null;
  projectId: string;
  /** Personal'da xodim tanlanmaydi — yaratishda o'ziga biriktiriladi, tahrirlashda `members` yuborilmaydi. */
  isPersonal: boolean;
  currentUserId: string | number | undefined;
}

/**
 * Vazifa qo'shish/tahrirlash formasi qiymatlarini backend so'rovlariga aylantiradi:
 * ovozli izoh va fayllarni yuklaydi, olib tashlanganlarini o'chiradi, keyin create/update.
 * Xato bo'lsa qayta tashlaydi — modal ochiq qoladi, xabarni chaqiruvchi ko'rsatadi.
 * (Mobil FeatureTasks'da shu mantiqning o'z nusxasi bor — hozircha tegilmagan.)
 */
export function useTaskSubmit({ organizationId, projectId, isPersonal, currentUserId }: UseTaskSubmitOptions) {
  const createTask = useCreateTask(organizationId, projectId);
  const updateTask = useUpdateTask(organizationId, projectId);
  const uploadFile = useUploadTaskFile(organizationId, projectId);
  const removeFile = useRemoveTaskFile(organizationId, projectId);

  async function uploadAudio(blob: Blob): Promise<number> {
    const audioFile = new File([blob], "voice-note.webm", { type: blob.type || "audio/webm" });
    const uploaded = await uploadFile.mutateAsync({ file: audioFile, kind: "description_audio" });
    return uploaded[0].id;
  }

  async function uploadAttachments(files: { file: File }[]): Promise<number[] | undefined> {
    if (files.length === 0) return undefined;
    const uploads = await Promise.all(
      files.map((f) => uploadFile.mutateAsync({ file: f.file, kind: "attachment" })),
    );
    return uploads.flatMap((uploaded) => uploaded.map((f) => f.id));
  }

  async function addTask(values: TaskModalAddValues) {
    if (!organizationId || !projectId) return;
    let description: DescriptionPayload;
    if (values.descriptionAudio) {
      description = { type: "audio", file_id: await uploadAudio(values.descriptionAudio.blob) };
    } else if (values.description) {
      description = values.description;
    }

    const members = isPersonal
      ? currentUserId
        ? [{ user_id: Number(currentUserId) }]
        : []
      : values.assignees.map((a) => ({ user_id: Number(a.id) }));

    await createTask.mutateAsync({
      title: values.title,
      members,
      description: description ?? undefined,
      priority: values.priority,
      start_at: values.startAt,
      due_at: values.dueAt,
      file_ids: await uploadAttachments(values.files),
      subtasks: values.subtasks.map((s) => ({ name: s.label, checked: s.checked })),
    });
  }

  async function editTask(taskId: string, values: TaskModalEditValues) {
    if (!organizationId || !projectId) return;
    let description: DescriptionPayload;
    if (values.descriptionMode === "text") {
      description = values.description;
    } else if (values.descriptionAudio) {
      description = { type: "audio", file_id: await uploadAudio(values.descriptionAudio.blob) };
    } else if (values.audioRemoved) {
      description = null;
      if (values.removedAudioFileId) {
        await removeFile.mutateAsync({ taskId, fileId: values.removedAudioFileId });
      }
    }
    // aks holda (ovozli izoh o'zgarmagan) — description umuman yuborilmaydi.

    for (const fileId of values.removedFileIds) {
      await removeFile.mutateAsync({ taskId, fileId });
    }

    await updateTask.mutateAsync({
      taskId,
      payload: {
        title: values.title,
        members: isPersonal ? undefined : values.assignees.map((a) => ({ user_id: Number(a.id) })),
        description,
        priority: values.priority,
        start_at: values.startAt,
        due_at: values.dueAt,
        file_ids: await uploadAttachments(values.newFiles),
        subtasks: values.subtasks.map((s) => ({ name: s.label, checked: s.checked })),
      },
    });
  }

  return { addTask, editTask, updateTask };
}
