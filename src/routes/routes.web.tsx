import type { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/web/Dashboard";
import Employees from "@/pages/web/Employees";
import EmployeeDetail from "@/pages/web/EmployeeDetail";
import Roles from "@/pages/web/Roles";
import Projects from "@/pages/web/Projects";
import ProjectDetail from "@/pages/web/ProjectDetail";
import Team from "@/pages/web/Team";
import Control from "@/pages/web/Control";
import Settings from "@/pages/web/Settings";
import UiPreview from "@/pages/web/UiPreview";

export const webRoutes: RouteObject[] = [
  { path: "/", element: <Dashboard /> },
  { path: "/employees", element: <Employees /> },
  { path: "/employees/:id", element: <EmployeeDetail /> },
  { path: "/roles", element: <Roles /> },
  { path: "/projects", element: <Projects /> },
  { path: "/projects/:id", element: <ProjectDetail /> },
  { path: "/team", element: <Team /> },
  { path: "/control", element: <Control /> },
  { path: "/settings", element: <Settings /> },
  { path: "/preview", element: <UiPreview /> },
];
