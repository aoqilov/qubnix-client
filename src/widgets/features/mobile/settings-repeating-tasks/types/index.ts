export type RoutineFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type RoutineFilter = "all" | RoutineFrequency;

export interface RoutineMember {
  id: string;
  initials: string;
  name: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  projectId: string;
  projectLabel: string;
  frequency: RoutineFrequency;
  active: boolean;
  repeatLabel: string;
  nextRunLabel: string;
  members: RoutineMember[];
  overflowCount?: number;
}
