import { LuPlus } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface TaskAddButtonProps {
  onClick?: () => void;
}

// BottomTabBar.tsx'dagi bilan bir xil formula: tab bar balandligi (80px) +
// orasidagi bo'shliq + Telegram safe-area (oddiy brauzerda 0px).
export const TASK_ADD_BUTTON_OFFSET =
  "calc(80px + 12px + var(--tg-safe-area-inset-bottom, 0px) + var(--tg-content-safe-area-inset-bottom, 0px))";

function TaskAddButton({ onClick }: TaskAddButtonProps) {
  return (
    <div
      className="z-sticky fixed inset-x-0 px-4"
      style={{ bottom: TASK_ADD_BUTTON_OFFSET }}
    >
      <CusButton
        onClick={onClick}
        size="lg"
        rounded="9999px"
        className="w-full"
        leftIcon={<LuPlus size={18} />}
        style={{
          background: "var(--brand-default)",
          color: "var(--text-on-brand)",
        }}
      >
        Добавить задачу
      </CusButton>
    </div>
  );
}

export default TaskAddButton;
