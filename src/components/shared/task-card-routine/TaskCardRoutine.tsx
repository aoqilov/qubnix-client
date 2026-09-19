import { LuRepeat2 } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";
import TaskAvatarGroup, {
  type TaskCardMember,
} from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import TaskMetaBadge from "@/components/shared/task-card/mini-components/TaskMetaBadge";

interface TaskCardRoutineProps {
  title: string;
  projectLabel: string;

  active: boolean;
  onToggleActive: (active: boolean) => void;

  /** Masalan "Каждый день 09:00" — kunlik/haftalik/oylik/yillik matnini chaqiruvchi tayyorlaydi. */
  repeatLabel: string;
  /** Masalan "Следующее завтра в 09:00". */
  nextRunLabel: string;

  members: TaskCardMember[];
  overflowCount?: number;

  onEdit?: () => void;
  onDisable?: () => void;
}

function TaskCardRoutine({
  title,
  projectLabel,
  active,
  onToggleActive,
  repeatLabel,
  nextRunLabel,
  members,
  overflowCount,
  onEdit,
  onDisable,
}: TaskCardRoutineProps) {
  return (
    <CusCardbox className="flex flex-col gap-4 rounded-input">
      {/* Header */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex flex-1 flex-col">
          <span
            className="truncate"
            style={{
              color: "var(--text-primary, #0F172A)",
              fontSize: "var(--text-body, 16px)",
              fontWeight: 600,
            }}
          >
            {title}
          </span>
          <span
            className="truncate"
            style={{
              color: "var(--text-secondary, #64748B)",
              fontSize: "var(--text-caption, 12px)",
              fontWeight: 500,
            }}
          >
            {projectLabel}
          </span>
        </div>
        {/* CusSwitch ichidagi Field.Root width:100% oladi — o'rovchisiz butun
        qatorni egallab, switch o'zi chapga surilib qoladi. flex-none wrapper
        uni tarkib o'lchamiga qisqartiradi, shu bilan o'ng chetga yopishadi. */}
        <div className="flex-none">
          <CusSwitch checked={active} onCheckedChange={onToggleActive} />
        </div>
      </div>

      {/* Takrorlanish + keyingi ishga tushish */}
      <div className="flex flex-wrap items-center gap-3">
        <TaskMetaBadge
          icon={<LuRepeat2 size={14} />}
          label={repeatLabel}
          bg="var(--bg-surface-secondary, #E2E8F0)"
        />
        <span
          style={{
            color: "var(--text-secondary, #64748B)",
            fontSize: "var(--text-caption, 12px)",
            fontWeight: 500,
          }}
        >
          {nextRunLabel}
        </span>
      </div>

      {/* Avatarlar */}
      <TaskAvatarGroup members={members} overflowCount={overflowCount} />

      {/* Tugmalar */}
      <div className="flex gap-2">
        <CusButton
          variant="outline"
          size="sm"
          rounded="9999px"
          className="flex-1"
          style={{
            borderColor: "var(--brand-default)",
            color: "var(--brand-default)",
          }}
          onClick={onEdit}
        >
          Изменить
        </CusButton>
        <CusButton
          variant="outline"
          colorPalette="red"
          size="sm"
          rounded="9999px"
          className="flex-1"
          onClick={onDisable}
        >
          Отключить
        </CusButton>
      </div>
    </CusCardbox>
  );
}

export default TaskCardRoutine;
