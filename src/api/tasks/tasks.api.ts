import { axiosInstance } from "@/api-config/axiosInstance";
import type { CreateTaskRequest, Task, TaskStatus } from "@/types/task.types";
import type { Paginated } from "@/types/common.types";

export const tasksApi = {
  list: (params?: { status?: TaskStatus; projectId?: string }) =>
    axiosInstance.get<Paginated<Task>>("/tasks", { params }).then((r) => r.data),
  getById: (id: string) => axiosInstance.get<Task>(`/tasks/${id}`).then((r) => r.data),
  create: (payload: CreateTaskRequest) =>
    axiosInstance.post<Task>("/tasks", payload).then((r) => r.data),
  updateStatus: (id: string, status: TaskStatus) =>
    axiosInstance.patch<Task>(`/tasks/${id}/status`, { status }).then((r) => r.data),
};
