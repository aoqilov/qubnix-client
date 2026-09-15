import { SegmentGroup } from "@chakra-ui/react";
import type React from "react";
import type { ReactNode } from "react";
import { LuLock } from "react-icons/lu";

const SCOPE = "cus-segment";

// Ranglar globals.css token'laridan keladi: aktiv element `--cus-segment-accent`
// (default: `--accent`), uning ustidagi matn esa `--text-on-accent`.
const segmentStyles = `
  .${SCOPE} [data-part="item"][data-state="checked"] {
    color: var(--text-on-accent) !important;
  }
  .${SCOPE} [data-part="item"]:not([data-disabled]):hover {
    color: var(--text-3) !important;
  }
`;

export interface SegmentItem {
  id?: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  textTitle?: string;
}

interface CusSegmentProps {
  items: SegmentItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  iconPosition?: "left" | "right";
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  layout?: "block" | "inline";
  /** Aktiv element rangi — default globals.css dagi `--accent` token'i. */
  accent?: string;
}

export const CusSegment = ({
  items,
  value,
  defaultValue,
  onValueChange,
  iconPosition = "left",
  size = "md",
  disabled,
  className,
  layout = "block",
  accent = "var(--accent)",
}: CusSegmentProps) => {
  return (
    <>
      <style>{segmentStyles}</style>
      <SegmentGroup.Root
        value={value}
        defaultValue={defaultValue ?? items[0]?.id ?? items[0]?.label ?? ""}
        onValueChange={(details) =>
          details.value != null && onValueChange?.(details.value)
        }
        size={size}
        disabled={disabled}
        className={`${SCOPE}${className ? ` ${className}` : ""}`}
        style={
          {
            "--cus-segment-accent": accent,
            background: "var(--bg-hover)",
            borderRadius: "10px",
            padding: "3px",
            gap: "2px",
            border: "1px solid var(--border-default)",
            display: layout === "block" ? "flex" : "inline-flex",
            width: layout === "block" ? "100%" : undefined,
          } as React.CSSProperties
        }
      >
        <SegmentGroup.Indicator
          style={{
            background: "var(--cus-segment-accent)",
            borderRadius: "7px",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.10), 0 0 0 1px var(--border-default)",
          }}
        />
        {items.map((item) => {
          const key = item.id ?? item.label;
          return (
            <SegmentGroup.Item
              key={key}
              value={key}
              disabled={item.disabled}
              style={{
                borderRadius: "7px",
                color: "var(--text-muted)",
                fontWeight: 500,
                transition: "color 0.15s ease",
                cursor: item.disabled ? "not-allowed" : "pointer",
                flex: layout === "block" ? 1 : undefined,
                justifyContent: layout === "block" ? "center" : undefined,
                alignItems: "center",
                height: "auto",
                minHeight: 36,
                paddingTop: 4,
                paddingBottom: 4,
                whiteSpace: "normal",
                textAlign: "center",
              }}
            >
              <SegmentGroup.ItemText style={{ color: "inherit" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "6px",
                    flexDirection:
                      iconPosition === "right" ? "row-reverse" : "row",
                    whiteSpace: "normal",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {item.disabled && (
                    <span
                      style={{
                        display: "inline-flex",
                        color: "inherit",
                        opacity: 0.7,
                      }}
                    >
                      <LuLock size={14} />
                    </span>
                  )}
                  {item.icon && (
                    <span
                      style={{
                        display: "inline-flex",
                        color: "inherit",
                        fontSize: "1em",
                        opacity: item.disabled ? 0.5 : 1,
                      }}
                    >
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </span>
              </SegmentGroup.ItemText>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
          );
        })}
      </SegmentGroup.Root>
    </>
  );
};

// Usage:
// const [tab, setTab] = useState("list");
//
// <CusSegment
//   value={tab}
//   onValueChange={setTab}
//   iconPosition="left"
//   items={[
//     { id: "list",  label: "Ro'yxat",   icon: <LuList /> },
//     { id: "chart", label: "Statistika", icon: <LuChartColumn /> },
//     { id: "map",   label: "Xarita",     icon: <LuMap /> },
//   ]}
// />
