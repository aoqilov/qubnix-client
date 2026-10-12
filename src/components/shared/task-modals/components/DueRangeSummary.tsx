import { useTranslation } from "react-i18next";
import { LuArrowRight } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";

function formatDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface DueRangeSummaryProps {
  /** `start_at` (ISO). Yo'q bo'lsa — vazifa hozir boshlanadi. */
  startAt: string | null;
  /** `due_at` (ISO). Yo'q bo'lsa karta chiqmaydi. */
  endAt: string | null;
}

/** Vaqt maydoni tagidagi karta: boshlanish (yashil) → tugash (qizil), "kun soat" formatida. */
export function DueRangeSummary({ startAt, endAt }: DueRangeSummaryProps) {
  const { t } = useTranslation();
  if (!endAt) return null;
  return (
    <CusCardbox
      style={{ borderColor: "var(--brand-default)" }}
      className="flex items-center justify-between gap-2 rounded-card bg-surface"
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-secondary">
          {t("tasks.modal.startLabel")}
        </span>
        <span className="text-sm font-semibold text-success-strong">
          {formatDateTime(startAt ? new Date(startAt) : new Date())}
        </span>
      </div>
      <LuArrowRight size={16} className="flex-none text-secondary" />
      <div className="flex min-w-0 flex-col items-end gap-0.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-secondary">
          {t("tasks.modal.endLabel")}
        </span>
        <span className="text-sm font-semibold text-error-strong">{formatDateTime(new Date(endAt))}</span>
      </div>
    </CusCardbox>
  );
}
