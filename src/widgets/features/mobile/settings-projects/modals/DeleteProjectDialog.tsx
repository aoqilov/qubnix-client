import { useTranslation } from "react-i18next";
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
  /** Backend xatosi — dialog ichida ko'rsatiladi, aks holda o'chirish jimgina "ishlamay" qoladi. */
  errorMessage?: string | null;
}

export function DeleteProjectDialog({
  open,
  onClose,
  onConfirm,
  project,
  isLoading = false,
  errorMessage,
}: DeleteProjectDialogProps) {
  const { t } = useTranslation();
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title={t("projects.delete.title")}
      size="sm"
      centered
      closeOnBackdrop={!isLoading}
      footer={
        <>
          <CusButton variant="outline" onClick={onClose} isDisabled={isLoading}>
            {t("common.actions.cancel")}
          </CusButton>
          <CusButton
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText={t("projects.delete.deleting")}
            style={{ background: "var(--status-error-solid)", color: "var(--text-on-brand)" }}
          >
            {t("common.actions.delete")}
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
            {t("projects.delete.text")}
          </p>
          {errorMessage && (
            <p className="mt-2 text-xs text-error-strong">{errorMessage}</p>
          )}
        </div>
      </div>
    </CusDialog>
  );
}
