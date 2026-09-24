import { useTranslation } from "react-i18next";
import { LuChevronRight } from "react-icons/lu";
import { avatarColorVar } from "@/utils/avatarColor";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { organizationRoleLabel } from "@/utils/roleLabels";
import { daysSince } from "@/utils/daysSince";
import type { RawOrganizationMember } from "@/api/organizations/organizations.types";

function initialsOf(member: RawOrganizationMember): string {
  return `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`.toUpperCase();
}

interface MemberCardProps {
  member: RawOrganizationMember;
  onOpenActions: () => void;
}

export function MemberCard({ member, onOpenActions }: MemberCardProps) {
  const { t } = useTranslation();
  return (
    <div className="relative flex flex-col items-center gap-2 rounded-card border border-subtle bg-surface p-3 text-center">
      <button
        type="button"
        onClick={onOpenActions}
        className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-input text-secondary hover:bg-surface-secondary"
      >
        <LuChevronRight size={14} />
      </button>
      <span
        className="flex size-11 flex-none items-center justify-center rounded-avatar text-sm font-semibold text-on-brand"
        style={{ background: avatarColorVar(member.id) }}
      >
        {initialsOf(member)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-primary">
          {member.first_name}
        </span>
        <span className="block truncate text-xs text-secondary">
          @{member.telegram_username}
        </span>
        {member.phone && (
          <span className="block truncate text-xs text-secondary">
            {member.phone}
          </span>
        )}
        <span className="block truncate text-[10px] text-disabled">
          {t("members.since", { count: daysSince(member.created_at) })}
        </span>
      </span>
      <CusBadge variant="subtle" tone="neutral">
        {organizationRoleLabel(member.organization_role)}
      </CusBadge>
    </div>
  );
}
