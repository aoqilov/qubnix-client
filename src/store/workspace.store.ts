import { create } from "zustand";
import type {
  OrganizationModuleStatus,
  OrganizationRole,
  OrganizationType,
} from "@/api/organizations/organizations.types";

/**
 * Tanlangan workspace (tashkilot yoki personal) va desktop'dagi aktiv loyiha.
 * Tashkilotlar ro'yxati store'da emas — @/queries/doska.queries (API) dan olinadi.
 * Rang ham saqlanmaydi — utils/avatarColor.ts dagi avatarColorVar(id).
 */
export interface WorkspaceSummary {
  id: string;
  name: string;
  /** Avatar doirasidagi harf(lar). */
  initials: string;
  /** O'ngdagi belgidagi son — "4 задачи". */
  tasksCount: number;
  /** Joriy foydalanuvchining shu tashkilotdagi roli. */
  role?: OrganizationRole;
  /** Tarif moduli holati — `active` bo'lmasa (muddati tugagan) hech kim kira olmaydi. */
  moduleStatus?: OrganizationModuleStatus;
  /**
   * Backend /organizations javobida hozircha yo'q — Sidebar
   * shu maydon borida ko'rsatadi, bo'lmasa yashiradi.
   */
  projectsCount?: number;
  /** Backend'da hali yo'q — yuqoridagi izohga qarang. */
  todayCount?: number;
}

const SELECTED_WORKSPACE_KEY = "qubnix_selected_workspace";
/** "personal" — /doska'dagi "Личное" kartasi, "organization" — oddiy workspace. */
const SELECTED_WORKSPACE_TYPE_KEY = "qubnix_selected_workspace_type";

function readStoredWorkspaceType(): OrganizationType | null {
  const value = localStorage.getItem(SELECTED_WORKSPACE_TYPE_KEY);
  return value === "personal" || value === "organization" ? value : null;
}

interface WorkspaceState {
  selectedWorkspaceId: string | null;
  /** Tanlangan workspace shaxsiymi yoki tashkilotmi — localStorage'da saqlanadi. */
  selectedWorkspaceType: OrganizationType | null;
  /** Desktop: sidebar va /tasks'dagi aktiv loyiha (bitta manba). Workspace almashganda tozalanadi. */
  selectedProjectId: string | null;
  selectWorkspace: (id: string, type?: OrganizationType) => void;
  /** Foydalanuvchi tanlangan workspace'dan chiqarilganda (SSE `member.removed`). */
  clearSelectedWorkspace: () => void;
  /** Backend'dan kelgan `organization.type` bilan sinxronlash uchun — id o'zgarmaydi. */
  setSelectedWorkspaceType: (type: OrganizationType) => void;
  selectProject: (id: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedWorkspaceId: localStorage.getItem(SELECTED_WORKSPACE_KEY),
  selectedWorkspaceType: readStoredWorkspaceType(),
  selectedProjectId: null,
  // type berilmasa — "organization".
  selectWorkspace: (id, type = "organization") => {
    localStorage.setItem(SELECTED_WORKSPACE_KEY, id);
    localStorage.setItem(SELECTED_WORKSPACE_TYPE_KEY, type);
    set({ selectedWorkspaceId: id, selectedWorkspaceType: type, selectedProjectId: null });
  },
  clearSelectedWorkspace: () => {
    localStorage.removeItem(SELECTED_WORKSPACE_KEY);
    localStorage.removeItem(SELECTED_WORKSPACE_TYPE_KEY);
    set({ selectedWorkspaceId: null, selectedWorkspaceType: null, selectedProjectId: null });
  },
  setSelectedWorkspaceType: (type) => {
    localStorage.setItem(SELECTED_WORKSPACE_TYPE_KEY, type);
    set({ selectedWorkspaceType: type });
  },
  selectProject: (id) => set({ selectedProjectId: id }),
}));
