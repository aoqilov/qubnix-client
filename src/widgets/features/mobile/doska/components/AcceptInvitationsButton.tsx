import { useTranslation } from "react-i18next";
import { LuBell } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";

interface AcceptInvitationsButtonProps {
  count: number;
  onClick: () => void;
}

export function AcceptInvitationsButton({ count, onClick }: AcceptInvitationsButtonProps) {
  const { t } = useTranslation();
  return (
    <CusButton
      variant="plain"
      onClick={onClick}
      className="relative w-full"
      // Brend gradient fon Chakra variantlarida yo'q, shuning uchun
      // token'lar inline style orqali beriladi (hex emas) — AddWorkspaceButton
      // bilan bir xil uslub, 2 ustunli qatorda juftlashadi.
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
      leftIcon={<LuBell size={16} />}
    >
      {t("doska.invitations.button")}
      {count > 0 && (
        <span className="absolute -right-2 -top-2">
          <CusBadge tone="error" variant="solid" size="xs">
            {count}
          </CusBadge>
        </span>
      )}
    </CusButton>
  );
}
