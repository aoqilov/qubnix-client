import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { SETTINGS_KEYS } from "@/widgets/features/mobile/settings/hooks/useApiSettings";
import { useWorkspaceStore } from "@/store/workspace.store";

/** PATCH /api/v1/organizations/{organizationID} — faqat owner o'zgartira oladi, faqat nomni. */
export function useRenameOrganization() {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => organizationsApi.rename(organizationId!, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SETTINGS_KEYS.organization(organizationId ?? ""),
      });
    },
  });
}
