import type { RouteObject } from "react-router-dom";
import Home from "@/pages/mobile/Home";
import Tasks from "@/pages/mobile/Tasks";
import TaskDetail from "@/pages/mobile/TaskDetail";
import TaskCreate from "@/pages/mobile/TaskCreate";
import Calendar from "@/pages/mobile/Calendar";
import Stats from "@/pages/mobile/Stats";
import Profile from "@/pages/mobile/Profile";
import WorkspaceSettings from "@/pages/mobile/WorkspaceSettings";

export const mobileRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/tasks", element: <Tasks /> },
  { path: "/tasks/create", element: <TaskCreate /> },
  { path: "/tasks/:id", element: <TaskDetail /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/stats", element: <Stats /> },
  { path: "/profile", element: <Profile /> },
  { path: "/workspace-settings", element: <WorkspaceSettings /> },
];
