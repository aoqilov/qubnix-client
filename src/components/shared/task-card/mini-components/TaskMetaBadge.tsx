import type { ReactNode } from "react";

interface TaskMetaBadgeProps {
  icon?: ReactNode;
  label: string;
  bg: string;
  color?: string;
  /** Berilsa — yorliq oxiridagi "HH:MM" ostiga shu rangdagi chiziq tortiladi (boshlanish — yashil, tugash — qizil). */
  timeTone?: "success" | "error";
}

// Vaqt tagidagi chiziq rangi.
const TIME_TONE_BORDER = {
  success: "var(--status-success-solid)",
  error: "var(--status-error-solid)",
} as const;

function TaskMetaBadge({ icon, label, bg, color = "var(--text-primary)", timeTone }: TaskMetaBadgeProps) {
  // "12.10 00:00" -> ["12.10", "00:00"]; "Без срока" kabi vaqtsiz yorliqda chip yo'q.
  const match = timeTone ? label.match(/^(.*?)\s*(\d{2}:\d{2})$/) : null;
  return (
    <span
      // Kun/soat badge'lari (timeTone) kattaroq — kartada ular birinchi o'qiladi.
      className={`inline-flex items-center justify-center gap-1 whitespace-nowrap px-2 font-medium ${
        timeTone ? "h-8 text-base" : "h-6 text-xs"
      }`}
      style={{ background: bg, color, borderRadius: "var(--radius-input, 8px)" }}
    >
      {icon}
      {match && timeTone ? (
        <>
          {match[1] && <span>{match[1]}</span>}
          <span className="leading-6" style={{ borderBottom: `2px solid ${TIME_TONE_BORDER[timeTone]}` }}>
            {match[2]}
          </span>
        </>
      ) : (
        label
      )}
    </span>
  );
}

export default TaskMetaBadge;
