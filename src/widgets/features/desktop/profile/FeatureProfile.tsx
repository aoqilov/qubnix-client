import { useSessionStore } from "@/store/session.store";
import { CusBadge } from "@/components/ui/badge/CusBadge";

export default function FeatureProfile() {
  const user = useSessionStore((s) => s.user);

  return (
    <div>
      <h1 className="mb-4 font-condensed text-lg tracking-wide">Profil</h1>
      <div className="flex max-w-sm flex-col gap-3 border border-neutral-300 bg-white p-4 dark:border-white/10 dark:bg-[var(--bg-second)]">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-[var(--text-muted)]">
            F.I.O
          </div>
          <div className="mt-1 font-medium">{user?.fullName ?? "..."}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-[var(--text-muted)]">
            Rol
          </div>
          <CusBadge colorPalette="purple" variant="surface">
            {user?.role ?? "..."}
          </CusBadge>
        </div>
      </div>
    </div>
  );
}
