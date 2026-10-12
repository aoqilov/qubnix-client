import { useTranslation } from "react-i18next";
import { LuKanban, LuList } from "react-icons/lu";
import type { TasksViewMode } from "@/hooks/useTasksViewMode";

const LABEL_KEY = {
  list: "tasks.desktop.viewList",
  board: "tasks.desktop.viewBoard",
} as const;

interface ViewModeSwitchProps {
  value: TasksViewMode;
  onChange: (mode: TasksViewMode) => void;
  /** "sm" — mobil filtr qatori uchun ixchamroq. */
  size?: "md" | "sm";
}

/** Ro'yxat / kanban toggle'i (desktop va mobil umumiy). */
export function ViewModeSwitch({ value, onChange, size = "md" }: ViewModeSwitchProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-none overflow-hidden rounded-input border border-default">
      {(["list", "board"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          aria-label={t(LABEL_KEY[mode])}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={`flex items-center justify-center transition-colors ${size === "sm" ? "size-[34px]" : "size-9"}`}
          // Chakra'ning button stillari bg sinfini bosadi — fon inline (token, hex emas).
          style={
            value === mode
              ? { background: "var(--brand-default)", color: "var(--text-on-brand)" }
              : { background: "var(--bg-surface)", color: "var(--text-secondary)" }
          }
        >
          {mode === "list" ? <LuList size={16} /> : <LuKanban size={16} />}
        </button>
      ))}
    </div>
  );
}
