import { axiosInstance } from "@/api-config/axiosInstance";
import type { Employee, InviteEmployeeRequest } from "@/types/employee.types";
import type { Paginated } from "@/types/common.types";

export const employeesApi = {
  list: () => axiosInstance.get<Paginated<Employee>>("/employees").then((r) => r.data),
  getById: (id: string) => axiosInstance.get<Employee>(`/employees/${id}`).then((r) => r.data),
  invite: (payload: InviteEmployeeRequest) =>
    axiosInstance.post<Employee>("/employees/invite", payload).then((r) => r.data),
  changeRole: (id: string, roleId: string) =>
    axiosInstance.patch<Employee>(`/employees/${id}/role`, { roleId }).then((r) => r.data),
};
