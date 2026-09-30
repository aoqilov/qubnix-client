import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  LuBell,
  LuChartColumn,
  LuFolder,
  LuLogOut,
  LuRepeat,
  LuShield,
  LuSlidersHorizontal,
  LuUsers,
} from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { hasRole } from "@/components/shared/role-gate/RoleGate";
import { WORKSPACE_ROLES } from "@/const/roles";
import { useOrganizationMembersCount, useSelectedOrganization } from "@/hooks/useApiSettings";
import { useWorkspaceStore } from "@/store/workspace.store";
import { organizationRoleLabel } from "@/utils/roleLabels";
import { SettingsNavItem } from "./components/SettingsNavItem";
import { SettingsWorkspaceCard } from "./components/SettingsWorkspaceCard";
import type { SettingsNavItemData } from "./types";

// Viewer admin ko'radigan bo'limlarni ko'radi — ichkarida hamma amal yopiq (read-only).
const MANAGE_VIEW_ROLES = [WORKSPACE_ROLES.ADMIN, WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.VIEWER];

/** Personal workspace'da boshqa xodim yo'q — xodimlar bilan bog'liq bo'limlar ko'rsatilmaydi. */
const PERSONAL_HIDDEN_ROUTES = new Set(["/settings/members", "/settings/roles", "/settings/member-stats"]);

export default function FeatureSettings() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const workspaceQuery = useSelectedOrganization();
  const workspace = workspaceQuery.data;
  // GET .../members member'da 403 qaytadi — rol aniqlanmaguncha so'rov yuborilmaydi.
  const isManager = hasRole(workspace ? [workspace.role] : [], MANAGE_VIEW_ROLES);
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const membersCountQuery = useOrganizationMembersCount(isManager && !isPersonal);

  // Повторные задачи soni hali mock — /repeating-tasks resursi ulanmagan.
  const allItems: SettingsNavItemData[] = [
    {
      to: "/settings/members",
      icon: <LuUsers size={18} />,
      title: t("settings.menu.members"),
      subtitle: t("settings.menu.membersHint"),
      badgeCount: membersCountQuery.data,
    },
    {
      to: "/settings/roles",
      icon: <LuShield size={18} />,
      title: t("settings.menu.roles"),
      subtitle: t("settings.menu.rolesHint"),
    },
    {
      to: "/settings/projects",
      icon: <LuFolder size={18} />,
      title: t("settings.menu.projects"),
      subtitle: t("settings.menu.projectsHint"),
    },
    {
      to: "/settings/member-stats",
      icon: <LuChartColumn size={18} />,
      title: t("settings.menu.memberStats"),
      subtitle: t("settings.menu.memberStatsHint"),
    },
    {
      to: "/settings/repeating-tasks",
      icon: <LuRepeat size={18} />,
      title: t("settings.menu.routines"),
      subtitle: t("settings.menu.routinesHint"),
      badgeCount: 4,
    },
    {
      to: "/settings/reminders",
      icon: <LuBell size={18} />,
      title: t("settings.menu.reminders"),
      subtitle: t("settings.menu.remindersHint"),
    },
    {
      to: "/settings/general",
      icon: <LuSlidersHorizontal size={18} />,
      title: t("settings.menu.general"),
      subtitle: t("settings.menu.generalHint"),
    },
  ];

  // Member boshqaruv bo'limlarini ko'rmaydi — faqat rollar tavsifi (kim nima qila oladi).
  const items = !isManager
    ? allItems.filter((item) => item.to === "/settings/roles")
    : isPersonal
      ? allItems.filter((item) => !PERSONAL_HIDDEN_ROUTES.has(item.to))
      : allItems;

  // /settings'ning o'zi — birinchi ruxsat berilgan bo'limga o'tiladi.
  if (pathname === "/settings" && workspace) {
    return <Navigate to={items[0].to} replace />;
  }

  return (
    // AppLayout'ning <main> p-6 beradi — master-detail butun balandlikni egallashi uchun bekor qilinadi.
    <div className="-m-6 flex h-[calc(100%+3rem)]">
      <aside className="flex w-[296px] flex-none flex-col gap-4 overflow-y-auto border-r border-subtle py-5 pl-6 pr-4">
        <div>
          <h1 className="font-condensed text-3xl font-semibold leading-none text-primary">{t("settings.pageTitle")}</h1>
          {workspace && (
            <p className="mt-1.5 truncate text-sm font-semibold text-brand">
              {workspace.name}
              {!isPersonal && ` · ${organizationRoleLabel(workspace.role)}`}
            </p>
          )}
        </div>

        {workspaceQuery.isPending ? (
          <>
            <div className="h-[66px] animate-pulse rounded-card bg-surface-secondary" />
            <div className="h-80 animate-pulse rounded-card bg-surface-secondary" />
          </>
        ) : workspaceQuery.isError || !workspace ? (
          <p className="text-sm text-error-strong">{t("settings.loadError")}</p>
        ) : (
          <>
            <SettingsWorkspaceCard
              workspace={workspace}
              membersCount={membersCountQuery.data}
              isPersonal={isPersonal}
            />

            <nav className="flex flex-col gap-1">
              {items.map((item) => (
                <SettingsNavItem key={item.to} {...item} />
              ))}
            </nav>

            {/* Shaxsiy maydondan chiqib bo'lmaydi. Tashkilot uchun chiqish endpointi hali yo'q — tugma ishlamaydi. */}
            {!isPersonal && (
              <div className="border-t border-subtle pt-4">
                <CusButton
                  variant="outline"
                  colorPalette="red"
                  className="w-full"
                  style={{ width: "100%" }}
                  leftIcon={<LuLogOut size={16} />}
                >
                  {t("settings.leave")}
                </CusButton>
              </div>
            )}
          </>
        )}
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
        <Outlet />
      </section>
    </div>
  );
}
