import type { ReactNode } from "react";

export interface SettingsMenuItem {
  to: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  badgeCount?: number;
}
