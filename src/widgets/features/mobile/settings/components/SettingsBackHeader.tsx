import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LuChevronLeft } from "react-icons/lu";

interface SettingsBackHeaderProps {
  title: string;
  to?: string;
}

export function SettingsBackHeader({ title, to = "/settings" }: SettingsBackHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="relative mb-4 flex min-h-9 items-center">
      <Link
        to={to}
        className="-ml-4 z-10 flex flex-none items-center gap-1 rounded-r-full border-y border-r border-default bg-surface py-2 pl-4 pr-4 text-sm font-medium text-secondary shadow-dropdown hover:bg-surface-secondary"
      >
        <LuChevronLeft size={16} />
        {t("settings.back")}
      </Link>
      <h1 className="absolute inset-x-24 inset-y-0 flex items-center justify-center font-condensed text-1xl tracking-wide text-primary">
        <span className="min-w-0 truncate">{title}</span>
      </h1>
    </div>
  );
}
