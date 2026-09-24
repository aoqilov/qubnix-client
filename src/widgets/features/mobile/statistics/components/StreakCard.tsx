import { useTranslation } from "react-i18next";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { daysLabel, daysWordLabel } from "@/utils/countLabels";
import type { StreakSummary } from "../types";

interface StreakCardProps {
  streak: StreakSummary;
}

export function StreakCard({ streak }: StreakCardProps) {
  const { t } = useTranslation();
  return (
    <CusCardbox
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex flex-col gap-3 rounded-card bg-surface"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{t("statistics.streak.title")}</span>
        <span className="text-[11px] font-medium text-secondary">
          {t("statistics.streak.lastDays", { label: daysLabel(streak.windowDays) })}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-condensed text-3xl font-bold leading-none text-brand">{streak.current}</span>
        <span className="text-sm font-medium text-secondary">{daysWordLabel(streak.current)}</span>
      </div>

      <div className="flex items-center justify-between gap-1">
        {streak.activeDays.map((active, index) => (
          <span
            key={index}
            className={`size-2.5 flex-none rounded-full ${active ? "bg-brand" : "bg-surface-secondary"}`}
          />
        ))}
      </div>
    </CusCardbox>
  );
}
