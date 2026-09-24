import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { useWorkspaceStore } from "@/store/workspace.store";

/**
 * Tanlangan workspace turini (personal/organization) backend'dagi `organization.type`
 * bilan sinxronlaydi — localStorage bo'sh/eskirgan bo'lsa ham (masalan, tur saqlanishidan
 * oldin tanlangan workspace) personal rejimi to'g'ri ishlaydi. Query key
 * `useSelectedOrganization` bilan bir xil — kesh ulashiladi, qo'shimcha so'rov ketmaydi.
 */
export function useSyncWorkspaceType() {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const storedType = useWorkspaceStore((s) => s.selectedWorkspaceType);
  const setSelectedWorkspaceType = useWorkspaceStore((s) => s.setSelectedWorkspaceType);
  // Desktop hali mock id'lar ("synapse" ...) bilan ishlaydi — ular uchun so'rov yuborilmaydi.
  const isRealId = !!organizationId && /^\d+$/.test(organizationId);

  const { data: type } = useQuery({
    queryKey: ["organizations", organizationId ?? ""] as const,
    queryFn: () => organizationsApi.getById(organizationId!),
    select: (org) => org.type,
    enabled: isRealId,
  });

  useEffect(() => {
    if (type && type !== storedType) setSelectedWorkspaceType(type);
  }, [type, storedType, setSelectedWorkspaceType]);
}
