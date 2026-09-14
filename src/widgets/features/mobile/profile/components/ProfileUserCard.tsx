import { LuPencil } from "react-icons/lu";
import { useSessionStore } from "@/store/session.store";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

interface ProfileUserCardProps {
  onEdit: () => void;
}

export function ProfileUserCard({ onEdit }: ProfileUserCardProps) {
  const user = useSessionStore((s) => s.user);

  if (!user) return null;

  return (
    <CusCardbox className="flex items-center gap-4">
      {user.avatarUrl ? (
        <CusImagePreview
          src={user.avatarUrl}
          alt={user.fullName}
          width={56}
          height={56}
          objectFit="cover"
          preview={true}
        />
      ) : (
        <span className="flex h-14 w-14 flex-none items-center justify-center bg-vio font-condensed text-xl text-[var(--text-on-accent)]">
          {getInitials(user.fullName)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-lg font-semibold">{user.fullName}</div>
        <div className="mt-0.5 text-sm text-[var(--text-muted)]">
          {user.phone ? `  ${user.phone}` : ""}
        </div>
      </div>
      <button
        onClick={onEdit}
        aria-label="Profilni tahrirlash"
        className="flex-none rounded-lg p-2 transition hover:bg-[var(--bg-hover)]"
      >
        <LuPencil
          size={16}
          className="text-[var(--text-muted)]"
        />
      </button>
    </CusCardbox>
  );
}
