import { axiosInstance } from "@/api-config/axiosInstance";
import type { CreateProjectRequest, Project } from "@/types/project.types";
import type { Paginated } from "@/types/common.types";

export const projectsApi = {
  list: () => axiosInstance.get<Paginated<Project>>("/projects").then((r) => r.data),
  getById: (id: string) => axiosInstance.get<Project>(`/projects/${id}`).then((r) => r.data),
  create: (payload: CreateProjectRequest) =>
    axiosInstance.post<Project>("/projects", payload).then((r) => r.data),
  update: (id: string, payload: Partial<CreateProjectRequest>) =>
    axiosInstance.patch<Project>(`/projects/${id}`, payload).then((r) => r.data),
  remove: (id: string) => axiosInstance.delete<void>(`/projects/${id}`).then((r) => r.data),
  addMember: (id: string, employeeId: string) =>
    axiosInstance.post<Project>(`/projects/${id}/members`, { employeeId }).then((r) => r.data),
};
