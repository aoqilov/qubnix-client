import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/employees", label: "Xodimlar" },
  { to: "/roles", label: "Rollar" },
  { to: "/projects", label: "Loyihalar" },
  { to: "/team", label: "Jamoa" },
  { to: "/control", label: "Nazorat" },
  { to: "/settings", label: "Sozlamalar" },
  { to: "/preview", label: "UI" },
];

export function Sidebar() {
  return (
    <aside className="flex w-56 flex-none flex-col border-r border-neutral-300 bg-white">
      <div className="flex h-14 items-center px-5 font-condensed text-lg tracking-wide text-vio">
        qubnix
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium ${
                isActive ? "bg-vio text-white" : "text-neutral-700 hover:bg-neutral-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
