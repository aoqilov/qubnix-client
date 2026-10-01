import { useTranslation } from "react-i18next";
import { forwardRef, useEffect, useState } from "react";
import { LuChevronDown, LuTrash2 } from "react-icons/lu";
import { SettingsModal, type SettingsModalVariant } from "@/components/shared/settings/SettingsModal";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import { avatarColorVar } from "@/utils/avatarColor";
import { organizationRoleLabel } from "@/utils/roleLabels";
import { useRemoveMember, useUpdateMemberRole } from "@/components/shared/settings/members/hooks/useApiSettingsMembers";
import type {
  OrganizationMemberRole,
  RawOrganizationMember,
} from "@/api/organizations/organizations.types";

// CusMenuList'ning Menu.Trigger asChild'i trigger DOM node'iga o'z proplarini (ref, onClick, aria-*)
// beradi — shuning uchun ...propsni to'liq spread qiladigan forwardRef button kerak.
const RoleTriggerButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; isOpen: boolean }
>(function RoleTriggerButton({ label, isOpen, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className="flex w-full min-w-0 items-center gap-2 rounded-input border border-default bg-surface px-3 py-2.5 text-left text-sm font-medium text-primary hover:bg-surface-secondary"
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <LuChevronDown
        size={14}
        className={`flex-none text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
});

function initialsOf(member: RawOrganizationMember): string {
  return `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`.toUpperCase();
}

interface MemberActionsDrawerProps {
  /** "dialog" — desktop, markazda; default "drawer" — mobil. */
  variant?: SettingsModalVariant;
  open: boolean;
  onClose: () => void;
  member: RawOrganizationMember | null;
}

export function MemberActionsDrawer({ variant = "drawer", open, onClose, member }: MemberActionsDrawerProps) {
  const { t } = useTranslation();
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
    <SettingsModal
      variant={variant}
      open={open}
      onClose={onClose}
      title={t("members.actions.title")}
    >
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
          <p className="text-xs font-medium uppercase tracking-wide text-secondary">{t("members.actions.role")}</p>
          <CusMenuList
            value={member.organization_role}
            onValueChange={(v) => handleRoleChange(v as OrganizationMemberRole)}
            items={[
              { value: "admin", label: organizationRoleLabel("admin") },
              { value: "member", label: organizationRoleLabel("member") },
              { value: "viewer", label: organizationRoleLabel("viewer") },
            ]}
            placement="bottom-start"
            width={240}
            trigger={(open) => (
              <RoleTriggerButton
                label={organizationRoleLabel(member.organization_role)}
                isOpen={open}
              />
            )}
          />
          {updateRole.isError && (
            <p className="text-xs text-error-strong">{t("members.actions.roleError")}</p>
          )}
        </div>

        {/* 2-qator: o'chirish */}
        {isConfirmingDelete ? (
          <div className="flex flex-col gap-2 rounded-card border border-subtle bg-surface p-3">
            <p className="text-sm font-medium text-primary">
              {t("members.actions.removeQuestion", { name: member.first_name })}
            </p>
            {removeMember.isError && (
              <p className="text-xs text-error-strong">{t("members.actions.removeError")}</p>
            )}
            <div className="flex gap-2">
              <CusButton
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmingDelete(false)}
                isDisabled={removeMember.isPending}
              >
                {t("common.actions.cancel")}
              </CusButton>
              <CusButton
                className="flex-1"
                colorPalette="red"
                isLoading={removeMember.isPending}
                onClick={handleRemove}
              >
                {t("members.actions.confirmRemove")}
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
            {t("common.actions.delete")}
          </button>
        )}
      </div>
    </SettingsModal>
  );
}
