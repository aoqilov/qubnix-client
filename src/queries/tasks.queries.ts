import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/api/projects/projects.api";
import type { RawProjectMember } from "@/api/projects/projects.types";
import { tasksApi } from "@/api/tasks/tasks.api";
import type {
  CreateTaskRequest,
  ListTasksParams,
  ListTasksResponse,
  UpdateTaskRequest,
} from "@/api/tasks/tasks.types";
import { taskFilesApi } from "@/api/task-files/task-files.api";
import type { TaskFileKind } from "@/api/task-files/task-files.types";
import type { RawTaskMember } from "@/api/tasks/tasks.types";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { DOSKA_KEYS } from "@/queries/doska.queries";
/**
 * /tasks — mobil va desktop uchun umumiy qatlam: kalitlar, so'rovlar, mutation'lar.
 * Platforma feature'lari (`widgets/features/<platform>/tasks/hooks/useApiTasks.ts`)
 * shu yerdan oladi — kalit bitta bo'lgani uchun kesh va SSE yangilanishi ikkalasida ishlaydi.
 */

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
/** Task a'zosi ham, loyiha a'zosi ham bo'lishi mumkin — faqat ism/avatar maydonlari kerak. */
export function toTaskMemberCard(
  m: Pick<RawTaskMember, "user_id" | "first_name" | "last_name" | "telegram_avatar_url">,
): TaskCardMember {
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

/** Joriy foydalanuvchining shu tashkilotdagi workspace-rolini bilish uchun — "xodim bo'yicha filtr"ni faqat admin/owner/project_manager'ga ko'rsatish uchun kerak. */
export function useOrganizationRole(organizationId: string | null) {
  return useQuery({
    queryKey: ["organizations", organizationId ?? "", "role"] as const,
    queryFn: () => organizationsApi.getById(organizationId!),
    select: (org) => org.role,
    enabled: !!organizationId,
  });
}

/**
 * Tanlangan sanadagi loyihalar — `task_counts` shu sana bo'yicha hisoblanadi (tab va status sonlari).
 * Kalit `["organizations", id, "projects", ...]` prefiksi ostida — vazifa mutation'lari uni ham yangilaydi.
 */
export function useProjectsByDate(organizationId: string | null, date: string) {
  return useQuery({
    queryKey: ["organizations", organizationId, "projects", date] as const,
    queryFn: () => projectsApi.list(organizationId!, { limit: 100, date }),
    enabled: !!organizationId,
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

/** Vazifa mutation'laridan keyingi keshni yangilash — shu loyiha/tashkilotdagi ro'yxat va task_counts. */
function useInvalidateTasks(organizationId: string | null) {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ["organizations", organizationId ?? "", "projects"],
    });
}

/**
 * Doska/sidebar'dagi tasksCount — "bugungi vazifalar soni" (statusdan qat'i
 * nazar), shu prefiksdan tashqarida. Faqat vazifa soni o'zgarganda (yaratish/
 * o'chirish) kerak — status/tahrirlashda son o'zgarmaydi, shuning uchun
 * useUpdateTask'da yo'q (project ichida statusni tez-tez almashtirishda
 * keraksiz `organizations` so'rovi ketmasin deb).
 */
function useInvalidateWorkspaceCounts() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: DOSKA_KEYS.workspaces() });
    queryClient.invalidateQueries({ queryKey: DOSKA_KEYS.personal() });
  };
}

export function useCreateTask(organizationId: string | null, projectId: string) {
  const invalidate = useInvalidateTasks(organizationId);
  const invalidateCounts = useInvalidateWorkspaceCounts();
  return useMutation({
    mutationFn: (payload: CreateTaskRequest) =>
      tasksApi.create(organizationId!, projectId, payload),
    onSuccess: () => {
      invalidate();
      invalidateCounts();
    },
  });
}

/**
 * Kanban'da kartani ustundan-ustunga tashlaganda serverning javobini kutib
 * o'tirilsa, so'rov davomida karta eski ustunga "qaytib qolgandek" ko'rinadi
 * (kesh hali eski status bilan). Shuning uchun `status` o'zgarganda kesh
 * darhol (server javobini kutmay) yangilanadi — xato bo'lsa `onError` orqaga
 * qaytaradi. Boshqa maydonlar (members, subtasks...) turli shakl bo'lgani
 * uchun bu yo'l faqat `status`ga tegishli.
 */
export function useUpdateTask(organizationId: string | null, projectId: string) {
  const invalidate = useInvalidateTasks(organizationId);
  const queryClient = useQueryClient();
  const listPrefix = ["organizations", organizationId ?? "", "projects", projectId, "tasks"] as const;

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskRequest }) =>
      tasksApi.update(organizationId!, projectId, taskId, payload),
    onMutate: async ({ taskId, payload }) => {
      if (payload.status === undefined) return undefined;
      await queryClient.cancelQueries({ queryKey: listPrefix });
      const previous = queryClient.getQueriesData<ListTasksResponse>({ queryKey: listPrefix });
      queryClient.setQueriesData<ListTasksResponse>({ queryKey: listPrefix }, (data) => {
        if (!data) return data;
        return {
          ...data,
          tasks: data.tasks.map((task) =>
            String(task.id) === taskId ? { ...task, status: payload.status! } : task,
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSuccess: invalidate,
  });
}

export function useDeleteTask(organizationId: string | null, projectId: string) {
  const invalidate = useInvalidateTasks(organizationId);
  const invalidateCounts = useInvalidateWorkspaceCounts();
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.remove(organizationId!, projectId, taskId),
    onSuccess: () => {
      invalidate();
      invalidateCounts();
    },
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
