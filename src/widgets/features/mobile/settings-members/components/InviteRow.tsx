import { LuClock } from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { ORGANIZATION_ROLE_LABELS } from "@/utils/roleLabels";
import type { MockInvite } from "../lib/mockMembers";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface InviteRowProps {
  invite: MockInvite;
}

export function InviteRow({ invite }: InviteRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-subtle bg-surface p-3">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-primary">
          {invite.contact}
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-xs text-secondary">
          <LuClock size={12} />
          {invite.sentDaysAgo} kun oldin
        </span>
        <CusBadge variant="subtle" tone="neutral">
          {ORGANIZATION_ROLE_LABELS[invite.invitedRole]}
        </CusBadge>
      </span>
      <div>
        <CusButton variant="outline" size="sm" colorPalette="red">
          bekor qilish
        </CusButton>
      </div>
    </div>
  );
}
