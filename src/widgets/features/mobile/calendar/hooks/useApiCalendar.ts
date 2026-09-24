import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/api/tasks/tasks.api";

export const CALENDAR_KEYS = {
  /** Vazifa mutatsiyalari `["organizations", id, "projects"]` ni invalidate qiladi —
   * kalendar ham shu prefiks ostida, task yaratilsa/o'zgarsa sonlar yangilanadi. */
  day: (organizationId: string, date: string) =>
    ["organizations", organizationId, "projects", "tasks-calendar", date] as const,
};

export function useCalendarDay(organizationId: string | null, date: string) {
  return useQuery({
    queryKey: CALENDAR_KEYS.day(organizationId ?? "", date),
    queryFn: () => tasksApi.calendar(organizationId!, date),
    enabled: !!organizationId,
  });
}
