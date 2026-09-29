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
        // Joy yetmasa matn 2 qatorga o'tadi — Chakra Button default'da nowrap va qat'iy balandlik.
        height: "auto",
        minHeight: "48px",
        paddingBlock: "8px",
        whiteSpace: "normal",
        lineHeight: 1.2,
        textAlign: "center",
        width: "100%",
        // Ochiq brend gradient — desktop /doska'dagi ActionTile bilan bir xil.
        background:
          "linear-gradient(135deg, var(--brand-subtle-bg), color-mix(in srgb, var(--brand-default) 16%, var(--bg-surface)))",
        border: "1px solid color-mix(in srgb, var(--brand-default) 20%, transparent)",
        borderRadius: "var(--radius-card)",
        color: "var(--brand-default)",
        fontWeight: 600,
      }}
      leftIcon={<LuPlus size={16} />}
    >
      {t("doska.addOrganization")}
    </CusButton>
  );
}
