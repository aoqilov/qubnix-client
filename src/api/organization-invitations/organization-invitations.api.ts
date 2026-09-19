import { api } from "@/api-config/axiosInstance";
import type {
  CreateInvitationRequest,
  InvitationAction,
  ListInvitationsParams,
  RawOrganizationInvitation,
  SearchEmployeeResult,
  SearchEmployeesParams,
} from "@/api/organization-invitations/organization-invitations.types";
import type { Pagination } from "@/types/common";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

export const organizationInvitationsApi = {
  /** Taklif qilishdan oldin: ism/username bo'yicha ro'yxatdan o'tgan xodimni topadi, tanlash mumkin bo'lgan rol/loyihalarni qaytaradi. */
  searchEmployee: (organizationID: string, params: SearchEmployeesParams) =>
    api
      .get<
        ApiEnvelope<SearchEmployeeResult>
      >(`/api/v1/organizations/${organizationID}/invitations/search`, { params })
      .then((r) => r.data.data),

  /** Faqat owner/admin. */
  create: (organizationID: string, payload: CreateInvitationRequest) =>
    api
      .post<
        ApiEnvelope<{ invitation: RawOrganizationInvitation; notification_sent: boolean }>
      >(`/api/v1/organizations/${organizationID}/invitations`, { data: payload })
      .then((r) => r.data.data),

  /** Shu tashkilotdan yuborilgan barcha takliflar. */
  listSent: (organizationID: string, params?: ListInvitationsParams) =>
    api
      .get<
        ApiEnvelope<{ invitations: RawOrganizationInvitation[]; pagination: Pagination }>
      >(`/api/v1/organizations/${organizationID}/invitations`, { params })
      .then((r) => r.data.data),

  /** Joriy foydalanuvchiga kelgan barcha takliflar — tashkilotdan mustaqil. */
  listReceived: (params?: ListInvitationsParams) =>
    api
      .get<
        ApiEnvelope<{ invitations: RawOrganizationInvitation[]; pagination: Pagination }>
      >(`/api/v1/organization-invitations`, { params })
      .then((r) => r.data.data),

  /** Kelgan taklifni qabul qiladi yoki rad etadi. */
  respond: (invitationId: string, action: InvitationAction) =>
    api
      .post<
        ApiEnvelope<{ invitation: RawOrganizationInvitation }>
      >(`/api/v1/organization-invitations/${invitationId}/respond`, { data: { action } })
      .then((r) => r.data.data.invitation),
};
