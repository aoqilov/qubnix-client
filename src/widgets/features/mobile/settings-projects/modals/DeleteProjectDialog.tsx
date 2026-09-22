import { LuTrash2 } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { ProjectStatsItem } from "../types";

interface DeleteProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  project: ProjectStatsItem | null;
  isLoading?: boolean;
}

export function DeleteProjectDialog({
  open,
  onClose,
  onConfirm,
  project,
  isLoading = false,
}: DeleteProjectDialogProps) {
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Удалить проект"
      size="sm"
      centered
      closeOnBackdrop={!isLoading}
      footer={
        <>
          <CusButton variant="outline" onClick={onClose} isDisabled={isLoading}>
            Bekor qilish
          </CusButton>
          <CusButton
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="O'chirilmoqda..."
            style={{ background: "var(--status-error-solid)", color: "var(--text-on-brand)" }}
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
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            {project?.name}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
            Loyiha, vazifalari va a'zo bog'lanishlari bilan birga butunlay o'chiriladi. Bu amalni
            ortga qaytarib bo'lmaydi.
          </p>
        </div>
      </div>
    </CusDialog>
  );
}
