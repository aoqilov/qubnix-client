interface HeaderProps {
  title?: string;
}

export function Header({ title = "qubnix" }: HeaderProps) {
  return (
    <header className="flex h-12 flex-none items-center justify-center border-b border-neutral-300 bg-white">
      <span className="font-condensed text-base tracking-wide">{title}</span>
    </header>
  );
}
