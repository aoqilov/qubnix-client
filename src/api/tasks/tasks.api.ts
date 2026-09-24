import { api } from "@/api-config/axiosInstance";
import type {
  CreateTaskRequest,
  ListTasksParams,
  ListTasksResponse,
  RawTask,
  TaskCalendarDay,
  TaskStatistics,
  TaskStatisticsType,
  UpdateTaskRequest,
} from "@/api/tasks/tasks.types";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

export const tasksApi = {
  /** Faqat joriy foydalanuvchiga biriktirilgan vazifalar — `date` davr ichidagi istalgan kun. */
  statistics: (organizationID: string, type: TaskStatisticsType, date: string) =>
    api
      .get<
        ApiEnvelope<TaskStatistics>
      >(`/api/v1/organizations/${organizationID}/tasks/statistics`, { params: { type, date } })
      .then((r) => r.data.data),

  /** Foydalanuvchi roli ko'radigan barcha loyihalar bo'yicha — `date` YYYY-MM-DD. */
  calendar: (organizationID: string, date: string) =>
    api
      .get<
        ApiEnvelope<TaskCalendarDay>
      >(`/api/v1/organizations/${organizationID}/tasks/calendar`, { params: { date } })
      .then((r) => r.data.data),

  list: (organizationID: string, projectId: string, params?: ListTasksParams) =>
    api
      .get<
        ApiEnvelope<ListTasksResponse>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/tasks`, { params })
      .then((r) => r.data.data),

  getById: (organizationID: string, projectId: string, taskId: string) =>
    api
      .get<
        ApiEnvelope<{ task: RawTask }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/tasks/${taskId}`)
      .then((r) => r.data.data.task),

  create: (organizationID: string, projectId: string, payload: CreateTaskRequest) =>
    api
      .post<
        ApiEnvelope<{ task: RawTask }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/tasks`, {
        data: payload,
      })
      .then((r) => r.data.data.task),

  update: (
    organizationID: string,
    projectId: string,
    taskId: string,
    payload: UpdateTaskRequest,
  ) =>
    api
      .patch<
        ApiEnvelope<{ task: RawTask }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/tasks/${taskId}`, {
        data: payload,
      })
      .then((r) => r.data.data.task),

  remove: (organizationID: string, projectId: string, taskId: string) =>
    api
      .delete<
        ApiEnvelope<{ deleted: true }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/tasks/${taskId}`)
      .then((r) => r.data.data.deleted),
};
