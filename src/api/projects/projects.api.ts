import { api } from "@/api-config/axiosInstance";
import type {
  AvailableProjectMember,
  CreateProjectRequest,
  ListProjectsParams,
  ProjectMemberInput,
  RawProject,
  RawProjectMember,
  UpdateProjectRequest,
} from "@/api/projects/projects.types";
import type { Pagination } from "@/types/common";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

export const projectsApi = {
  /** Nom bo'yicha eng yangisi birinchi. */
  list: (organizationID: string, params?: ListProjectsParams) =>
    api
      .get<
        ApiEnvelope<{ projects: RawProject[]; pagination: Pagination }>
      >(`/api/v1/organizations/${organizationID}/projects`, { params })
      .then((r) => r.data.data),

  getById: (organizationID: string, projectId: string) =>
    api
      .get<
        ApiEnvelope<{ project: RawProject }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}`)
      .then((r) => r.data.data.project),

  /** Faqat owner/admin. `description` maydoni yo'q — backend qabul qilmaydi. */
  create: (organizationID: string, payload: CreateProjectRequest) =>
    api
      .post<
        ApiEnvelope<{ project: RawProject }>
      >(`/api/v1/organizations/${organizationID}/projects`, { data: payload })
      .then((r) => r.data.data.project),

  /** Nom va/yoki a'zolar ro'yxatini tahrirlash — bittasi. `members` yuborilsa to'liq almashadi. */
  update: (
    organizationID: string,
    projectId: string,
    payload: UpdateProjectRequest,
  ) =>
    api
      .patch<
        ApiEnvelope<{ project: RawProject }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}`, {
        data: payload,
      })
      .then((r) => r.data.data.project),

  /** Faqat owner/admin — proyekt, vazifalari va a'zo bog'lanishlari bilan birga BUTUNLAY o'chadi (soft-delete emas). */
  remove: (organizationID: string, projectId: string) =>
    api
      .delete<
        ApiEnvelope<{ deleted: true }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}`)
      .then((r) => r.data.data.deleted),

  /** Loyihaga biriktirilgan xodimlar ro'yxati. */
  listMembers: (organizationID: string, projectId: string) =>
    api
      .get<
        ApiEnvelope<{ members: RawProjectMember[] }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/members`)
      .then((r) => r.data.data.members),

  /** Tashkilot xodimlarini loyihaga rol bilan qo'shadi — 1 dan 500 tagacha. */
  addMembers: (
    organizationID: string,
    projectId: string,
    members: ProjectMemberInput[],
  ) =>
    api
      .post<
        ApiEnvelope<{ members: RawProjectMember[] }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/members`, {
        data: { members },
      })
      .then((r) => r.data.data.members),

  /** Bitta xodimni loyihadan olib tashlaydi. */
  removeMember: (organizationID: string, projectId: string, userId: string) =>
    api
      .delete<
        ApiEnvelope<{ deleted: true }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/members/${userId}`)
      .then((r) => r.data.data.deleted),

  /** Tashkilotning shu loyihaga hali qo'shilmagan xodimlari — "qo'shish" paneli uchun. */
  listAvailableMembers: (organizationID: string, projectId: string) =>
    api
      .get<
        ApiEnvelope<{ members: AvailableProjectMember[] }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/members/available`)
      .then((r) => r.data.data.members),
};
