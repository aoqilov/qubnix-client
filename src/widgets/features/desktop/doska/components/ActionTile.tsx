import type { ReactNode } from "react";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusBadge } from "@/components/ui/badge/CusBadge";

interface ActionTileProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  /** O'ng yuqori burchakdagi son (masalan, kutilayotgan taklifnomalar). 0 bo'lsa ko'rinmaydi. */
  count?: number;
}

/** "Yangi tashkilot" / "Taklifnomalar" — tashkilotlar ro'yxati tepasidagi amal kartalari. */
export function ActionTile({ icon, label, onClick, count = 0 }: ActionTileProps) {
  return (
    <CusCardbox
      onClick={onClick}
      role="button"
      // Ochiq brend gradient — Chakra/Tailwind'da tayyor sinf yo'q, token'lar inline beriladi (hex emas).
      style={{
        background:
          "linear-gradient(135deg, var(--brand-subtle-bg), color-mix(in srgb, var(--brand-default) 16%, var(--bg-surface)))",
        borderColor: "color-mix(in srgb, var(--brand-default) 20%, transparent)",
      }}
      className="relative flex cursor-pointer items-center gap-3 rounded-card transition-colors hover:border-focus"
    >
      <span className="flex size-11 flex-none items-center justify-center rounded-avatar bg-surface text-brand">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-primary">{label}</span>
      {count > 0 && (
        <CusBadge tone="error" variant="solid" size="xs">
          {count}
        </CusBadge>
      )}
    </CusCardbox>
  );
}
