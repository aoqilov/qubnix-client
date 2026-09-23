import { LuCheck } from "react-icons/lu";

interface StepIndicatorProps {
  step: 1 | 2;
}

export function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand">
        Шаг {step}/2
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`flex size-6 flex-none items-center justify-center rounded-avatar text-xs font-semibold ${
            step >= 1 ? "bg-brand text-on-brand" : "bg-surface-secondary text-secondary"
          }`}
        >
          {step > 1 ? <LuCheck size={14} /> : 1}
        </span>
        <span className="text-xs font-medium text-primary">Основная</span>
        <span className="mx-1 h-px flex-1 bg-[var(--border-default)]" />
        <span
          className={`flex size-6 flex-none items-center justify-center rounded-avatar text-xs font-semibold ${
            step >= 2 ? "bg-brand text-on-brand" : "bg-surface-secondary text-secondary"
          }`}
        >
          2
        </span>
        <span className="text-xs font-medium text-primary">Дополнительно</span>
      </div>
    </div>
  );
}
