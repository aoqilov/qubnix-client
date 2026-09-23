import { LuUserMinus } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface RemoveMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string | null;
}

export function RemoveMemberDialog({
  open,
  onClose,
  onConfirm,
  memberName,
}: RemoveMemberDialogProps) {
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Убрать сотрудника"
      size="sm"
      centered
      footer={
        <>
          <CusButton variant="outline" onClick={onClose}>
            Bekor qilish
          </CusButton>
          <CusButton
            onClick={onConfirm}
            style={{ background: "var(--status-error-solid)", color: "var(--text-on-brand)" }}
          >
            Убрать
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
          <LuUserMinus size={18} color="var(--status-error-text)" />
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--text-primary)" }}>{memberName}</strong> shu loyihadan
          olib tashlanadi. O'zgarish faqat "Сохранить" bosilgandan keyin kuchga kiradi.
        </p>
      </div>
    </CusDialog>
  );
}
