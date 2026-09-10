import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Doska from "@/pages/web/Doska";
import Profile from "@/pages/web/Profile";
import Tasks from "@/pages/web/Tasks";
import Calendar from "@/pages/web/Calendar";
import Statistics from "@/pages/web/Statistics";
import Settings from "@/pages/web/Settings";

export const webRoutes: RouteObject[] = [
  { path: "/", element: <Navigate to="/doska" replace /> },
  { path: "/doska", element: <Doska /> },
  { path: "/profile", element: <Profile /> },
  { path: "/tasks", element: <Tasks /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/statistics", element: <Statistics /> },
  { path: "/settings", element: <Settings /> },
];
