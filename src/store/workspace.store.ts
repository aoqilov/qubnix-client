import { create } from "zustand";

export interface WorkspaceSummary {
  id: string;
  name: string;
  initials: string;
  color: string;
  projectsCount: number;
  todayCount: number;
}

export interface ProjectFilter {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  count: number;
}

const SELECTED_WORKSPACE_KEY = "qubnix_selected_workspace";

const MOCK_WORKSPACES: WorkspaceSummary[] = [
  { id: "studio-delta", name: "Studio Delta", initials: "SD", color: "#7429e0", projectsCount: 8, todayCount: 4 },
  { id: "nextech", name: "NexTech LLC", initials: "NT", color: "#2563eb", projectsCount: 3, todayCount: 0 },
  { id: "uz-akademiya", name: "UZ Akademiya", initials: "UZ", color: "#059669", projectsCount: 0, todayCount: 0 },
];

const MOCK_PROJECT_FILTERS: ProjectFilter[] = [
  { id: "all", workspaceId: "studio-delta", name: "Barcha loyihalar", color: "#9ca3af", count: 11 },
  { id: "redizayn", workspaceId: "studio-delta", name: "Redizayn", color: "#7429e0", count: 5 },
  { id: "mijoz", workspaceId: "studio-delta", name: "Mijoz", color: "#0ea5e9", count: 4 },
  { id: "marketing", workspaceId: "studio-delta", name: "Marketing", color: "#f97316", count: 2 },
  { id: "all", workspaceId: "nextech", name: "Barcha loyihalar", color: "#9ca3af", count: 3 },
  { id: "all", workspaceId: "uz-akademiya", name: "Barcha loyihalar", color: "#9ca3af", count: 0 },
];

interface WorkspaceState {
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
