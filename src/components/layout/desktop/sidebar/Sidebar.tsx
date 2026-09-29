import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LuCalendar,
  LuCalendarCheck,
  LuChartColumn,
  LuCheck,
  LuChevronDown,
  LuLayoutGrid,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuUser,
} from "react-icons/lu";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useUiStore } from "@/store/ui.store";
import { avatarColorVar } from "@/utils/avatarColor";
import { tagColorVar } from "@/utils/tagColor";
import { todayApiDate } from "@/utils/apiDate";
import { CusPopover } from "@/components/ui/popover/CusPopover";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { personalSummaryQuery, workspaceListQuery } from "@/queries/doska.queries";
import { useProjectsByDate } from "@/queries/tasks.queries";
import type { OrganizationType } from "@/api/organizations/organizations.types";

// /doska va /profile — workspace'ga bog'liq emas: faqat asosiy menyu.
const HOME_PATHS = ["/doska", "/profile"];

interface CurrentWorkspace {
  id: string;
  name: string;
  initials: string;
  type: OrganizationType;
  tasksCount: number;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mt-4 px-3 text-[10px] font-medium uppercase tracking-wide text-disabled first:mt-0">
      {children}
    </div>
  );
}

function WorkspaceAvatar({ workspace, size = 32 }: { workspace: CurrentWorkspace; size?: number }) {
  return (
    <span
      className="flex flex-none items-center justify-center rounded-input text-[13px] font-semibold text-on-brand"
      style={{ width: size, height: size, background: avatarColorVar(workspace.id) }}
    >
      {workspace.type === "personal" ? <LuUser size={16} /> : workspace.initials}
    </span>
  );
}

function navLinkClass(isActive: boolean, collapsed: boolean) {
  return `flex items-center gap-2 rounded-input py-2 text-base font-medium transition-colors ${
    collapsed ? "justify-center px-2" : "px-3"
  } ${isActive ? "bg-brand text-on-brand" : "text-secondary hover:bg-surface-secondary hover:text-primary"}`;
}

