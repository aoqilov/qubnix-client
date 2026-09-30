import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { avatarColorVar } from "@/utils/avatarColor";
import { organizationRoleLabel } from "@/utils/roleLabels";
import type { RawOrganizationMember } from "@/api/organizations/organizations.types";

function initialsOf(member: RawOrganizationMember): string {
  return `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`.toUpperCase();
}

interface MemberTileProps {
  member: RawOrganizationMember;
  /** Berilmasa (viewer) — karta bosilmaydi. */
  onOpenActions?: () => void;
}

export function MemberTile({ member, onOpenActions }: MemberTileProps) {
  return (
    <CusCardbox
      onClick={onOpenActions}
      role={onOpenActions ? "button" : undefined}
      style={{ borderColor: "var(--border-subtle)" }}
      className={`flex items-center gap-3 rounded-card bg-surface p-3 transition-colors ${
        onOpenActions ? "cursor-pointer hover:border-focus" : ""
      }`}
    >
      <span
        className="flex size-9 flex-none items-center justify-center rounded-avatar text-xs font-semibold text-on-brand"
        style={{ background: avatarColorVar(member.id) }}
      >
        {initialsOf(member)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-primary">
          {member.first_name} {member.last_name}
        </span>
        <span className="truncate text-xs text-secondary">
          {member.telegram_username ? `@${member.telegram_username}` : member.phone}
        </span>
      </span>
      <CusBadge variant="subtle" tone="brand" size="sm">
        {organizationRoleLabel(member.organization_role)}
      </CusBadge>
    </CusCardbox>
  );
}
