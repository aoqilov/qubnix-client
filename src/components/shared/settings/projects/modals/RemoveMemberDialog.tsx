import { useTranslation } from "react-i18next";
import { LuUserMinus } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface RemoveMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string | null;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function RemoveMemberDialog({
  open,
  onClose,
  onConfirm,
  memberName,
  isLoading = false,
  errorMessage,
}: RemoveMemberDialogProps) {
  const { t } = useTranslation();
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title={t("projects.removeMember.title")}
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
            style={{ background: "var(--status-error-solid)", color: "var(--text-on-brand)" }}
          >
            {t("common.actions.remove")}
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
        <div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--text-primary)" }}>{memberName}</strong>{" "}
            {t("projects.removeMember.textAfterName")}
          </p>
          {errorMessage && <p className="mt-2 text-xs text-error-strong">{errorMessage}</p>}
        </div>
      </div>
    </CusDialog>
  );
}
