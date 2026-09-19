import type { Pagination } from "@/types/common";

export type OrganizationRole = "admin" | "viewer" | "member";
export type ProjectMemberRole = "project_manager" | "project_member";
export type InvitationStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type InvitationAction = "accept" | "reject";

export interface InvitationPersonSummary {
  id: number;
  first_name: string;
  last_name: string;
  telegram_username: string | null;
  telegram_avatar_url: string | null;
  index_quality: number;
}

export interface InvitationOrganizationRef {
  id: number;
  name: string;
}

export interface InvitationProjectRef {
  id: number;
  name: string;
  role: ProjectMemberRole;
}

/** Backend /organization-invitations* va /organizations/{id}/invitations* javoblaridagi xom shakl. */
export interface RawOrganizationInvitation {
  id: number;
  status: InvitationStatus;
  role: OrganizationRole;
  organization: InvitationOrganizationRef;
  employee: InvitationPersonSummary;
  invited_by: InvitationPersonSummary;
  projects: InvitationProjectRef[];
  created_at: string;
  responded_at: string | null;
}

export interface SearchEmployeesParams {
  /** 3–100 belgi. */
  query: string;
}

export interface SearchRoleOption {
  code: OrganizationRole;
  name: string;
}

export interface SearchProjectOption {
  id: number;
  name: string;
}

export interface SearchEmployeeResult {
  employee: InvitationPersonSummary;
  roles: SearchRoleOption[];
  projects: SearchProjectOption[];
}

export interface ProjectRoleInput {
  project_id: number;
  role: ProjectMemberRole;
}

/**
 * Faqat owner/admin yuboradi. `role: "admin"` bo'lsa `project_ids` shart
 * emas — admin barcha loyihalarni ko'radi. `viewer`/`member` uchun
 * `project_ids` majburiy; `member` uchun tanlangan har bir loyihaga
 * `project_roles` orqali rol ham berilishi shart.
 */
export interface CreateInvitationRequest {
  user_id: number;
  role: OrganizationRole;
  project_ids: number[];
  project_roles?: ProjectRoleInput[];
}

export interface ListInvitationsParams {
  page?: number;
  /** 1–100, default 20. */
  limit?: number;
  status?: InvitationStatus;
}

export interface ListInvitationsResponse {
  invitations: RawOrganizationInvitation[];
  pagination: Pagination;
}
