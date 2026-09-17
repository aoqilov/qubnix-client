import { LuTrash2 } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface TaskModalDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle?: string;
}

function TaskModalDelete({
  open,
  onClose,
  onConfirm,
  taskTitle,
}: TaskModalDeleteProps) {
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Vazifani o'chirish"
      size="sm"
      centered
      footer={
        <>
          <CusButton variant="outline" onClick={onClose}>
            Bekor qilish
          </CusButton>
          <CusButton
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              background: "var(--status-error-solid)",
              color: "var(--text-on-brand)",
            }}
          >
            O'chirish
          </CusButton>
        </>
      }
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: "50%",
            background: "var(--status-error-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LuTrash2 size={18} color="var(--status-error-text)" />
        </div>
        <div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {taskTitle}
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            Bu vazifa butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
          </p>
        </div>
      </div>
    </CusDialog>
  );
}

export default TaskModalDelete;
