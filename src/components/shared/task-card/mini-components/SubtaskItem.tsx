import { LuCheck } from "react-icons/lu";

export interface TaskCardSubtask {
  id: string;
  label: string;
  checked: boolean;
}

interface SubtaskItemProps {
  subtask: TaskCardSubtask;
  onChange: (id: string, checked: boolean) => void;
}

function SubtaskItem({ subtask, onChange }: SubtaskItemProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(subtask.id, !subtask.checked)}
      className="flex w-full items-center text-left"
      style={{
        padding: "var(--space-3, 12px)",
        gap: "var(--space-2, 8px)",
        borderRadius: "var(--radius-input, 8px)",
        background: "var(--bg-canvas, #F8FAFC)",
      }}
    >
      <span
        style={{
          display: "flex",
          width: 18,
          height: 18,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-avatar, 9999px)",
          border: `1.5px solid ${subtask.checked ? "var(--brand-default)" : "var(--border-default)"}`,
          background: subtask.checked ? "var(--brand-default)" : "transparent",
        }}
      >
        {subtask.checked && <LuCheck size={11} color="#fff" strokeWidth={3} />}
      </span>
      <span className="text-sm text-primary">{subtask.label}</span>
    </button>
  );
}

export default SubtaskItem;
