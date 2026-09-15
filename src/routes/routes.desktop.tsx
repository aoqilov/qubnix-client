import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import DesktopDoska from "@/pages/desktop/DesktopDoska";
import DesktopProfile from "@/pages/desktop/DesktopProfile";
import DesktopTasks from "@/pages/desktop/DesktopTasks";
import DesktopCalendar from "@/pages/desktop/DesktopCalendar";
import DesktopStatistics from "@/pages/desktop/DesktopStatistics";

export const desktopRoutes: RouteObject[] = [
  { path: "/", element: <Navigate to="/doska" replace /> },
  { path: "/doska", element: <DesktopDoska /> },
  { path: "/profile", element: <DesktopProfile /> },
  { path: "/tasks", element: <DesktopTasks /> },
  { path: "/calendar", element: <DesktopCalendar /> },
  { path: "/statistics", element: <DesktopStatistics /> },
];
