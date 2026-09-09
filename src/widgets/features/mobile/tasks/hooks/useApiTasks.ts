import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/api/tasks/tasks.api";
import type { TaskStatus } from "@/types/task.types";

export const TASK_KEYS = {
  list: (status?: TaskStatus) => ["tasks", status] as const,
};

export function useTasks(status?: TaskStatus) {
  return useQuery({
    queryKey: TASK_KEYS.list(status),
    queryFn: () => tasksApi.list({ status }),
  });
}
