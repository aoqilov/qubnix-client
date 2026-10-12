import type { ReactNode } from "react";

export interface IconSegmentOption<T extends string> {
  value: T;
  icon: ReactNode;
  ariaLabel: string;
}

interface IconSegmentProps<T extends string> {
  options: IconSegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** "sm" — ixchamroq variant (sarlavha yonidagi toggle uchun). */
  size?: "md" | "sm";
}

/** Yumaloq "pill" ichidagi ikonkali segment (masalan sana/vaqt rejimi). */
export function IconSegment<T extends string>({ options, value, onChange, size = "md" }: IconSegmentProps<T>) {
  return (
    <div className={`flex rounded-full border border-default bg-surface ${size === "sm" ? "gap-0.5 p-0.5" : "gap-1 p-1"}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.ariaLabel}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`flex items-center justify-center rounded-full ${size === "sm" ? "size-7" : "size-9"}`}
            style={
              active
                ? { background: "var(--brand-default)", color: "var(--text-on-brand)" }
                : { color: "var(--text-secondary)" }
            }
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
}
