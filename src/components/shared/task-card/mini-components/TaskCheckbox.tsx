import { LuCheck, LuX } from "react-icons/lu";
import type { TaskStatusColor } from "./TaskStatusLabel";

interface TaskCheckboxProps {
  /** Vazifaning joriy statusi — success (bajarildi) va error (bajarilmadi)
   * to'ldirilgan belgi bilan ko'rsatiladi, qolganlarida oddiy bo'sh checkbox. */
  color: TaskStatusColor;
}

const FILLED_COLOR: Partial<Record<TaskStatusColor, string>> = {
  success: "var(--status-success-solid)",
  error: "var(--status-error-solid)",
};

// Bosilishi mumkinligini bildirish uchun sekin "nafas olish" animatsiyasi —
// faqat hali hech qanday status tanlanmagan (bo'sh) holatda ko'rinadi.
const PULSE_STYLE = `
@keyframes task-checkbox-pulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--brand-subtle-bg); }
  50% { box-shadow: 0 0 0 4px var(--brand-subtle-bg); }
}
.task-checkbox-pulse {
  animation: task-checkbox-pulse 1.8s ease-in-out infinite;
}
`;

// Faqat vizual indikator — bosish holatini CusMenuList trigger tugmasi
// (TaskCard.tsx) boshqaradi, shuning uchun bu yerda o'z <button>/onClick'i yo'q.
function TaskCheckbox({ color }: TaskCheckboxProps) {
  const filled = FILLED_COLOR[color];

  return (
    <span
      className={!filled ? "task-checkbox-pulse" : undefined}
      style={{
        display: "flex",
        width: 18,
        height: 18,
        flexShrink: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
        border: `1.5px solid ${filled ?? "var(--border-default)"}`,
        background: filled ?? "transparent",
        transition: "transform 0.15s ease, background 0.15s ease, border-color 0.15s ease",
      }}
    >
      <style>{PULSE_STYLE}</style>
      {color === "success" && <LuCheck size={13} color="var(--text-on-brand)" strokeWidth={3} />}
      {color === "error" && <LuX size={13} color="var(--text-on-brand)" strokeWidth={3} />}
    </span>
  );
}

export default TaskCheckbox;
