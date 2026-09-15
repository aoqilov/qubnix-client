import { LuMoon, LuSun } from "react-icons/lu";
import { useSessionStore } from "@/store/session.store";
import { useUiStore } from "@/store/ui.store";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";
import { isTelegramMiniApp } from "@/utils/platform";
import { useLayoutMode } from "@/hooks/useLayoutMode";

export function Header() {
  const user = useSessionStore((s) => s.user);
  const isDarkMode = useUiStore((s) => s.isDarkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);
  const layoutMode = useLayoutMode();

  return (
    <header className="flex h-14 flex-none items-center justify-end gap-4 border-b border-[var(--border-default)] bg-[var(--bg-second)] px-5">
      <span className="rounded bg-[var(--bg-hover)] px-2 py-1 font-mono text-xs text-[var(--text-muted)]">
        TG: {String(isTelegramMiniApp())} | Layout: {layoutMode}
      </span>
      <div className="flex items-center gap-2">
        <LuSun size={15} className="text-[var(--text-muted)]" />
        <CusSwitch size="sm" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        <LuMoon size={15} className="text-[var(--text-muted)]" />
      </div>
      <span className="text-sm text-[var(--text-2)]">
        {user?.fullName ?? "..."}
      </span>
    </header>
  );
}
