import { create } from "zustand";
import type { WorkspaceSummary } from "@/types/workspace.types";

export type { WorkspaceSummary };

export interface ProjectFilter {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  count: number;
}

const SELECTED_WORKSPACE_KEY = "qubnix_selected_workspace";

/**
 * Backend'da workspace ro'yxati endpointi yo'q — vaqtincha mock.
 * Mobil /doska o'z mock qatlamini shu ro'yxat ustiga quradi
 * (widgets/features/mobile/doska/lib/doska.mock.ts), shuning uchun
 * ma'lumot ikki joyda takrorlanmaydi.
 */
export const MOCK_WORKSPACES: WorkspaceSummary[] = [
  { id: "synapse", name: "Synapse", initials: "S", orgName: "RZB Tech", tasksCount: 4, projectsCount: 8, todayCount: 4 },
  { id: "qubnix", name: "Qubnix", initials: "Q", orgName: "ABSC company", tasksCount: 2, projectsCount: 3, todayCount: 2 },
  { id: "monitoring", name: "Monitoring", initials: "M", orgName: "UZ Academy", tasksCount: 3, projectsCount: 5, todayCount: 3 },
];

const MOCK_PROJECT_FILTERS: ProjectFilter[] = [
  { id: "all", workspaceId: "synapse", name: "Barcha loyihalar", color: "#9ca3af", count: 11 },
  { id: "redizayn", workspaceId: "synapse", name: "Redizayn", color: "#7429e0", count: 5 },
  { id: "mijoz", workspaceId: "synapse", name: "Mijoz", color: "#0ea5e9", count: 4 },
  { id: "marketing", workspaceId: "synapse", name: "Marketing", color: "#f97316", count: 2 },
  { id: "all", workspaceId: "qubnix", name: "Barcha loyihalar", color: "#9ca3af", count: 3 },
  { id: "all", workspaceId: "monitoring", name: "Barcha loyihalar", color: "#9ca3af", count: 0 },
];

interface WorkspaceState {
  /** Desktop sidebar/picker uchun sinxron ro'yxat. */
  workspaces: WorkspaceSummary[];
  selectedWorkspaceId: string | null;
  selectedFilterId: string | null;
  selectWorkspace: (id: string) => void;
  selectFilter: (id: string) => void;
  filtersForSelected: () => ProjectFilter[];
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: MOCK_WORKSPACES,
  selectedWorkspaceId: localStorage.getItem(SELECTED_WORKSPACE_KEY),
  selectedFilterId: "all",
  selectWorkspace: (id) => {
    localStorage.setItem(SELECTED_WORKSPACE_KEY, id);
    set({ selectedWorkspaceId: id, selectedFilterId: "all" });
  },
  selectFilter: (id) => set({ selectedFilterId: id }),
  filtersForSelected: () =>
    MOCK_PROJECT_FILTERS.filter((f) => f.workspaceId === get().selectedWorkspaceId),
}));
