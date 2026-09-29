import { useTranslation } from "react-i18next";
import { LuChevronRight, LuUser } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { tasksLabel } from "@/utils/countLabels";

interface PersonalTileProps {
  tasksCount: number;
  onClick: () => void;
}

/** Shaxsiy maydon — sahifa enidagi keng karta. */
export function PersonalTile({ tasksCount, onClick }: PersonalTileProps) {
  const { t } = useTranslation();
  return (
    <CusCardbox
      onClick={onClick}
      role="button"
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex cursor-pointer items-center gap-4 rounded-card transition-colors hover:border-focus"
    >
      <span className="flex size-12 flex-none items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuUser size={20} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold text-primary">
          {t("doska.personal.title")}
        </span>
        <span className="block text-sm text-secondary">
          {t("doska.personal.today", { label: tasksLabel(tasksCount) })}
        </span>
      </span>

      <span className="flex flex-none items-center gap-2">
        <span className="text-2xl font-bold text-brand">{tasksCount}</span>
        <LuChevronRight size={20} className="text-disabled" />
      </span>
    </CusCardbox>
  );
}
