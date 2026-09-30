import { useTranslation } from "react-i18next";
import { LuTriangleAlert } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface CancelInvitationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
  isLoading?: boolean;
  isError?: boolean;
}

export function CancelInvitationDialog({
  open,
  onClose,
  onConfirm,
  employeeName,
  isLoading = false,
  isError = false,
}: CancelInvitationDialogProps) {
  const { t } = useTranslation();
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title={t("members.cancelDialog.title")}
      size="sm"
      centered
      closeOnBackdrop={!isLoading}
      footer={
        <>
          <CusButton variant="outline" onClick={onClose} isDisabled={isLoading}>
            {t("common.actions.no")}
          </CusButton>
          <CusButton
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText={t("members.cancelDialog.cancelling")}
            style={{ background: "var(--status-error-solid)", color: "var(--text-on-brand)" }}
          >
            {t("members.cancelDialog.confirm")}
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
          <LuTriangleAlert size={18} color="var(--status-error-text)" />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            {t("members.cancelDialog.question", { name: employeeName })}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
            {t("members.cancelDialog.warning")}
          </p>
          {isError && (
            <p style={{ fontSize: 12, color: "var(--status-error-text)", marginTop: 8 }}>
              {t("members.cancelDialog.error")}
            </p>
          )}
        </div>
      </div>
    </CusDialog>
  );
}
