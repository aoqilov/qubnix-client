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
export type ProjectRoleCode = "project_manager" | "project_member";

/** GET .../members javobidagi bitta xodim — loyihaga biriktirish uchun. */
export interface RawOrganizationMember {
  id: string;
  first_name: string;
  last_name: string;
  telegram_username: string | null;
  telegram_avatar_url: string | null;
  phone: string | null;
  index_quality: number;
  organization_role: OrganizationMemberRole;
  created_at: string;
}

/** Loyiha ichida beriladigan rol variantlari (member biriktirilganda tanlanadi). */
export interface ProjectRoleOption {
  code: ProjectRoleCode;
  name: string;
}

export interface ListOrganizationMembersResponse {
  members: RawOrganizationMember[];
  project_roles: ProjectRoleOption[];
}
