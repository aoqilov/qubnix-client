import { useQuery } from "@tanstack/react-query";
import {
  personalSummaryQuery,
  receivedInvitationsQuery,
  useCreateWorkspaceMutation,
  useRespondInvitationMutation,
  workspaceListQuery,
} from "@/queries/doska.queries";

// Kalitlar, so'rovlar va mutation'lar umumiy — @/queries/doska.queries (desktop bilan bitta).
// Mobilga xos shakl (select/enabled) kerak bo'lsa, shu yerda qo'shiladi.

export function useWorkspaceList() {
  return useQuery(workspaceListQuery());
}

export function usePersonalSummary() {
  return useQuery(personalSummaryQuery());
}

export function useReceivedInvitations() {
  return useQuery(receivedInvitationsQuery());
}

export const useRespondInvitation = useRespondInvitationMutation;
export const useCreateWorkspace = useCreateWorkspaceMutation;
