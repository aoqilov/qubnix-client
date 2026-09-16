import type React from "react";
import { useEffect, useRef } from "react";

export interface ProjectTabItem {
  id: string;
  projectName: string;
  projectTaskCount: number;
}

interface ProjectsTabsProps {
  tabs: ProjectTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  /** Aktiv tab foni (va uning badge matn rangi) — default globals.css dagi `--brand-default` token'i. */
  accent?: string;
}

function ProjectsTabs({
  tabs,
  activeId,
  onChange,
  className,
  accent = "var(--brand-default)",
}: ProjectsTabsProps) {
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Aktiv tab bosilganda ko'rinadigan hudud markaziga skroll qiladi — shu
  // orqali undan keyin/oldin yana tablar borligi ko'rinib turadi.
  useEffect(() => {
    itemRefs.current[activeId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  return (
    <div
      className={`flex h-10 w-full items-center gap-1 overflow-x-auto rounded-md bg-surface-secondary p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
      style={{ "--projects-tabs-accent": accent } as React.CSSProperties}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              itemRefs.current[tab.id] = el;
            }}
            type="button"
            onClick={() => onChange(tab.id)}
            className={
              isActive
                ? "flex flex-none items-center gap-2 rounded-md px-4 py-1 font-semibold text-on-brand"
                : "flex flex-none items-center gap-1.5 rounded-md px-3 py-1 font-medium text-secondary transition-colors hover:text-primary"
            }
            style={isActive ? { background: "var(--projects-tabs-accent)" } : undefined}
          >
            <span className="whitespace-nowrap">{tab.projectName}</span>
            <span
              className="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface px-1.5 text-xs font-semibold"
              style={{ color: isActive ? "var(--projects-tabs-accent)" : "var(--text-secondary)" }}
            >
              {tab.projectTaskCount}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ProjectsTabs;
