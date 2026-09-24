import { useTranslation } from "react-i18next";
import { LuPlus } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface AddWorkspaceButtonProps {
  onClick: () => void;
}

export function AddWorkspaceButton({ onClick }: AddWorkspaceButtonProps) {
  const { t } = useTranslation();
  return (
    <CusButton
      variant="plain"
      onClick={onClick}
      className="w-full"
      // Brend gradient fon Chakra variantlarida yo'q, shuning uchun
      // token'lar inline style orqali beriladi (hex emas).
      style={{
        height: "48px",
        width: "100%",
        background: "linear-gradient(135deg, var(--brand-default), var(--brand-hover))",
        borderRadius: "var(--radius-card)",
        color: "var(--text-on-brand)",
        fontWeight: 600,
      }}
      leftIcon={<LuPlus size={16} />}
    >
      {t("doska.addOrganization")}
    </CusButton>
  );
}
