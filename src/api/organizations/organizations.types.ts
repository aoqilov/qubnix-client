import type { TaskStatusTotals } from "@/api/tasks/tasks.types";
import type { Pagination } from "@/types/common";

export type OrganizationType = "personal" | "organization";
export type OrganizationRole = "owner" | "admin" | "viewer" | "member";
export type OrganizationModuleStatus = "active" | "inactive" | "expired";

export interface OrganizationModule {
  status: OrganizationModuleStatus;
  is_free: boolean;
  expires_at: string | null;
}

/** Backend /api/v1/organizations* javoblaridagi xom shakl. */
export interface RawOrganization {
  id: string;
  type: OrganizationType;
  name: string;
  ownerId: string;
  owner_user_id: string;
  /** Joriy foydalanuvchining shu tashkilotdagi roli. */
  role: OrganizationRole;
  is_owner: boolean;
  module: OrganizationModule;
  created_at: string;
  /** Faqat ro'yxat javobida (GET /organizations) keladi, bitta obyektda yo'q. */
  tasks_count?: number;
}

export interface ListOrganizationsParams {
  page?: number;
  /** 1–100, default 50. */
  limit?: number;
  type?: OrganizationType;
}

export interface ListOrganizationsResponse {
  organizations: RawOrganization[];
  pagination: Pagination;
}

/**
 * Hozircha xaridsiz ochiq (server konfiguratsiyasi bilan keyin qayta talab
 * qilinishi mumkin) — server owner/type'ni o'zi belgilaydi.
 */
export interface CreateOrganizationRequest {
  name: string;
}

/** Faqat owner o'zgartira oladi, faqat nomni. */
export interface RenameOrganizationRequest {
  name: string;
}

export type OrganizationMemberRole = "admin" | "viewer" | "member";

/**
 * GET .../members javobidagi bitta xodim.
 * `phone` backend javobida hali yo'q — optional bo'lib qoladi.
 */
export interface RawOrganizationMember {
  id: number;
  first_name: string;
  last_name: string;
  telegram_username: string | null;
  telegram_avatar_url: string | null;
  phone?: string | null;
  index_quality: number;
  organization_role: OrganizationMemberRole;
  created_at: string;
}

/** Tashkilotdagi rol bo'yicha filtr variantlari — har birida shu roldagi xodimlar soni. */
export interface OrganizationRoleOption {
  code: OrganizationMemberRole;
  name: string;
  role_member_count: number;
}

export interface ListOrganizationMembersParams {
  page?: number;
  /** 1–100, default 50. */
  limit?: number;
  role?: OrganizationMemberRole;
}

export interface ListOrganizationMembersResponse {
  members: RawOrganizationMember[];
  organization_roles: OrganizationRoleOption[];
  members_count: number;
  pagination: Pagination;
}

/** PATCH .../members/{user_id} — faqat owner/admin. */
export interface UpdateOrganizationMemberRoleRequest {
  role: OrganizationMemberRole;
}

/** GET /organizations/{id}/members/statistics — sonlar task `due_at` bo'yicha. */
export interface MemberStatisticsParams {
  /** Bitta kun — `from`/`to` o'rniga. YYYY-MM-DD. */
  date?: string;
  from?: string;
  to?: string;
  /** Vergul bilan ajratilgan user id'lar. */
  member_ids?: string;
  search?: string;
  task_order?: "most_done" | "least_done";
  page?: number;
  /** 1–1000, default 20. */
  limit?: number;
}

export interface RawMemberStatistics {
  user_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  telegram_avatar_url: string | null;
  organization_role: OrganizationRole;
  totals: TaskStatusTotals;
}

export interface MemberStatisticsResponse {
  members: RawMemberStatistics[];
  pagination: Pagination;
}
