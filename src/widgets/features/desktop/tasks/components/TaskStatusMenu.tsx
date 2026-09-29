import { FaRightLeft } from "react-icons/fa6";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import TaskCheckbox from "@/components/shared/task-card/mini-components/TaskCheckbox";
import type { TaskStatusColor } from "@/components/shared/task-card/mini-components/TaskStatusLabel";
import { buildTaskStatusMenuOptions } from "@/components/shared/task-card/taskStatusMeta";

interface TaskStatusMenuProps {
  statusId: string;
  color: TaskStatusColor;
  /** Faqat ko'rish (viewer, o'tgan kun) — checkbox bosilmaydi. */
  readOnly?: boolean;
  onChange: (nextStatusId: string) => void;
}

/** Checkbox ko'rinishidagi status tanlovi — mobil TaskCard'dagi bilan bir xil xatti-harakat. */
export function TaskStatusMenu({ statusId, color, readOnly, onChange }: TaskStatusMenuProps) {
  if (readOnly) {
    return (
      <span className="flex flex-none items-center justify-center">
        <TaskCheckbox color={color} />
      </span>
    );
  }
  return (
    // Qator bosilganda drawer ochiladi — menyu bosilishi qatorga o'tmasin.
    <span className="flex flex-none" onClick={(e) => e.stopPropagation()}>
      <CusMenuList
        trigger={(open) => (
          <button
            type="button"
            className="flex flex-none items-center justify-center transition-transform duration-150 hover:scale-125 active:scale-90"
          >
            <span
              className="flex items-center justify-center transition-transform duration-200 ease-out"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              {open ? <FaRightLeft size={13} color="var(--brand-default)" /> : <TaskCheckbox color={color} />}
            </span>
          </button>
        )}
        items={buildTaskStatusMenuOptions().map((opt) => ({
          value: opt.id,
          label: opt.label,
          icon: opt.icon,
          iconColor: opt.iconColor,
        }))}
        value={statusId}
        onValueChange={onChange}
        width={180}
      />
    </span>
  );
}
