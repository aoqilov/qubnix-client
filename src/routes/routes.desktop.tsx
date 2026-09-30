import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import DesktopDoska from "@/pages/desktop/DesktopDoska";
import DesktopProfile from "@/pages/desktop/DesktopProfile";
import DesktopTasks from "@/pages/desktop/DesktopTasks";
import DesktopCalendar from "@/pages/desktop/DesktopCalendar";
import DesktopStatistics from "@/pages/desktop/DesktopStatistics";
import DesktopSettings from "@/pages/desktop/DesktopSettings";
import DesktopSettingsMembers from "@/pages/desktop/DesktopSettingsMembers";
import DesktopSettingsRoles from "@/pages/desktop/DesktopSettingsRoles";
import DesktopSettingsProjects from "@/pages/desktop/DesktopSettingsProjects";
import DesktopSettingsProjectDetail from "@/pages/desktop/DesktopSettingsProjectDetail";
import DesktopSettingsMemberStats from "@/pages/desktop/DesktopSettingsMemberStats";
import DesktopSettingsRepeatingTasks from "@/pages/desktop/DesktopSettingsRepeatingTasks";
import DesktopSettingsReminders from "@/pages/desktop/DesktopSettingsReminders";
import DesktopSettingsGeneral from "@/pages/desktop/DesktopSettingsGeneral";

export const desktopRoutes: RouteObject[] = [
  { path: "/", element: <Navigate to="/doska" replace /> },
  { path: "/doska", element: <DesktopDoska /> },
  { path: "/profile", element: <DesktopProfile /> },
  { path: "/tasks", element: <DesktopTasks /> },
  { path: "/calendar", element: <DesktopCalendar /> },
  { path: "/statistics", element: <DesktopStatistics /> },
  // Master-detail: chap menyu (DesktopSettings) doim ko'rinadi, bo'lim o'ng panelda <Outlet />.
  // Yo'llar mobile'dagi /settings/* bilan bir xil.
  {
    path: "/settings",
    element: <DesktopSettings />,
    children: [
      { path: "members", element: <DesktopSettingsMembers /> },
      { path: "roles", element: <DesktopSettingsRoles /> },
      { path: "projects", element: <DesktopSettingsProjects /> },
      { path: "projects/:projectId", element: <DesktopSettingsProjectDetail /> },
      { path: "member-stats", element: <DesktopSettingsMemberStats /> },
      { path: "repeating-tasks", element: <DesktopSettingsRepeatingTasks /> },
      { path: "reminders", element: <DesktopSettingsReminders /> },
      { path: "general", element: <DesktopSettingsGeneral /> },
    ],
  },
];
