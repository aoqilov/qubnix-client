import { LuBell } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";

interface AcceptInvitationsButtonProps {
  count: number;
  onClick: () => void;
}

export function AcceptInvitationsButton({ count, onClick }: AcceptInvitationsButtonProps) {
  return (
    <CusButton
      variant="plain"
      onClick={onClick}
      className="relative w-full"
      // Punktir chegara va brend rangi Chakra variantlarida yo'q, shuning uchun
      // token'lar inline style orqali beriladi (hex emas) — AddWorkspaceButton
      // bilan bir xil uslub, 2 ustunli qatorda juftlashadi.
      style={{
        height: "48px",
        width: "100%",
        border: "1px dashed var(--border-default)",
        borderRadius: "var(--radius-card)",
        color: "var(--brand-default)",
        fontWeight: 600,
      }}
      leftIcon={<LuBell size={16} />}
    >
      Приглашения
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
