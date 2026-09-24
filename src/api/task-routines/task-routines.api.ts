import { api } from "@/api-config/axiosInstance";
import type {
  CreateTaskRoutineRequest,
  RawTaskRoutine,
  RoutineFrequency,
  RunTaskRoutineResult,
  UpdateTaskRoutineRequest,
} from "@/api/task-routines/task-routines.types";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

/**
 * Backend `end_time` ni hali qabul qilmaydi — so'rov sxemasi
 * `additionalProperties: false`, noma'lum maydon 400 qaytaradi. Backend
 * qo'shganda shu flag'ni `true` qiling; forma va tiplar o'zgarmaydi.
 */
const BACKEND_SUPPORTS_END_TIME = false;

function toRoutineBody<T extends { end_time?: string }>(payload: T): T {
  if (BACKEND_SUPPORTS_END_TIME) return payload;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { end_time, ...rest } = payload;
  return rest as T;
}

export const taskRoutinesApi = {
  list: (organizationID: string, projectId: string, type?: RoutineFrequency) =>
    api
      .get<
        ApiEnvelope<{ routines: RawTaskRoutine[] }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/task-routines`, {
        params: type ? { type } : undefined,
      })
      .then((r) => r.data.data.routines),

  getById: (organizationID: string, projectId: string, routineId: string) =>
    api
      .get<
        ApiEnvelope<{ routine: RawTaskRoutine }>
      >(
        `/api/v1/organizations/${organizationID}/projects/${projectId}/task-routines/${routineId}`,
      )
      .then((r) => r.data.data.routine),

  create: (organizationID: string, projectId: string, payload: CreateTaskRoutineRequest) =>
    api
      .post<
        ApiEnvelope<{ routine: RawTaskRoutine }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/task-routines`, {
        data: toRoutineBody(payload),
      })
      .then((r) => r.data.data.routine),

  update: (
    organizationID: string,
    projectId: string,
    routineId: string,
    payload: UpdateTaskRoutineRequest,
  ) =>
    api
      .patch<
        ApiEnvelope<{ routine: RawTaskRoutine }>
      >(
        `/api/v1/organizations/${organizationID}/projects/${projectId}/task-routines/${routineId}`,
        { data: toRoutineBody(payload) },
      )
      .then((r) => r.data.data.routine),

  remove: (organizationID: string, projectId: string, routineId: string) =>
    api
      .delete<
        ApiEnvelope<{ deleted: true }>
      >(
        `/api/v1/organizations/${organizationID}/projects/${projectId}/task-routines/${routineId}`,
      )
      .then((r) => r.data.data.deleted),

  /** Routine'dan hozir bitta task nusxasini yaratadi — "Takrorlanuvchi" vazifa saqlangach, ro'yxatda darhol ko'rinishi uchun. */
  run: (organizationID: string, projectId: string, routineId: string) =>
    api
      .post<
        ApiEnvelope<{ result: RunTaskRoutineResult }>
      >(
        `/api/v1/organizations/${organizationID}/projects/${projectId}/task-routines/${routineId}/run`,
      )
      .then((r) => r.data.data.result),
};
