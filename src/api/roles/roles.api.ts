import { axiosInstance } from "@/api-config/axiosInstance";
import type { Role } from "@/types/role.types";

export const rolesApi = {
  list: () => axiosInstance.get<Role[]>("/roles").then((r) => r.data),
};
