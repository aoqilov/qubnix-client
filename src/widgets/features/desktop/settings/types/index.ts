import type { ReactNode } from "react";

export interface SettingsNavItemData {
  to: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  badgeCount?: number;
}
