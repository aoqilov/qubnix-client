import type { TFunction } from "i18next";
import {
  LuCrown,
  LuShieldCheck,
  LuUser,
  LuEye,
  LuFolderKanban,
  LuSquareCheck,
} from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import type { CusAccordionItem } from "@/components/ui/accordion/CusAccordion";

// Matnlar `roles.*` kalitlarida; funksiya render paytida chaqiriladi — til almashsa
// ro'yxat ham yangilanadi (o'zgarmas massiv bo'lsa eski tilda qolib ketardi).

// Tashkilot (workspace) darajasidagi rollar — const/roles.ts dagi WORKSPACE_ROLES bilan mos.
export function buildOrganizationRoleItems(t: TFunction): CusAccordionItem[] {
  return [
    {
      value: "owner",
      title: t("roles.owner.title"),
      icon: <LuCrown size={18} />,
      badge: (
        <CusBadge variant="subtle" tone="brand">
          {t("roles.owner.badge")}
        </CusBadge>
      ),
      content: t("roles.owner.text"),
    },
    {
      value: "admin",
      title: t("roles.admin.title"),
      icon: <LuShieldCheck size={18} />,
      badge: (
        <CusBadge variant="subtle" tone="info">
          {t("roles.admin.badge")}
        </CusBadge>
      ),
      content: t("roles.admin.text"),
    },
    {
      value: "member",
      title: t("roles.member.title"),
      icon: <LuUser size={18} />,
      content: t("roles.member.text"),
    },
    {
      value: "viewer",
      title: t("roles.viewer.title"),
      icon: <LuEye size={18} />,
      badge: (
        <CusBadge variant="subtle" tone="neutral">
          {t("roles.viewer.badge")}
        </CusBadge>
      ),
      content: t("roles.viewer.text"),
    },
  ];
}

// Loyiha darajasidagi rollar — const/roles.ts dagi PROJECT_ROLES bilan mos.
export function buildProjectRoleItems(t: TFunction): CusAccordionItem[] {
  return [
    {
      value: "project_manager",
      title: t("roles.projectManager.title"),
      icon: <LuFolderKanban size={18} />,
      badge: (
        <CusBadge variant="subtle" tone="info">
          {t("roles.projectManager.badge")}
        </CusBadge>
      ),
      content: t("roles.projectManager.text"),
    },
    {
      value: "project_member",
      title: t("roles.projectMember.title"),
      icon: <LuSquareCheck size={18} />,
      badge: (
        <CusBadge variant="subtle" tone="neutral">
          {t("roles.projectMember.badge")}
        </CusBadge>
      ),
      content: t("roles.projectMember.text"),
    },
  ];
}
