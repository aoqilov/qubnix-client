import { useTranslation } from "react-i18next";
import { LuChevronRight, LuUser } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { tasksLabel } from "@/utils/countLabels";

interface PersonalTasksCardProps {
  tasksCount: number;
  onClick: () => void;
}

export function PersonalTasksCard({ tasksCount, onClick }: PersonalTasksCardProps) {
  const { t } = useTranslation();
  return (
    <CusCardbox
      onClick={onClick}
      // CusCardbox default'da --border-default beradi; mockup'da chegara
      // ancha yumshoq, shuning uchun inline style bilan --border-subtle.
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex cursor-pointer items-center gap-3 rounded-card transition-colors hover:border-focus"
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-surface-secondary text-secondary">
        <LuUser size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-primary">{t("doska.personal.title")}</span>
        <span className="block text-xs text-secondary">{t("doska.personal.today", { label: tasksLabel(tasksCount) })}</span>
      </span>

      <span className="flex flex-none items-center gap-1">
        <span className="text-xl font-bold text-brand">{tasksCount}</span>
        <LuChevronRight size={18} className="text-disabled" />
      </span>
    </CusCardbox>
  );
}
