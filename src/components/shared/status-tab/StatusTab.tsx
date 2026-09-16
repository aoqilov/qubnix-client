import { useEffect, useRef } from "react";

export type StatusTabColor = "gray" | "brand" | "success" | "error";

export interface StatusTabItem {
  id: string;
  label: string;
  count: number;
  color: StatusTabColor;
}

interface StatusTabProps {
  items: StatusTabItem[];
  activeId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

// Har bir rang uchun ikki holat — nofaol (soft fon + rangli matn) va aktiv
// (to'q/solid fon + oq matn). Barchasi globals.css semantik token'laridan
// (dark/light avtomatik moslashadi).
const COLOR_MAP: Record<
  StatusTabColor,
  { bgSoft: string; text: string; bgSolid: string }
> = {
  gray: {
    bgSoft: "var(--bg-surface-secondary)",
    text: "var(--text-primary)",
    bgSolid: "var(--text-secondary)",
  },
  brand: {
    bgSoft: "var(--brand-subtle-bg)",
    text: "var(--brand-default)",
    bgSolid: "var(--brand-default)",
  },
  success: {
    bgSoft: "var(--status-success-bg)",
    text: "var(--status-success-text)",
    bgSolid: "var(--status-success-solid)",
  },
  error: {
    bgSoft: "var(--status-error-bg)",
    text: "var(--status-error-text)",
    bgSolid: "var(--status-error-solid)",
  },
};

function StatusTab({ items, activeId, onChange, className }: StatusTabProps) {
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  // Aktiv holat bosilganda/tashqaridan o'zgarganda ko'rinadigan hudud
  // markaziga skroll qiladi.
  useEffect(() => {
    if (!activeId) return;
    itemRefs.current[activeId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  return (
    <div
      className={`flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
    >
      {items.map((item) => {
        const colors = COLOR_MAP[item.color];
        const isActive = item.id === activeId;
        const Tag = onChange ? "button" : "div";

        return (
          <Tag
            key={item.id}
            ref={(el: HTMLElement | null) => {
              itemRefs.current[item.id] = el;
            }}
            type={onChange ? "button" : undefined}
            onClick={onChange ? () => onChange(item.id) : undefined}
            className="flex flex-none items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{
              background: isActive ? colors.bgSolid : colors.bgSoft,
              color: isActive ? "var(--text-on-brand)" : colors.text,
              cursor: onChange ? "pointer" : "default",
            }}
          >
            <span className="whitespace-nowrap">{item.label}</span>
            <span className="whitespace-nowrap font-bold">{item.count}</span>
          </Tag>
        );
      })}
    </div>
  );
}

export default StatusTab;

// ─── Ishlatish misoli ────────────────────────────────────────────────────────
//
// <StatusTab
//   items={[
//     { id: "assigned",   label: "Berildi",      count: 2, color: "gray" },
//     { id: "in_progress", label: "Jarayonda",    count: 2, color: "brand" },
//     { id: "done",        label: "Bajarildi",    count: 1, color: "success" },
//     { id: "failed",      label: "Bajarilmadi",  count: 1, color: "error" },
//   ]}
//   activeId="in_progress"
//   onChange={setActiveId}
// />
