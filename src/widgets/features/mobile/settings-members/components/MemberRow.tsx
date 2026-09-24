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

interface MemberRowProps {
  member: RawOrganizationMember;
  onOpenActions: () => void;
}

export function MemberRow({ member, onOpenActions }: MemberRowProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 rounded-card border border-subtle bg-surface p-3">
      <span
        className="flex size-11 flex-none items-center justify-center rounded-avatar text-sm font-semibold text-on-brand"
        style={{ background: avatarColorVar(member.id) }}
      >
        {initialsOf(member)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-primary">
          {member.first_name} {member.last_name}
        </span>
        <span className="block truncate text-xs text-secondary">
          @{member.telegram_username} ·{" "}
          {t("members.since", { count: daysSince(member.created_at) })}
        </span>
        <span className="block truncate text-sm font-semibold text-secondary">
          {member.phone}
        </span>
      </span>
      <CusBadge variant="subtle" tone="neutral">
        {organizationRoleLabel(member.organization_role)}
      </CusBadge>
      <button
        type="button"
        onClick={onOpenActions}
        className="flex size-8 flex-none items-center justify-center rounded-input text-secondary hover:bg-surface-secondary"
      >
        <LuChevronRight size={16} />
      </button>
    </div>
  );
}
