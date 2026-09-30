import type { ReactNode } from "react";

interface SettingsSectionHeaderProps {
  title: string;
  subtitle?: ReactNode;
  /** O'ng tomondagi amallar (masalan "Yangi loyiha" tugmasi). */
  actions?: ReactNode;
}

/** Desktop settings o'ng panelidagi har bir bo'lim sarlavhasi. */
export function SettingsSectionHeader({ title, subtitle, actions }: SettingsSectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="truncate font-condensed text-3xl font-semibold leading-none text-primary">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm font-semibold text-brand">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-none items-center gap-2">{actions}</div>}
    </div>
  );
}
