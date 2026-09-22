import {
  LuUsers,
  LuShield,
  LuFolder,
  LuChartColumn,
  LuRepeat,
  LuBell,
  LuSlidersHorizontal,
  LuLogOut,
} from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { SettingsWorkspaceCard } from "./components/SettingsWorkspaceCard";
import { SettingsMenuRow } from "./components/SettingsMenuRow";
import {
  useOrganizationMembersCount,
  useSelectedOrganization,
} from "./hooks/useApiSettings";
import type { SettingsMenuItem } from "./types";
import { RoleGate, hasRole } from "@/components/shared/role-gate/RoleGate";
import { MemberReminderSettings } from "./components/MemberReminderSettings";
import { WORKSPACE_ROLES } from "@/const/roles";

const MANAGER_ROLES = [WORKSPACE_ROLES.ADMIN, WORKSPACE_ROLES.OWNER];

export default function FeatureSettings() {
  const workspaceQuery = useSelectedOrganization();
  const workspace = workspaceQuery.data;
  // GET .../members faqat admin/owner uchun ruxsat etilgan — member'da 403 qaytadi,
  // shuning uchun rol aniqlanib, admin/owner ekani bilinmaguncha so'rov yuborilmaydi.
  const isManager = hasRole(workspace ? [workspace.role] : [], MANAGER_ROLES);
  const membersCountQuery = useOrganizationMembersCount(isManager);

  if (workspaceQuery.isPending) {
    return (
      <div className="flex flex-col gap-5 p-4">
        <div className="h-8 w-48 animate-pulse rounded-input bg-surface-secondary" />
        <div className="h-[68px] animate-pulse rounded-card bg-surface-secondary" />
        <div className="h-64 animate-pulse rounded-card bg-surface-secondary" />
      </div>
    );
  }

  if (workspaceQuery.isError || !workspace) {
    return (
      <div className="p-4">
        <p className="text-sm text-error-strong">
          Workspace ma'lumotlarini yuklab bo'lmadi. Sahifani yangilang.
        </p>
      </div>
    );
  }

  // Повторные задачи soni hali mock — /repeating-tasks resursi ulanmagan.
  const menuItems: SettingsMenuItem[] = [
    {
      to: "/settings/members",
      icon: <LuUsers size={18} />,
      title: "Сотрудники",
      subtitle: "Роли, приглашения",
      badgeCount: membersCountQuery.data,
    },
    {
      to: "/settings/roles",
      icon: <LuShield size={18} />,
      title: "Роли",
      subtitle: "Кто что может делать",
    },
    {
      to: "/settings/projects",
      icon: <LuFolder size={18} />,
      title: "Проекты",
      subtitle: "Статистика, создание, архив",
    },
    {
      to: "/settings/member-stats",
      icon: <LuChartColumn size={18} />,
      title: "Статистика сотрудников",
      subtitle: "Кто сколько сделал и опоздал",
    },
    {
      to: "/settings/repeating-tasks",
      icon: <LuRepeat size={18} />,
      title: "Повторные задачи",
      subtitle: "Ежедневные, еженедельные, ежемесячные",
      badgeCount: 4,
    },
    {
      to: "/settings/reminders",
      icon: <LuBell size={18} />,
      title: "Напоминания",
      subtitle: "Push и email",
    },
    {
      to: "/settings/general",
      icon: <LuSlidersHorizontal size={18} />,
      title: "Общие настройки",
      subtitle: "Название, приглашения, тариф",
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-4">
      <div>
        <h1 className="font-condensed text-2xl tracking-wide text-primary">
          Настройка Workspace
        </h1>
        <p className="mt-0.5 text-sm font-semibold text-brand">
          {workspace.name.toUpperCase()} - {workspace.roleLabel}
        </p>
      </div>

      <SettingsWorkspaceCard
        workspace={workspace}
        membersCount={membersCountQuery.data}
      />
      {/* admin owner */}
      <RoleGate roles={[workspace.role]} allow={MANAGER_ROLES}>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold tracking-wide text-secondary">
            УПРАВЛЕНИЕ
          </div>

          <CusCardbox
            className="flex flex-col divide-y divide-[var(--border-subtle)] rounded-card"
            style={{ padding: 0 }}
          >
            {menuItems.map((item) => (
              <SettingsMenuRow key={item.to} {...item} />
            ))}
          </CusCardbox>
        </div>
      </RoleGate>
      {/* member */}
      <RoleGate roles={[workspace.role]} allow={[WORKSPACE_ROLES.MEMBER]}>
        <MemberReminderSettings />
      </RoleGate>

      <button className="flex w-full items-center justify-center gap-2 rounded-button border border-error py-3 text-sm font-semibold text-error-strong">
        <LuLogOut size={16} />
        Выйти из Workspace
      </button>
    </div>
  );
}
