import { isAxiosError } from "axios";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { SseEnvelope } from "./sse.types";

/**
 * `organization.member.removed` tanlangan workspace'da kelsa — chiqarilgan
 * odam biz emasmi, tekshiramiz. Payload'dagi user maydoniga tayanmaymiz
 * (sxemasi hujjatlanmagan): tashkilotni bitta REST so'rov bilan so'raymiz,
 * 403/404 bo'lsa — kirish yo'qolgan.
 *
 * `true` qaytsa tanlov tozalangan, chaqiruvchi foydalanuvchini doska'ga
 * yo'naltirishi kerak.
 */
export async function lostAccessToSelectedWorkspace(envelope: SseEnvelope): Promise<boolean> {
  if (envelope.type !== "organization.member.removed") return false;

  const { selectedWorkspaceId, clearSelectedWorkspace } = useWorkspaceStore.getState();
  if (!envelope.organization_id || String(envelope.organization_id) !== selectedWorkspaceId) {
    return false;
  }

  try {
    await organizationsApi.getById(selectedWorkspaceId);
    return false;
  } catch (err) {
    const status = isAxiosError(err) ? err.response?.status : undefined;
    if (status !== 403 && status !== 404) return false;
    // So'rov davomida foydalanuvchi boshqa workspace tanlagan bo'lishi mumkin.
    if (useWorkspaceStore.getState().selectedWorkspaceId !== selectedWorkspaceId) return false;

    clearSelectedWorkspace();
    return true;
  }
}
