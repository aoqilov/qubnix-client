import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { useWorkspaceStore } from "@/store/workspace.store";

/**
 * Tanlangan workspace turini (personal/organization) backend'dagi `organization.type`
 * bilan sinxronlaydi — localStorage bo'sh/eskirgan bo'lsa ham (masalan, tur saqlanishidan
 * oldin tanlangan workspace) personal rejimi to'g'ri ishlaydi. Query key
 * `useSelectedOrganization` bilan bir xil — kesh ulashiladi, qo'shimcha so'rov ketmaydi.
 *
 * Shuningdek: tanlangan tashkilotning tarif moduli `active` bo'lmasa (muddati tugagan) tanlov
 * tozalanib, /doska'ga qaytariladi — localStorage'da eski tanlov qolgan bo'lsa ham hech kim kira olmaydi.
 */
export function useSyncWorkspaceType() {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const storedType = useWorkspaceStore((s) => s.selectedWorkspaceType);
  const setSelectedWorkspaceType = useWorkspaceStore((s) => s.setSelectedWorkspaceType);
  const clearSelectedWorkspace = useWorkspaceStore((s) => s.clearSelectedWorkspace);
  const navigate = useNavigate();
  // Desktop hali mock id'lar ("synapse" ...) bilan ishlaydi — ular uchun so'rov yuborilmaydi.
  const isRealId = !!organizationId && /^\d+$/.test(organizationId);

  const { data: org } = useQuery({
    queryKey: ["organizations", organizationId ?? ""] as const,
    queryFn: () => organizationsApi.getById(organizationId!),
    enabled: isRealId,
  });

  const type = org?.type;
  const isBlocked = org?.type === "organization" && org.module.status !== "active";

  useEffect(() => {
    if (type && type !== storedType) setSelectedWorkspaceType(type);
  }, [type, storedType, setSelectedWorkspaceType]);

  useEffect(() => {
    if (!isBlocked) return;
    clearSelectedWorkspace();
    navigate("/doska", { replace: true });
  }, [isBlocked, clearSelectedWorkspace, navigate]);
}