export function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = useUiStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const selectedWorkspaceId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const selectWorkspace = useWorkspaceStore((s) => s.selectWorkspace);
  const selectedProjectId = useWorkspaceStore((s) => s.selectedProjectId);
  const selectProject = useWorkspaceStore((s) => s.selectProject);
  const [projectsOpen, setProjectsOpen] = useState(true);

  // Doska bilan bir xil kalitlar — alohida so'rov ketmaydi, kesh ulashiladi.
  const { data: organizations = [] } = useQuery(workspaceListQuery());
  const { data: personal } = useQuery(personalSummaryQuery());

  const allWorkspaces: CurrentWorkspace[] = [
    ...(personal?.id
      ? [
          {
            id: personal.id,
            name: t("doska.personal.title"),
            initials: "",
            type: "personal" as const,
            tasksCount: personal.tasksCount,
          },
        ]
      : []),
    ...organizations.map((o) => ({
      id: o.id,
      name: o.name,
      initials: o.initials,
      type: "organization" as const,
      tasksCount: o.tasksCount,
    })),
  ];
  const current = allWorkspaces.find((w) => w.id === selectedWorkspaceId) ?? null;

  // Bugungi loyihalar — /tasks bilan bir xil so'rov (bugungi sana uchun).
  const { data: projectsData } = useProjectsByDate(selectedWorkspaceId, todayApiDate());
  const projects = projectsData?.projects ?? [];

  // Aktiv loyiha yo'q yoki ro'yxatda qolmagan bo'lsa — birinchisi aktiv.
  useEffect(() => {
    if (projects.length === 0) return;
    if (!projects.some((p) => String(p.id) === selectedProjectId)) {
      selectProject(String(projects[0].id));
    }
  }, [projects, selectedProjectId, selectProject]);

  const isHome = HOME_PATHS.includes(location.pathname);

  const mainItems = [
    { to: "/doska", label: t("layout.sidebar.dashboard"), icon: LuLayoutGrid },
    { to: "/profile", label: t("layout.sidebar.profile"), icon: LuUser },
  ];
  const workspaceItems = [
    { to: "/tasks", label: t("layout.sidebar.today"), icon: LuCalendarCheck, count: current?.tasksCount },
    { to: "/calendar", label: t("layout.sidebar.calendar"), icon: LuCalendar },
    { to: "/statistics", label: t("layout.sidebar.statistics"), icon: LuChartColumn },
  ];

  return (
    <aside
      className={`flex flex-none flex-col border-r border-subtle bg-surface transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-[260px]"
      }`}
    >
      <div className={`flex h-14 items-center ${collapsed ? "justify-center" : "justify-between px-5"}`}>
        {!collapsed && (
          <span className="font-condensed text-xl tracking-wide text-brand">
            qubnix {/* i18n-ignore — brend */}
          </span>
        )}
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? t("layout.sidebar.expand") : t("layout.sidebar.collapse")}
          className="rounded-input p-1.5 text-secondary hover:bg-surface-secondary"
        >
          {collapsed ? <LuPanelLeftOpen size={21} /> : <LuPanelLeftClose size={21} />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {!collapsed && <SectionLabel>{t("layout.sidebar.main")}</SectionLabel>}
        {mainItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) => navLinkClass(isActive, collapsed)}
          >
            <item.icon size={18} />
            {!collapsed && item.label}
          </NavLink>
        ))}

        {!isHome && !current && !collapsed && (
          <div className="mt-4 flex flex-col gap-2 rounded-card bg-surface-secondary p-3">
            <p className="text-base text-secondary">{t("layout.sidebar.noWorkspace")}</p>
            <button
              type="button"
              onClick={() => navigate("/doska")}
              className="self-start text-base font-semibold text-brand hover:underline"
            >
              {t("layout.sidebar.toDoska")}
            </button>
          </div>
        )}

        {!isHome && current && (
          <>
            {/* Workspace almashtirgich */}
            <div className="mt-4">
              <CusPopover
                placement="bottom-start"
                width={240}
                trigger={(open) => (
                  <button
                    title={current.name}
                    className={`flex w-full items-center gap-2 rounded-card border border-subtle bg-surface-secondary py-2 transition-colors hover:border-focus ${
                      collapsed ? "justify-center px-1" : "px-3"
                    }`}
                  >
                    <WorkspaceAvatar workspace={current} />
                    {!collapsed && (
                      <>
                        <span className="min-w-0 flex-1 text-left">
                          <span className="block text-[10px] font-medium uppercase tracking-wide text-disabled">
                            {t("layout.sidebar.workspace")}
                          </span>
                          <span className="block truncate text-base font-semibold text-primary">
                            {current.name}
                          </span>
                        </span>
                        <LuChevronDown
                          size={16}
                          className={`text-secondary transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                )}
              >
                {(close) => (
                  <div className="p-1">
                    {allWorkspaces.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          selectWorkspace(w.id, w.type);
                          close();
                        }}
                        className="flex w-full items-center gap-2 rounded-input px-2 py-2 text-base text-primary hover:bg-surface-secondary"
                      >
                        <WorkspaceAvatar workspace={w} size={25} />
                        <span className="flex-1 truncate text-left">{w.name}</span>
                        {w.id === current.id && <LuCheck size={16} className="text-brand" />}
                      </button>
                    ))}
                  </div>
                )}
              </CusPopover>
            </div>

            {/* Loyihalar */}
            {!collapsed && (
              <>
                <button
                  onClick={() => setProjectsOpen((v) => !v)}
                  className="mt-4 flex w-full items-center justify-between px-3"
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide text-disabled">
                    {t("layout.sidebar.projects")}
                  </span>
                  <LuChevronDown
                    size={15}
                    className={`text-secondary transition-transform ${projectsOpen ? "" : "-rotate-90"}`}
                  />
                </button>
                {projectsOpen &&
                  (projects.length === 0 ? (
                    <p className="px-3 py-1 text-sm text-disabled">{t("layout.sidebar.noProjects")}</p>
                  ) : (
                    projects.map((project) => {
                      const id = String(project.id);
                      const active = id === selectedProjectId;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            selectProject(id);
                            navigate("/tasks");
                          }}
                          className={`flex items-center gap-2 rounded-input px-3 py-2 text-base transition-colors ${
                            active ? "font-semibold" : "hover:bg-surface-secondary"
                          }`}
                          // Aktiv fon inline — Chakra'ning button stillari bg sinfini bosadi.
                          style={
                            active
                              ? { background: "var(--brand-subtle-bg)", color: "var(--brand-default)" }
                              : { color: "var(--text-secondary)" }
                          }
                        >
                          <span
                            className="size-[9px] flex-none rounded-full"
                            style={{ background: tagColorVar(id) }}
                          />
                          <span className="flex-1 truncate text-left">{project.name}</span>
                          <span className="text-sm text-secondary">{project.task_counts.total}</span>
                        </button>
                      );
                    })
                  ))}
              </>
            )}

            {/* Bo'limlar */}
            <div className="mt-4 flex flex-col gap-1 border-t border-subtle pt-3">
              {workspaceItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) => navLinkClass(isActive, collapsed)}
                >
                  <item.icon size={18} />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && !!item.count && (
                    <CusBadge tone="brand" variant="solid" size="sm">
                      {item.count}
                    </CusBadge>
                  )}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
