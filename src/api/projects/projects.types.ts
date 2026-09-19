import type { Pagination } from "@/types/common";

export type ProjectMemberRole = "project_manager" | "project_member";

export interface RawProjectMember {
  user_id: number;
  role: ProjectMemberRole;
  first_name: string;
  last_name: string;
  telegram_username: string | null;
  telegram_avatar_url: string | null;
}

/** Backend /api/v1/organizations/{organizationID}/projects* javoblaridagi xom shakl. */
export interface RawProject {
  id: number;
  organization_id: number;
  name: string;
  members: RawProjectMember[];
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ListProjectsParams {
  page?: number;
  /** 1–100, default 20. */
  limit?: number;
  /** Nom bo'yicha qidiruv. */
  q?: string;
}

export interface ListProjectsResponse {
  projects: RawProject[];
  pagination: Pagination;
}

export interface ProjectMemberInput {
  user_id: number;
  role: ProjectMemberRole;
}

/** Faqat owner/admin yarata oladi — description maydoni yo'q. */
export interface CreateProjectRequest {
  name: string;
  /** Ixtiyoriy, eng ko'p 500 ta. */
  members?: ProjectMemberInput[];
}

/**
 * Faqat owner/admin. Barcha maydonlar ixtiyoriy, lekin kamida bittasi
 * bo'lishi shart. `members` yuborilsa — to'liq ro'yxat almashtiriladi
 * (qo'shish emas, replace) — bittalab qo'shish/o'chirish uchun
 * `projectsApi.addMembers`/`removeMember` ishlatiladi.
 *
 * Loyihani arxivlash endi shu endpoint orqali qilinmaydi — backend'dan
 * `archived` maydoni butunlay olib tashlangan.
 */
export interface UpdateProjectRequest {
  name?: string;
  members?: ProjectMemberInput[];
}
