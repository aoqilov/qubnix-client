export type TaskStatusColor = "brand" | "error" | "success" | "gray";

interface TaskStatusLabelProps {
  label: string;
  color: TaskStatusColor;
  /** Collapsed holatda fon yo'q (faqat rangli matn), expanded holatda fon bilan. */
  withBg?: boolean;
}

const COLOR_MAP: Record<TaskStatusColor, { text: string; bg: string }> = {
  brand: { text: "var(--brand-default)", bg: "var(--brand-subtle-bg)" },
  error: {
    text: "var(--status-error-solid, #F04438)",
    bg: "var(--status-error-bg)",
  },
  success: {
    text: "var(--status-success-solid)",
    bg: "var(--status-success-bg)",
  },
  gray: { text: "var(--text-secondary)", bg: "var(--bg-surface-secondary)" },
};

function TaskStatusLabel({
  label,
  color,
  withBg = false,
}: TaskStatusLabelProps) {
  const c = COLOR_MAP[color];

  return (
    <span
      className="ml-auto flex-none whitespace-nowrap font-medium"
      style={{
        color: c.text,
        background: withBg ? c.bg : "transparent",
        padding: withBg ? "4px 8px" : 0,
        borderRadius: withBg ? "var(--radius-input, 8px)" : 0,
        fontSize: "var(--text-caption, 12px)",
      }}
    >
      {label}
    </span>
  );
}

export default TaskStatusLabel;
