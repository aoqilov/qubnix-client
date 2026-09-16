import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateWorkspaceRequest } from "@/types/workspace.types";
// Backend tayyor bo'lganda shu import workspaceApi'ga almashadi — lib/doska.mock.ts ga qarang.
import {
  createWorkspace,
  fetchPersonalSummary,
  fetchWorkspaces,
} from "../lib/doska.mock";

export const DOSKA_KEYS = {
  workspaces: () => ["workspaces"] as const,
  personal: () => ["workspaces", "personal"] as const,
};

export function useWorkspaceList() {
  return useQuery({
    queryKey: DOSKA_KEYS.workspaces(),
    queryFn: () => fetchWorkspaces(),
  });
}

export function usePersonalSummary() {
  return useQuery({
    queryKey: DOSKA_KEYS.personal(),
    queryFn: () => fetchPersonalSummary(),
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkspaceRequest) => createWorkspace(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOSKA_KEYS.workspaces() });
    },
  });
}
