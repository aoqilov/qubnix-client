import { useQuery } from "@tanstack/react-query";
import { employeesApi } from "@/api/employees/employees.api";
import { projectsApi } from "@/api/projects/projects.api";

export const DASHBOARD_KEYS = {
  employees: ["employees"] as const,
  projects: ["projects"] as const,
};

export function useDashboardData() {
  const employees = useQuery({ queryKey: DASHBOARD_KEYS.employees, queryFn: employeesApi.list });
  const projects = useQuery({ queryKey: DASHBOARD_KEYS.projects, queryFn: projectsApi.list });

  return {
    employeesCount: employees.data?.total ?? 0,
    projectsCount: projects.data?.total ?? 0,
    isLoading: employees.isLoading || projects.isLoading,
  };
}
