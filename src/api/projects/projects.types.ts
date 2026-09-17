import type { Pagination } from "@/types/common";

export type ProjectMemberRole = "project_manager" | "project_member";

export interface RawProjectMember {
  user_id: string;
  role: ProjectMemberRole;
  first_name: string;
  last_name: string;
  telegram_username: string | null;
  telegram_avatar_url: string | null;
}

/** Backend /api/v1/organizations/{organizationID}/projects* javoblaridagi xom shakl. */
export interface RawProject {
  id: string;
  organization_id: string;
  name: string;
  members: RawProjectMember[];
  created_by: string;
  /** null bo'lsa loyiha arxivlanmagan. */
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListProjectsParams {
  page?: number;
  /** 1–100, default 20. */
  limit?: number;
  /** default false — arxivlangan loyihalar shu true bo'lmasa yashirin. */
  include_archived?: boolean;
  /** Nom bo'yicha qidiruv. */
  q?: string;
}

export interface ListProjectsResponse {
  projects: RawProject[];
  pagination: Pagination;
}

export interface ProjectMemberInput {
  user_id: string;
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
 * (qo'shish emas, replace).
 */
export interface UpdateProjectRequest {
  name?: string;
  members?: ProjectMemberInput[];
  /** true — arxivlash, false — arxivdan qaytarish. */
  archived?: boolean;
}
