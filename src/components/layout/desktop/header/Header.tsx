import { LuMoon, LuSun } from "react-icons/lu";
import { useSessionStore } from "@/store/session.store";
import { useUiStore } from "@/store/ui.store";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";

export function Header() {
  const user = useSessionStore((s) => s.user);
  const isDarkMode = useUiStore((s) => s.isDarkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);

  return (
    <header className="flex h-14 flex-none items-center justify-end gap-4 border-b border-neutral-300 bg-white px-5 dark:border-white/10 dark:bg-[var(--bg-second)]">
      <div className="flex items-center gap-2">
        <LuSun size={15} className="text-neutral-400 dark:text-[var(--text-muted)]" />
        <CusSwitch size="sm" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        <LuMoon size={15} className="text-neutral-400 dark:text-[var(--text-muted)]" />
      </div>
      <span className="text-sm text-neutral-600 dark:text-[var(--text-2)]">
        {user?.fullName ?? "..."}
      </span>
    </header>
  );
}
