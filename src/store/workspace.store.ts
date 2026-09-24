import { create } from "zustand";
import type { OrganizationRole, OrganizationType } from "@/api/organizations/organizations.types";

/**
 * Mobil /doska real /api/v1/organizations'dan o'qiydi (o'z feature-local
 * hooki orqali — widgets/features/mobile/doska/hooks/useApiDoska.ts).
 * Desktop (Sidebar, WorkspacePicker) hali shu store'dagi mock ro'yxatdan
 * foydalanadi — keyingi bosqichda ular ham real API'ga o'tkaziladi.
 * Rang bu yerda saqlanmaydi — utils/avatarColor.ts dagi avatarColorVar(id)
 * dan olinadi, shunda dark temada avtomatik moslashadi.
 */
export interface WorkspaceSummary {
  id: string;
  name: string;
  /** Avatar doirasidagi harf(lar). */
  initials: string;
  /** O'ngdagi belgidagi son — "4 задачи". */
  tasksCount: number;
  /** Joriy foydalanuvchining shu tashkilotdagi roli — hozircha desktop mock'da yo'q. */
  role?: OrganizationRole;
  /**
   * Backend /organizations javobida hozircha yo'q — Sidebar/WorkspacePicker
   * shu maydon borida ko'rsatadi, bo'lmasa yashiradi.
   */
  projectsCount?: number;
  /** Backend'da hali yo'q — yuqoridagi izohga qarang. */
  todayCount?: number;
}

export interface ProjectFilter {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  count: number;
}

const SELECTED_WORKSPACE_KEY = "qubnix_selected_workspace";
/** "personal" — /doska'dagi "Личное" kartasi, "organization" — oddiy workspace. */
const SELECTED_WORKSPACE_TYPE_KEY = "qubnix_selected_workspace_type";

function readStoredWorkspaceType(): OrganizationType | null {
  const value = localStorage.getItem(SELECTED_WORKSPACE_TYPE_KEY);
  return value === "personal" || value === "organization" ? value : null;
}

/** Desktop hali mock — Sidebar/WorkspacePicker real API'ga o'tkazilmagan. */
export const MOCK_WORKSPACES: WorkspaceSummary[] = [
  { id: "synapse", name: "Synapse", initials: "S", tasksCount: 4, projectsCount: 8, todayCount: 4 },
  { id: "qubnix", name: "Qubnix", initials: "Q", tasksCount: 2, projectsCount: 3, todayCount: 2 },
  { id: "monitoring", name: "Monitoring", initials: "M", tasksCount: 3, projectsCount: 5, todayCount: 3 },
];

/** Loyiha filtrlari hali mock — /projects resursi ulanmagan. */
const MOCK_PROJECT_FILTERS: ProjectFilter[] = [
  {
    id: "all",
    workspaceId: "synapse",
    name: "Barcha loyihalar",
    color: "#9ca3af",
    count: 11,
  },
  {
    id: "redizayn",
    workspaceId: "synapse",
    name: "Redizayn",
    color: "#7429e0",
    count: 5,
  },
  {
    id: "mijoz",
    workspaceId: "synapse",
    name: "Mijoz",
    color: "#0ea5e9",
    count: 4,
  },
  {
    id: "marketing",
    workspaceId: "synapse",
    name: "Marketing",
    color: "#f97316",
    count: 2,
  },
  {
    id: "all",
    workspaceId: "qubnix",
    name: "Barcha loyihalar",
    color: "#9ca3af",
    count: 3,
  },
  {
    id: "all",
    workspaceId: "monitoring",
    name: "Barcha loyihalar",
    color: "#9ca3af",
    count: 0,
  },
];

interface WorkspaceState {
  /** Desktop sidebar/picker uchun sinxron ro'yxat (hali mock). */
  workspaces: WorkspaceSummary[];
  selectedWorkspaceId: string | null;
  /** Tanlangan workspace shaxsiymi yoki tashkilotmi — localStorage'da saqlanadi. */
  selectedWorkspaceType: OrganizationType | null;
  selectedFilterId: string | null;
  selectWorkspace: (id: string, type?: OrganizationType) => void;
  /** Backend'dan kelgan `organization.type` bilan sinxronlash uchun — id o'zgarmaydi. */
  setSelectedWorkspaceType: (type: OrganizationType) => void;
  selectFilter: (id: string) => void;
  filtersForSelected: () => ProjectFilter[];
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: MOCK_WORKSPACES,
  selectedWorkspaceId: localStorage.getItem(SELECTED_WORKSPACE_KEY),
  selectedWorkspaceType: readStoredWorkspaceType(),
  selectedFilterId: "all",
  // Desktop sidebar/picker hali mock tashkilotlar bilan ishlaydi — type berilmasa "organization".
  selectWorkspace: (id, type = "organization") => {
    localStorage.setItem(SELECTED_WORKSPACE_KEY, id);
    localStorage.setItem(SELECTED_WORKSPACE_TYPE_KEY, type);
    set({ selectedWorkspaceId: id, selectedWorkspaceType: type, selectedFilterId: "all" });
  },
  setSelectedWorkspaceType: (type) => {
    localStorage.setItem(SELECTED_WORKSPACE_TYPE_KEY, type);
    set({ selectedWorkspaceType: type });
  },
  selectFilter: (id) => set({ selectedFilterId: id }),
  filtersForSelected: () =>
    MOCK_PROJECT_FILTERS.filter(
      (f) => f.workspaceId === get().selectedWorkspaceId,
    ),
}));
