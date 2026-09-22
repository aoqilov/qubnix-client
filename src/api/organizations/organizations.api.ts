import { api } from "@/api-config/axiosInstance";
import type {
  CreateOrganizationRequest,
  ListOrganizationMembersParams,
  ListOrganizationMembersResponse,
  ListOrganizationsParams,
  RawOrganization,
  RawOrganizationMember,
  RenameOrganizationRequest,
  UpdateOrganizationMemberRoleRequest,
} from "@/api/organizations/organizations.types";
import type { Pagination } from "@/types/common";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

export const organizationsApi = {
  list: (params?: ListOrganizationsParams) =>
    api
      .get<
        ApiEnvelope<{
          organizations: RawOrganization[];
          pagination: Pagination;
        }>
      >("/api/v1/organizations", { params })
      .then((r) => r.data.data),

  getById: (organizationID: string) =>
    api
      .get<
        ApiEnvelope<{ organization: RawOrganization }>
      >(`/api/v1/organizations/${organizationID}`)
      .then((r) => r.data.data.organization),

  create: (payload: CreateOrganizationRequest) =>
    api
      .post<
        ApiEnvelope<{ organization: RawOrganization }>
      >("/api/v1/organizations", { data: payload })
      .then((r) => r.data.data.organization),

  rename: (organizationID: string, payload: RenameOrganizationRequest) =>
    api
      .patch<
        ApiEnvelope<{ organization: RawOrganization }>
      >(`/api/v1/organizations/${organizationID}`, { data: payload })
      .then((r) => r.data.data.organization),

  remove: (organizationID: string) =>
    api
      .delete<
        ApiEnvelope<{ deleted: true }>
      >(`/api/v1/organizations/${organizationID}`)
      .then((r) => r.data.data.deleted),

  listMembers: (organizationID: string, params?: ListOrganizationMembersParams) =>
    api
      .get<
        ApiEnvelope<ListOrganizationMembersResponse>
      >(`/api/v1/organizations/${organizationID}/members`, { params })
      .then((r) => r.data.data),

  updateMemberRole: (
    organizationID: string,
    userId: number,
    payload: UpdateOrganizationMemberRoleRequest,
  ) =>
    api
      .patch<
        ApiEnvelope<{ member: RawOrganizationMember }>
      >(`/api/v1/organizations/${organizationID}/members/${userId}`, { data: payload })
      .then((r) => r.data.data.member),

  removeMember: (organizationID: string, userId: number) =>
    api
      .delete<
        ApiEnvelope<{ deleted: true }>
      >(`/api/v1/organizations/${organizationID}/members/${userId}`)
      .then((r) => r.data.data.deleted),
};
