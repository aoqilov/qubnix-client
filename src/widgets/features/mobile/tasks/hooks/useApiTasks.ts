import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/api/projects/projects.api";
import type { RawProjectMember } from "@/api/projects/projects.types";
import { tasksApi } from "@/api/tasks/tasks.api";
import type {
  CreateTaskRequest,
  ListTasksParams,
  UpdateTaskRequest,
} from "@/api/tasks/tasks.types";
import { taskFilesApi } from "@/api/task-files/task-files.api";
import type { TaskFileKind } from "@/api/task-files/task-files.types";
import type { RawTaskMember } from "@/api/tasks/tasks.types";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";

/** "Malika Qodirova" -> "MQ", bitta so'z bo'lsa -> shu so'zning birinchi 2 harfi. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
}

function toProjectMemberCard(m: RawProjectMember): TaskCardMember {
  const name = `${m.first_name} ${m.last_name}`;
  return {
    id: String(m.user_id),
    name,
    initials: initialsOf(name),
    avatarUrl: m.telegram_avatar_url ?? undefined,
  };
}

/** Bitta vazifaga biriktirilgan xodim (task javobidagi `members[]`) -> TaskCard shakli. */
export function toTaskMemberCard(m: RawTaskMember): TaskCardMember {
  const name = `${m.first_name} ${m.last_name}`;
  return {
    id: String(m.user_id),
    name,
    initials: initialsOf(name),
    avatarUrl: m.telegram_avatar_url ?? undefined,
  };
}

export const TASKS_KEYS = {
  /** Bitta `["organizations", id, "projects"]` prefiksi ostida — loyihalar ro'yxati
   * (task_counts) bilan birga bitta `invalidateQueries` chaqiruvi ikkalasini ham yangilaydi. */
  list: (organizationId: string, projectId: string, params: ListTasksParams) =>
    ["organizations", organizationId, "projects", projectId, "tasks", params] as const,
  projectMembers: (organizationId: string, projectId: string) =>
    ["organizations", organizationId, "projects", projectId, "members"] as const,
};

/** Vazifa yaratishda "Сотрудники" checklist'i uchun — shu loyihaga biriktirilgan xodimlar. */
export function useProjectMembersForTask(
  organizationId: string | null,
  projectId: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: TASKS_KEYS.projectMembers(organizationId ?? "", projectId),
    queryFn: () => projectsApi.listMembers(organizationId!, projectId),
    select: (members) => members.map(toProjectMemberCard),
    enabled: enabled && !!organizationId && !!projectId,
  });
}

export function useTasksList(
  organizationId: string | null,
  projectId: string,
  params: ListTasksParams,
) {
  return useQuery({
    queryKey: TASKS_KEYS.list(organizationId ?? "", projectId, params),
    queryFn: () => tasksApi.list(organizationId!, projectId, params),
    enabled: !!organizationId && !!projectId,
  });
}

function useInvalidateTasks(organizationId: string | null) {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ["organizations", organizationId ?? "", "projects"],
    });
}

export function useCreateTask(organizationId: string | null, projectId: string) {
  const invalidate = useInvalidateTasks(organizationId);
  return useMutation({
    mutationFn: (payload: CreateTaskRequest) =>
      tasksApi.create(organizationId!, projectId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateTask(organizationId: string | null, projectId: string) {
  const invalidate = useInvalidateTasks(organizationId);
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskRequest }) =>
      tasksApi.update(organizationId!, projectId, taskId, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteTask(organizationId: string | null, projectId: string) {
  const invalidate = useInvalidateTasks(organizationId);
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.remove(organizationId!, projectId, taskId),
    onSuccess: invalidate,
  });
}

/** Fayl(lar)ni yuklab, keyin task yaratish/tahrirlashda `file_ids`/`file_id` sifatida ishlatish uchun. */
export function useUploadTaskFile(organizationId: string | null, projectId: string) {
  return useMutation({
    mutationFn: ({ file, kind }: { file: File; kind?: TaskFileKind }) =>
      taskFilesApi.upload(organizationId!, projectId, file, kind),
  });
}

/** Tahrirlashda mavjud attachment'ni taskdan olib tashlash uchun. */
export function useRemoveTaskFile(organizationId: string | null, projectId: string) {
  const invalidate = useInvalidateTasks(organizationId);
  return useMutation({
    mutationFn: ({ taskId, fileId }: { taskId: string; fileId: string }) =>
      taskFilesApi.remove(organizationId!, projectId, taskId, fileId),
    onSuccess: invalidate,
  });
}
