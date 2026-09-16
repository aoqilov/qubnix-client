interface TaskProjectTagProps {
  label: string;
}

function TaskProjectTag({ label }: TaskProjectTagProps) {
  return (
    <span
      className="inline-flex items-center whitespace-nowrap text-xs font-semibold uppercase"
      style={{
        height: 24,
        padding: "4px 8px",
        gap: 6,
        borderRadius: "var(--radius-input, 8px)",
        background: "var(--brand-subtle-bg, #F1F0FE)",
        color: "var(--brand-default)",
      }}
    >
      {label}
    </span>
  );
}

export default TaskProjectTag;
