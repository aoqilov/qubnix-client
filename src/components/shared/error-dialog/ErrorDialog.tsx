import { useTranslation } from "react-i18next";
import { LuCircleAlert } from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusDialog } from "@/components/ui/dialog/CusDialog";

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  /** Alohida qatorda, badge ichida ko'rsatiladigan qiymat (masalan telefon raqami). */
  badgeValue?: string;
  /** Yopish tugmasi matni — default common.errorDialog.confirm. */
  confirmLabel?: string;
}

function ErrorDialog({
  open,
  onClose,
  title,
  description,
  badgeValue,
  confirmLabel,
}: ErrorDialogProps) {
  const { t } = useTranslation();
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      size="sm"
      centered
      footer={
        <CusButton
          className="w-full"
          onClick={onClose}
          style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
        >
          {confirmLabel ?? t("common.errorDialog.confirm")}
        </CusButton>
      }
    >
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error-soft">
          <LuCircleAlert size={26} className="text-error-strong" />
        </span>
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        {badgeValue && (
          <CusBadge variant="surface" size="md">
            {badgeValue}
          </CusBadge>
        )}
        <p className="text-base leading-relaxed text-secondary">{description}</p>
      </div>
    </CusDialog>
  );
}

export default ErrorDialog;

// ─── Ishlatish misoli ────────────────────────────────────────────────────────
//
// const [open, setOpen] = useState(false);
//
// <ErrorDialog
//   open={open}
//   onClose={() => setOpen(false)}
//   title="Foydalanuvchi topilmadi"
//   description="Bu telefon raqami bilan hech kim ro'yxatdan o'tmagan. Avval Telegram bot orqali ro'yxatdan o'ting."
// />
