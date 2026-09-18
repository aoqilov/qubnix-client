import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import MobileDoska from "@/pages/mobile/MobileDoska";
import MobileProfile from "@/pages/mobile/MobileProfile";
import MobileTasks from "@/pages/mobile/MobileTasks";
import MobileCalendar from "@/pages/mobile/MobileCalendar";
import MobileStatistics from "@/pages/mobile/MobileStatistics";
import MobileSettings from "@/pages/mobile/MobileSettings";
import MobileSettingsMembers from "@/pages/mobile/MobileSettingsMembers";
import MobileSettingsRoles from "@/pages/mobile/MobileSettingsRoles";
import MobileSettingsProjects from "@/pages/mobile/MobileSettingsProjects";
import MobileSettingsMemberStats from "@/pages/mobile/MobileSettingsMemberStats";
import MobileSettingsRepeatingTasks from "@/pages/mobile/MobileSettingsRepeatingTasks";
import MobileSettingsReminders from "@/pages/mobile/MobileSettingsReminders";
import MobileSettingsGeneral from "@/pages/mobile/MobileSettingsGeneral";

export const mobileRoutes: RouteObject[] = [
  { path: "/", element: <Navigate to="/doska" replace /> },
  { path: "/doska", element: <MobileDoska /> },
  { path: "/profile", element: <MobileProfile /> },
  { path: "/tasks", element: <MobileTasks /> },
  { path: "/calendar", element: <MobileCalendar /> },
  { path: "/statistics", element: <MobileStatistics /> },
  { path: "/settings", element: <MobileSettings /> },
  { path: "/settings/members", element: <MobileSettingsMembers /> },
  { path: "/settings/roles", element: <MobileSettingsRoles /> },
  { path: "/settings/projects", element: <MobileSettingsProjects /> },
  { path: "/settings/member-stats", element: <MobileSettingsMemberStats /> },
  { path: "/settings/repeating-tasks", element: <MobileSettingsRepeatingTasks /> },
  { path: "/settings/reminders", element: <MobileSettingsReminders /> },
  { path: "/settings/general", element: <MobileSettingsGeneral /> },
];
