import { axiosInstance } from "@/api-config/axiosInstance";
import type { ClockEntry } from "@/types/attendance.types";

export const attendanceApi = {
  clockIn: () => axiosInstance.post<ClockEntry>("/attendance/clock-in").then((r) => r.data),
  clockOut: () => axiosInstance.post<ClockEntry>("/attendance/clock-out").then((r) => r.data),
  today: () => axiosInstance.get<ClockEntry | null>("/attendance/today").then((r) => r.data),
};
