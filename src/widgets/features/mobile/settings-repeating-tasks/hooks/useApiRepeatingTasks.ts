import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/api/projects/projects.api";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { taskRoutinesApi } from "@/api/task-routines/task-routines.api";
import type {
  CreateTaskRoutineRequest,
  RawTaskRoutine,
  UpdateTaskRoutineRequest,
} from "@/api/task-routines/task-routines.types";

export const ROUTINES_KEYS = {
  /** Bitta `["organizations", id, "projects"]` prefiksi ostida — boshqa
   * loyiha/vazifa so'rovlari bilan bitta `invalidateQueries` orqali yangilanadi. */
  list: (organizationId: string, projectId: string) =>
    ["organizations", organizationId, "projects", projectId, "task-routines"] as const,
};

/** Filtr/tanlov uchun — tashkilotdagi barcha loyihalar (nomi kifoya). */
export function useOrgProjectsForRoutines(organizationId: string | null) {
  return useQuery({
    queryKey: ["organizations", organizationId ?? "", "projects", "for-routines"] as const,
    queryFn: () => projectsApi.list(organizationId!, { limit: 100 }),
    select: (data) => data.projects.map((p) => ({ id: String(p.id), name: p.name })),
    enabled: !!organizationId,
  });
}

/** "Barcha loyihalar" ko'rinishi uchun — har bir loyihaning routine ro'yxati parallel so'raladi va birlashtiriladi. */
export function useRoutinesForProjects(
  organizationId: string | null,
  projects: { id: string; name: string }[],
) {
  const results = useQueries({
    queries: projects.map((project) => ({
      queryKey: ROUTINES_KEYS.list(organizationId ?? "", project.id),
      queryFn: () => taskRoutinesApi.list(organizationId!, project.id),
      enabled: !!organizationId,
    })),
  });

  const isPending = !!organizationId && projects.length > 0 && results.some((r) => r.isPending);
  const isError = results.some((r) => r.isError);
  const routines: (RawTaskRoutine & { projectName: string })[] = results.flatMap(
    (r, i) => r.data?.map((routine) => ({ ...routine, projectName: projects[i].name })) ?? [],
  );

  return { routines, isPending, isError };
}

/** Routine kartalarida a'zo ism/ismi bosh harflarini ko'rsatish uchun — butun tashkilot xodimlari. */
export function useOrgMembersDirectory(organizationId: string | null) {
  return useQuery({
    queryKey: ["organizations", organizationId ?? "", "members", "directory"] as const,
    queryFn: () => organizationsApi.listMembers(organizationId!, { limit: 500 }),
    select: (data) => data.members,
    enabled: !!organizationId,
  });
}

/** Routine yaratish formasidagi "Сотрудники" checklist'i uchun — tanlangan loyihaga biriktirilgan xodimlar. */
export function useProjectMembersForRoutine(
  organizationId: string | null,
  projectId: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["organizations", organizationId ?? "", "projects", projectId, "members"] as const,
    queryFn: () => projectsApi.listMembers(organizationId!, projectId),
    enabled: enabled && !!organizationId && !!projectId,
  });
}

function useInvalidateRoutines(organizationId: string | null) {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ["organizations", organizationId ?? "", "projects"],
    });
}

export function useCreateRoutine(organizationId: string | null) {
  const invalidate = useInvalidateRoutines(organizationId);
  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: CreateTaskRoutineRequest;
    }) => taskRoutinesApi.create(organizationId!, projectId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateRoutine(organizationId: string | null) {
  const invalidate = useInvalidateRoutines(organizationId);
  return useMutation({
    mutationFn: ({
      projectId,
      routineId,
      payload,
    }: {
      projectId: string;
      routineId: string;
      payload: UpdateTaskRoutineRequest;
    }) => taskRoutinesApi.update(organizationId!, projectId, routineId, payload),
    onSuccess: invalidate,
  });
}
