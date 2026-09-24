import { isTelegramMiniApp } from "@/utils/platform";
import { useLayoutMode } from "@/hooks/useLayoutMode";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "qubnix" }: HeaderProps) {
  const layoutMode = useLayoutMode();

  return (
    <header className="relative flex h-12 flex-none items-center justify-center border-b border-[var(--border-default)] bg-[var(--bg-second)]">
      <span className="font-condensed text-base tracking-wide">{title}</span>
      <span className="absolute right-2 rounded bg-[var(--bg-hover)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
        TG: {String(isTelegramMiniApp())} | {layoutMode} {/* i18n-ignore — debug nishoni */}
      </span>
    </header>
  );
}
