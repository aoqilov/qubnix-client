import { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { avatarColorVar } from "@/utils/avatarColor";
import { ORGANIZATION_ROLE_LABELS } from "@/utils/roleLabels";
import { useRemoveMember, useUpdateMemberRole } from "../hooks/useApiSettingsMembers";
import type {
  OrganizationMemberRole,
  RawOrganizationMember,
} from "@/api/organizations/organizations.types";

function initialsOf(member: RawOrganizationMember): string {
  return `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`.toUpperCase();
}

interface MemberActionsDrawerProps {
  open: boolean;
  onClose: () => void;
  member: RawOrganizationMember | null;
}

export function MemberActionsDrawer({ open, onClose, member }: MemberActionsDrawerProps) {
  const [isConfirmingDelete, setConfirmingDelete] = useState(false);

  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  // Drawer har safar (boshqa xodim uchun ham) ochilganda toza holatdan boshlanadi.
  useEffect(() => {
    if (open) {
      setConfirmingDelete(false);
      updateRole.reset();
      removeMember.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, member]);

  if (!member) return null;

  const handleRoleChange = (role: OrganizationMemberRole) => {
    if (role === member.organization_role) return;
    updateRole.mutate({ userId: member.id, role });
  };

  const handleRemove = () => {
    removeMember.mutate(member.id, { onSuccess: onClose });
  };

  return (
    <CusDrawer open={open} onClose={onClose} placement="end" size="full" title="Сотрудник">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 flex-none items-center justify-center rounded-avatar text-sm font-semibold text-on-brand"
            style={{ background: avatarColorVar(member.id) }}
          >
            {initialsOf(member)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-primary">
              {member.first_name} {member.last_name}
            </span>
            <span className="block truncate text-xs text-secondary">
              @{member.telegram_username}
            </span>
          </span>
        </div>

        {/* 1-qator: rol */}
        <div className="flex flex-col gap-2 rounded-card border border-subtle bg-surface p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-secondary">Rol</p>
          <CusSegment
            value={member.organization_role}
            onValueChange={(v) => handleRoleChange(v as OrganizationMemberRole)}
            items={[
              { id: "admin", label: ORGANIZATION_ROLE_LABELS.admin },
              { id: "member", label: ORGANIZATION_ROLE_LABELS.member },
              { id: "viewer", label: ORGANIZATION_ROLE_LABELS.viewer },
            ]}
          />
          {updateRole.isError && (
            <p className="text-xs text-error-strong">Rolni o'zgartirib bo'lmadi.</p>
          )}
        </div>

        {/* 2-qator: o'chirish */}
        {isConfirmingDelete ? (
          <div className="flex flex-col gap-2 rounded-card border border-subtle bg-surface p-3">
            <p className="text-sm font-medium text-primary">
              {member.first_name}ni tashkilotdan chiqarishni tasdiqlaysizmi?
            </p>
            {removeMember.isError && (
              <p className="text-xs text-error-strong">O'chirib bo'lmadi. Qayta urinib ko'ring.</p>
            )}
            <div className="flex gap-2">
              <CusButton
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmingDelete(false)}
                isDisabled={removeMember.isPending}
              >
                Bekor qilish
              </CusButton>
              <CusButton
                className="flex-1"
                colorPalette="red"
                isLoading={removeMember.isPending}
                onClick={handleRemove}
              >
                Ha, o'chirish
              </CusButton>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="flex items-center gap-2 rounded-card border border-subtle bg-surface p-3 text-left text-sm font-medium text-error-strong hover:bg-surface-secondary"
          >
            <LuTrash2 size={16} />
            Удалить
          </button>
        )}
      </div>
    </CusDrawer>
  );
}
