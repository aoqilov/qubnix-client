import { WORKSPACE_ROLES } from "@/const/roles";
import { useSelectedOrganization } from "@/hooks/useApiSettings";

/**
 * Joriy workspace'da foydalanuvchi viewer (kuzatuvchi)mi — viewer admin ko'radigan
 * hamma narsani ko'radi, lekin hech qanday yaratish/tahrirlash/o'chirish amali yo'q.
 * Rol hali yuklanmagan bo'lsa `false` — tugmalar keyin yashiriladi, backend baribir 403 beradi.
 */
export function useIsViewer(): boolean {
  const { data } = useSelectedOrganization();
  return data?.role === WORKSPACE_ROLES.VIEWER;
}
