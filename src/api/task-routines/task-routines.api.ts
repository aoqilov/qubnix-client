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
        data: payload,
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
        { data: payload },
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
