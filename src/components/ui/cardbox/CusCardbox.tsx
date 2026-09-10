import type { HTMLAttributes, ReactNode } from "react";

interface CusCardboxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CusCardbox({
  children,
  className = "",
  ...props
}: CusCardboxProps) {
  return (
    <div
      className={`border border-neutral-300 bg-white p-4 dark:border-white/10 dark:bg-[var(--bg-second)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
