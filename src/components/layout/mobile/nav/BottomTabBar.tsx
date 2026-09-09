import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/tasks", label: "BUGUN" },
  { to: "/calendar", label: "KALENDAR" },
  { to: "/stats", label: "STATS" },
  { to: "/workspace-settings", label: "SOZLAMA" },
];

export function BottomTabBar() {
  return (
    <nav className="flex h-[52px] flex-none border-t border-neutral-300 bg-white">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-0.5 font-condensed text-[9px] tracking-wide ${
              isActive ? "bg-vio text-white" : "text-neutral-700"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
