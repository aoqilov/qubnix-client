import { useSessionStore } from "@/store/session.store";

export function Header() {
  const user = useSessionStore((s) => s.user);

  return (
    <header className="flex h-14 flex-none items-center justify-end gap-3 border-b border-neutral-300 bg-white px-5">
      <span className="text-sm text-neutral-600">{user?.fullName ?? "..."}</span>
    </header>
  );
}
