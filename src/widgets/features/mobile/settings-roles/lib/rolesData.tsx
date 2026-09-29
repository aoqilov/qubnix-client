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
import type ru from "@/i18n/locales/ru/roles";
import { RolePermissionList } from "../components/RolePermissionList";

// Matnlar `roles.*` kalitlarida; funksiya render paytida chaqiriladi — til almashsa
// ro'yxat ham yangilanadi (o'zgarmas massiv bo'lsa eski tilda qolib ketardi).

export type RolePermissionKey = keyof (typeof ru)["perms"];

export interface RolePermission {
  key: RolePermissionKey;
  allowed: boolean;
}

/**
 * Har bir rol bir xil ro'yxat bo'yicha belgilanadi — rollarni yonma-yon solishtirish oson.
 * Qiymatlar koddagi haqiqiy tekshiruvlarga mos (RoleGate, canManageTasks, useIsViewer):
 * rol mantig'i o'zgarsa, shu jadval ham yangilanadi.
 */
const ORGANIZATION_PERMISSION_KEYS = [
  "viewAll",
  "doTasks",
  "manageTasks",
  "manageProjects",
  "manageMembers",
  "manageRoutines",
  "viewStats",
  "notifications",
  "renameOrg",
  "billing",
] as const satisfies readonly RolePermissionKey[];

type OrganizationPermissionKey = (typeof ORGANIZATION_PERMISSION_KEYS)[number];

const ORGANIZATION_ALLOWED: Record<
  "owner" | "admin" | "member" | "viewer",
  readonly OrganizationPermissionKey[]
> = {
  owner: ORGANIZATION_PERMISSION_KEYS,
  admin: [
    "viewAll",
    "doTasks",
    "manageTasks",
    "manageProjects",
    "manageMembers",
    "manageRoutines",
    "viewStats",
    "notifications",
  ],
  member: ["doTasks"],
  viewer: ["viewAll", "viewStats"],
};

const PROJECT_PERMISSION_KEYS = [
  "doTasks",
  "manageProjectTasks",
  "filterByMember",
  "manageProjectMembers",
] as const satisfies readonly RolePermissionKey[];

type ProjectPermissionKey = (typeof PROJECT_PERMISSION_KEYS)[number];

const PROJECT_ALLOWED: Record<"project_manager" | "project_member", readonly ProjectPermissionKey[]> = {
  project_manager: ["doTasks", "manageProjectTasks", "filterByMember"],
  project_member: ["doTasks"],
};

function toPermissions<K extends RolePermissionKey>(
  keys: readonly K[],
  allowed: readonly K[],
): RolePermission[] {
  return keys.map((key) => ({ key, allowed: allowed.includes(key) }));
}

// Tashkilot (workspace) darajasidagi rollar — const/roles.ts dagi WORKSPACE_ROLES bilan mos.
export function buildOrganizationRoleItems(t: TFunction): CusAccordionItem[] {
  const content = (role: keyof typeof ORGANIZATION_ALLOWED) => (
    <RolePermissionList
      summary={t(`roles.${role}.text`)}
      permissions={toPermissions(ORGANIZATION_PERMISSION_KEYS, ORGANIZATION_ALLOWED[role])}
    />
  );

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
      content: content("owner"),
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
      content: content("admin"),
    },
    {
      value: "member",
      title: t("roles.member.title"),
      icon: <LuUser size={18} />,
      badge: (
        <CusBadge variant="subtle" tone="neutral">
          {t("roles.member.badge")}
        </CusBadge>
      ),
      content: content("member"),
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
      content: content("viewer"),
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
      content: (
        <RolePermissionList
          summary={t("roles.projectManager.text")}
          permissions={toPermissions(PROJECT_PERMISSION_KEYS, PROJECT_ALLOWED.project_manager)}
        />
      ),
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
      content: (
        <RolePermissionList
          summary={t("roles.projectMember.text")}
          permissions={toPermissions(PROJECT_PERMISSION_KEYS, PROJECT_ALLOWED.project_member)}
        />
      ),
    },
  ];
}
