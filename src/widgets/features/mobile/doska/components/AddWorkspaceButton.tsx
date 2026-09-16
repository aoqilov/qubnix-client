import { LuPlus } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface AddWorkspaceButtonProps {
  onClick: () => void;
}

export function AddWorkspaceButton({ onClick }: AddWorkspaceButtonProps) {
  return (
    <CusButton
      variant="plain"
      onClick={onClick}
      className="w-full"
      // Punktir chegara va brend rangi Chakra variantlarida yo'q, shuning uchun
      // token'lar inline style orqali beriladi (hex emas).
      style={{
        height: "48px",
        width: "100%",
        border: "1px dashed var(--border-default)",
        borderRadius: "var(--radius-card)",
        color: "var(--brand-default)",
        fontWeight: 600,
      }}
      leftIcon={<LuPlus size={16} />}
    >
      Новый workspace
    </CusButton>
  );
}
