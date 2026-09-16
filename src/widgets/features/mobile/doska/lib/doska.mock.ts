import { MOCK_WORKSPACES } from "@/store/workspace.store";
import type {
  CreateWorkspaceRequest,
  PersonalSummary,
  WorkspaceSummary,
} from "@/types/workspace.types";

// /doska ekranining vaqtinchalik ma'lumot manbai.
//
// Backend'da workspace ro'yxati endpointi paydo bo'lganda:
//   1. api/workspace/workspace.api.ts ga list/personal/create qo'shiladi;
//   2. hooks/useApiDoska.ts dagi queryFn'lar o'sha funksiyalarga o'tkaziladi;
//   3. shu fayl o'chiriladi.
// UI komponentlariga umuman tegilmaydi — ular faqat hook'dan o'qiydi.

/** Xotiradagi ro'yxat — "Создать" bosilganda shu yerga qo'shiladi. */
const workspaces: WorkspaceSummary[] = [...MOCK_WORKSPACES];

const personal: PersonalSummary = { tasksCount: 2 };

/** Tarmoq kechikishini taqlid qiladi — skeleton holatini ko'rish uchun. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWorkspaces(): Promise<WorkspaceSummary[]> {
  await delay(300);
  return [...workspaces];
}

export async function fetchPersonalSummary(): Promise<PersonalSummary> {
  await delay(300);
  return { ...personal };
}

export async function createWorkspace(
  payload: CreateWorkspaceRequest
): Promise<WorkspaceSummary> {
  await delay(500);

  const created: WorkspaceSummary = {
    id: slugify(payload.name) || `ws-${workspaces.length + 1}`,
    name: payload.name,
    initials: payload.name.trim().charAt(0).toUpperCase() || "W",
    orgName: payload.orgName,
    tasksCount: 0,
    projectsCount: 0,
    todayCount: 0,
  };

  workspaces.push(created);
  return created;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
