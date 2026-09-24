import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/api/tasks/tasks.api";
import type { TaskStatisticsType } from "@/api/tasks/tasks.types";

export const STATISTICS_KEYS = {
  /** `["organizations", id, "projects"]` prefiksi ostida — vazifa mutatsiyalari bilan birga yangilanadi. */
  my: (organizationId: string, type: TaskStatisticsType, date: string) =>
    ["organizations", organizationId, "projects", "my-statistics", type, date] as const,
};

export function useMyStatistics(
  organizationId: string | null,
  type: TaskStatisticsType,
  date: string,
) {
  return useQuery({
    queryKey: STATISTICS_KEYS.my(organizationId ?? "", type, date),
    queryFn: () => tasksApi.statistics(organizationId!, type, date),
    enabled: !!organizationId,
  });
}
