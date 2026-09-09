import { axiosInstance } from "@/api-config/axiosInstance";
import type { Tariff, Workspace } from "@/types/workspace.types";

export const workspaceApi = {
  current: () => axiosInstance.get<Workspace>("/workspace").then((r) => r.data),
  tariffs: () => axiosInstance.get<Tariff[]>("/workspace/tariffs").then((r) => r.data),
  buy: (tariffId: string) =>
    axiosInstance.post<{ redirectUrl: string }>("/workspace/buy", { tariffId }).then((r) => r.data),
};
