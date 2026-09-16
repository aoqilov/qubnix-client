import type { ReactNode } from "react";

interface TaskMetaBadgeProps {
  icon?: ReactNode;
  label: string;
  bg: string;
  color?: string;
}

function TaskMetaBadge({ icon, label, bg, color = "var(--text-primary)" }: TaskMetaBadgeProps) {
  return (
    <span
      className="inline-flex h-6 items-center justify-center gap-1 whitespace-nowrap px-2 text-xs font-medium"
      style={{ background: bg, color, borderRadius: "var(--radius-input, 8px)" }}
    >
      {icon}
      {label}
    </span>
  );
}

export default TaskMetaBadge;
