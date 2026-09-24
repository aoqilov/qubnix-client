import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";

export interface TaskCardSubtask {
  id: string;
  label: string;
  checked: boolean;
}

interface SubtaskItemProps {
  subtask: TaskCardSubtask;
  onChange?: (id: string, checked: boolean) => void;
  /** Routine shablonidagi kabi — faqat ko'rsatiladi, bosib bo'lmaydi. */
  readOnly?: boolean;
}

const POP_STYLE = `
@keyframes subtask-circle-pop {
  0% { transform: scale(0.6); }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
.subtask-circle-pop {
  animation: subtask-circle-pop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
`;

function SubtaskItem({ subtask, onChange, readOnly }: SubtaskItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClick = () => {
    if (readOnly) return;
    // Bajarilgan bandni qayta bosganda darhol bekor qilinmaydi — avval tasdiq so'raladi.
    if (subtask.checked) {
      setConfirmOpen(true);
      return;
    }
    onChange?.(subtask.id, true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={readOnly}
        className={`flex w-full items-center text-left transition-transform duration-150 ${
          readOnly ? "cursor-default" : "active:scale-[0.98]"
        }`}
        style={{
          padding: "var(--space-3, 12px)",
          gap: "var(--space-2, 8px)",
          borderRadius: "var(--radius-input, 8px)",
          background: "var(--bg-canvas, #F8FAFC)",
        }}
      >
        <style>{POP_STYLE}</style>
        <span
          key={subtask.checked ? "checked" : "unchecked"}
          className="subtask-circle-pop"
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
            transition: "background 0.15s ease, border-color 0.15s ease",
          }}
        >
          {subtask.checked && <LuCheck size={11} color="#fff" strokeWidth={3} />}
        </span>
        <span
          className="text-sm"
          style={{
            color: subtask.checked ? "var(--text-secondary)" : "var(--text-primary)",
            textDecoration: subtask.checked ? "line-through" : "none",
            transition: "color 0.2s ease",
          }}
        >
          {subtask.label}
        </span>
      </button>

      <CusDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Bandni qaytarish"
        size="sm"
        centered
        footer={
          <>
            <CusButton variant="outline" onClick={() => setConfirmOpen(false)}>
              Yo'q
            </CusButton>
            <CusButton
              onClick={() => {
                onChange?.(subtask.id, false);
                setConfirmOpen(false);
              }}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
            >
              Ha
            </CusButton>
          </>
        }
      >
        <p>
          Siz bu bandni bajarib bo'lgansiz. Uni qayta bajarilmagan holatga qaytarishni
          istaysizmi?
        </p>
      </CusDialog>
    </>
  );
}

export default SubtaskItem;
