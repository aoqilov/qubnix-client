import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import MobileDoska from "@/pages/mobile/MobileDoska";
import MobileProfile from "@/pages/mobile/MobileProfile";
import MobileTasks from "@/pages/mobile/MobileTasks";
import MobileCalendar from "@/pages/mobile/MobileCalendar";
import MobileStatistics from "@/pages/mobile/MobileStatistics";
import MobileSettings from "@/pages/mobile/MobileSettings";

export const mobileRoutes: RouteObject[] = [
  { path: "/", element: <Navigate to="/doska" replace /> },
  { path: "/doska", element: <MobileDoska /> },
  { path: "/profile", element: <MobileProfile /> },
  { path: "/tasks", element: <MobileTasks /> },
  { path: "/calendar", element: <MobileCalendar /> },
  { path: "/statistics", element: <MobileStatistics /> },
  { path: "/settings", element: <MobileSettings /> },
];
