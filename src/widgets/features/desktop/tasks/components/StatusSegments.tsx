import type { StatusTabColor, StatusTabItem } from "@/components/shared/status-tab/StatusTab";

// Har bir segment o'z status rangida; aktivda — to'q fon, oq matn (mobil StatusTab bilan bir xil tokenlar).
const COLORS: Record<StatusTabColor, { soft: string; text: string; solid: string }> = {
  gray: { soft: "var(--bg-surface-secondary)", text: "var(--text-primary)", solid: "var(--text-secondary)" },
  brand: { soft: "var(--brand-subtle-bg)", text: "var(--brand-default)", solid: "var(--brand-default)" },
  success: { soft: "var(--status-success-bg)", text: "var(--status-success-text)", solid: "var(--status-success-solid)" },
  error: { soft: "var(--status-error-bg)", text: "var(--status-error-text)", solid: "var(--status-error-solid)" },
};

interface StatusSegmentsProps {
  items: StatusTabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

/** Desktop status tablari — to'liq en, teng 4 segment (1-rasm). */
export function StatusSegments({ items, activeId, onChange }: StatusSegmentsProps) {
  return (
    <div className="grid grid-cols-4 overflow-hidden rounded-card border border-subtle">
      {items.map((item) => {
        const c = COLORS[item.color];
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className="flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors"
            style={{
              background: isActive ? c.solid : c.soft,
              color: isActive ? "var(--text-on-brand)" : c.text,
            }}
          >
            {item.label}
            <span
              className="min-w-[22px] rounded-chip px-1.5 text-xs font-bold"
              style={{ background: "color-mix(in srgb, currentColor 16%, transparent)" }}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
