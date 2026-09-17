import { api } from "@/api-config/axiosInstance";
import type {
  CreateProjectRequest,
  ListProjectsParams,
  RawProject,
  UpdateProjectRequest,
} from "@/api/projects/projects.types";
import type { Pagination } from "@/types/common";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

export const projectsApi = {
  /** Arxivlanganlar include_archived=true bo'lmasa ko'rinmaydi. Nom bo'yicha eng yangisi birinchi. */
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

  /** Tahrirlash/arxivlash/qaytarish — bittasi. `members` yuborilsa to'liq almashadi. */
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

  /** Faqat owner/admin, soft-delete — loyiha + uning vazifalari. */
  remove: (organizationID: string, projectId: string) =>
    api
      .delete<
        ApiEnvelope<{ deleted: true }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}`)
      .then((r) => r.data.data.deleted),
};
