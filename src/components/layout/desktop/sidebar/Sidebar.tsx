import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LuChevronDown,
  LuCheck,
  LuUser,
  LuCalendar,
  LuChartColumn,
  LuSettings,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from "react-icons/lu";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useUiStore } from "@/store/ui.store";
import { CusPopover } from "@/components/ui/popover/CusPopover";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { FiCheckCircle } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";

const HOME_PATHS = ["/doska", "/profile"];

const MAIN_ITEMS = [
  { to: "/doska", label: "Doska", icon: GrHomeRounded },
  { to: "/profile", label: "Profil", icon: LuUser },
];

const BOTTOM_ITEMS = [
  { to: "/tasks", label: "Vazifalar", icon: FiCheckCircle },
  { to: "/calendar", label: "Kalendar", icon: LuCalendar },
  { to: "/statistics", label: "Statistika", icon: LuChartColumn },
  { to: "/settings", label: "Sozlamalar", icon: LuSettings },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mt-4 px-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 first:mt-0 dark:text-[var(--text-dim)]">
      {children}
    </div>
  );
}

function Avatar({
  initials,
  color,
  size = 26,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <span
      className="flex flex-none items-center justify-center rounded-full text-[11px] font-semibold text-white"
      style={{ width: size, height: size, background: color }}
    >
      {initials}
    </span>
  );
}

function navLinkClass({
  isActive,
  collapsed,
}: {
  isActive: boolean;
  collapsed: boolean;
}) {
  return `flex items-center gap-2 rounded-lg py-2 text-sm font-medium ${
    collapsed ? "justify-center px-2" : "px-3"
  } ${
    isActive
      ? "bg-vio text-white"
      : "text-neutral-700 hover:bg-neutral-100 dark:text-[var(--text-2)] dark:hover:bg-[var(--bg-hover)]"
  }`;
}

export function Sidebar() {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const selectedWorkspaceId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const selectWorkspace = useWorkspaceStore((s) => s.selectWorkspace);
  const selectedFilterId = useWorkspaceStore((s) => s.selectedFilterId);
  const selectFilter = useWorkspaceStore((s) => s.selectFilter);
  const filters = useWorkspaceStore((s) => s.filtersForSelected());
  const [loyihalarOpen, setLoyihalarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = useUiStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const selectedWorkspace =
    workspaces.find((w) => w.id === selectedWorkspaceId) ?? null;
  const mode: "home" | "workspace" = HOME_PATHS.includes(location.pathname)
    ? "home"
    : "workspace";

  return (
    <aside
      className={`flex flex-none flex-col border-r border-neutral-300 bg-white transition-[width] duration-200 dark:border-white/10 dark:bg-[var(--bg-second)] ${
        collapsed ? "w-16" : "w-[260px]"
      }`}
    >
      <div
        className={`flex h-14 items-center ${collapsed ? "justify-center px-0" : "justify-between px-5"}`}
      >
        {!collapsed && (
          <span className="font-condensed text-lg tracking-wide text-vio">
            qubnix
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[var(--bg-hover)]"
        >
          {collapsed ? (
            <LuPanelLeftOpen size={18} />
          ) : (
            <LuPanelLeftClose size={18} />
          )}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        <>
          {!collapsed && <SectionLabel>Main</SectionLabel>}
          {MAIN_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                navLinkClass({ isActive, collapsed })
              }
            >
              <item.icon size={16} />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </>

        {mode === "workspace" && !selectedWorkspace && (
          <>
            {!collapsed && (
              <>
                <SectionLabel>Ish maydoni</SectionLabel>
                <p className="px-3 text-sm text-neutral-500 dark:text-[var(--text-muted)]">
                  Davom etish uchun ish maydonlaridan birini tanlang
                </p>
              </>
            )}
            <div className="mt-2 flex flex-col gap-1">
              {workspaces.map((w) => (
                <button
                  key={w.id}
                  title={w.name}
                  onClick={() => {
                    selectWorkspace(w.id);
                    navigate("/tasks");
                  }}
                  className={`flex items-center gap-2 rounded-lg py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-[var(--text-2)] dark:hover:bg-[var(--bg-hover)] ${
                    collapsed ? "justify-center px-2" : "px-3"
                  }`}
                >
                  <Avatar initials={w.initials} color={w.color} size={22} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate text-left">
                        {w.name}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {w.projectsCount}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === "workspace" && selectedWorkspace && (
          <>
            {!collapsed && <SectionLabel>Workspace</SectionLabel>}
            <CusPopover
              placement="bottom-start"
              width={220}
              trigger={(open) => (
                <button
                  title={selectedWorkspace.name}
                  className={`flex w-full items-center gap-2 rounded-lg py-2 hover:bg-neutral-100 dark:hover:bg-[var(--bg-hover)] ${
                    collapsed ? "justify-center px-2" : "px-3"
                  }`}
                >
                  <Avatar
                    initials={selectedWorkspace.initials}
                    color={selectedWorkspace.color}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate text-left text-sm font-medium">
                        {selectedWorkspace.name}
                      </span>
                      <LuChevronDown
                        size={14}
                        className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>
              )}
            >
              {(close) => (
                <div className="p-1">
                  {workspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        selectWorkspace(w.id);
                        close();
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-[var(--bg-hover)]"
                    >
                      <Avatar initials={w.initials} color={w.color} size={22} />
                      <span className="flex-1 truncate text-left">
                        {w.name}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {w.projectsCount}
                      </span>
                      {w.id === selectedWorkspace.id && (
                        <LuCheck size={14} className="text-vio" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CusPopover>

            <div className="mt-4 flex flex-col gap-1 border-t border-neutral-200 pt-3 dark:border-white/10">
              <SectionLabel>boshqaruv menu</SectionLabel>
              {BOTTOM_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) =>
                    navLinkClass({ isActive, collapsed })
                  }
                >
                  <item.icon size={16} />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed &&
                    item.to === "/tasks" &&
                    selectedWorkspace.todayCount > 0 && (
                      <CusBadge colorPalette="purple" size="xs">
                        {selectedWorkspace.todayCount}
                      </CusBadge>
                    )}
                </NavLink>
              ))}
            </div>

            {!collapsed && (
              <>
                <button
                  onClick={() => setLoyihalarOpen((v) => !v)}
                  className="mt-4 flex w-full items-center justify-between px-3 first:mt-0"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-[var(--text-dim)]">
                    Loyihalar
                  </span>
                  <LuChevronDown
                    size={13}
                    className={`text-neutral-400 transition-transform ${loyihalarOpen ? "" : "-rotate-90"}`}
                  />
                </button>
                {loyihalarOpen &&
                  filters.map((f) => {
                    const active = f.id === selectedFilterId;
                    return (
                      <button
                        key={f.id}
                        onClick={() => selectFilter(f.id)}
                        className={`flex items-center gap-2 rounded-lg border-b-2 border-l-2 px-3 py-2 text-sm ${
                          active
                            ? "border-vio font-medium text-vio"
                            : "border-transparent text-neutral-700 hover:bg-neutral-100 dark:text-[var(--text-2)] dark:hover:bg-[var(--bg-hover)]"
                        }`}
                      >
                        <span
                          className="h-2 w-2 flex-none rounded-full"
                          style={{ background: f.color }}
                        />
                        <span className="flex-1 truncate text-left">
                          {f.name}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {f.count}
                        </span>
                      </button>
                    );
                  })}
              </>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
