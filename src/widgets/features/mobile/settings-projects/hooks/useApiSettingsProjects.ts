import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/api/projects/projects.api";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { todayApiDate } from "@/utils/apiDate";
import type {
  CreateProjectRequest,
  RawProject,
  UpdateProjectRequest,
} from "@/api/projects/projects.types";
import type { RawOrganizationMember } from "@/api/organizations/organizations.types";
import type { MemberPickerItem } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import { initialsOf } from "../lib/initialsOf";
import type { ProjectStatsItem } from "../types";

function toProjectStatsItem(p: RawProject): ProjectStatsItem {
  const members = p.members.map((m) => ({
    id: String(m.user_id),
    initials: initialsOf(`${m.first_name} ${m.last_name}`),
    name: `${m.first_name} ${m.last_name}`,
    avatarUrl: m.telegram_avatar_url ?? undefined,
    role: m.role,
  }));

  return {
    id: String(p.id),
    name: p.name,
    initials: initialsOf(p.name),
    done: p.task_counts.total,
    completed: p.task_counts.done,
    inProgress: p.task_counts.in_progress,
    overdue: p.task_counts.not_done,
    percent:
      p.task_counts.total > 0
        ? Math.round((p.task_counts.done / p.task_counts.total) * 100)
        : 0,
    members,
    overflowCount: members.length > 3 ? members.length - 3 : undefined,
  };
}

function toMemberPickerItem(m: RawOrganizationMember): MemberPickerItem {
  return { id: String(m.id), name: `${m.first_name} ${m.last_name}` };
}

export const PROJECTS_KEYS = {
  list: (organizationId: string) => ["organizations", organizationId, "projects"] as const,
  available: (organizationId: string, projectId: string) =>
    ["organizations", organizationId, "projects", projectId, "members", "available"] as const,
  orgMembers: (organizationId: string) => ["organizations", organizationId, "members"] as const,
};

export function useProjectsList(organizationId: string | null) {
  return useQuery({
    queryKey: PROJECTS_KEYS.list(organizationId ?? ""),
    // task_counts 2026 boshidan bugungacha bo'lgan oraliq bo'yicha hisoblanadi.
    queryFn: () =>
      projectsApi.list(organizationId!, {
        limit: 100,
        from: "2026-01-01",
        to: todayApiDate(),
      }),
    select: (data) => data.projects.map(toProjectStatsItem),
    enabled: !!organizationId,
  });
}

export function useCreateProject(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectRequest) => projectsApi.create(organizationId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEYS.list(organizationId ?? "") });
    },
  });
}

export function useUpdateProject(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: UpdateProjectRequest;
    }) => projectsApi.update(organizationId!, projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEYS.list(organizationId ?? "") });
    },
  });
}

export function useDeleteProject(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.remove(organizationId!, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEYS.list(organizationId ?? "") });
    },
  });
}

/** `enabled` — chaqiruvchi "sotrudnik qo'shish" paneli ochiqligini bildiradi. */
export function useAvailableProjectMembers(
  organizationId: string | null,
  projectId: string | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: PROJECTS_KEYS.available(organizationId ?? "", projectId ?? ""),
    queryFn: () => projectsApi.listAvailableMembers(organizationId!, projectId!),
    select: (members) => members.map(toMemberPickerItem),
    enabled: enabled && !!organizationId && !!projectId,
  });
}

/** Yangi loyiha yaratishda tanlanadigan xodimlar — hali project_id yo'q, shu sabab tashkilot bo'yicha. */
export function useOrgMembersForNewProject(organizationId: string | null) {
  return useQuery({
    queryKey: PROJECTS_KEYS.orgMembers(organizationId ?? ""),
    queryFn: () => organizationsApi.listMembers(organizationId!, { limit: 100 }),
    select: (data) => data.members.map(toMemberPickerItem),
    enabled: !!organizationId,
  });
}
