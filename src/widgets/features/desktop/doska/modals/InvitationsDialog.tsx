import { useTranslation } from "react-i18next";
import { LuCheck, LuX } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { avatarColorVar } from "@/utils/avatarColor";
import { daysSince } from "@/utils/daysSince";
import { organizationRoleLabel, projectRoleLabel } from "@/utils/roleLabels";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { useReceivedInvitations, useRespondInvitation } from "../hooks/useApiDoska";
import type { RawOrganizationInvitation } from "@/api/organization-invitations/organization-invitations.types";

interface InvitationsDialogProps {
  open: boolean;
  onClose: () => void;
}

/** Kelgan taklifnomalar — desktop'da markazdagi dialog (mobil'da to'liq ekran drawer). */
export function InvitationsDialog({ open, onClose }: InvitationsDialogProps) {
  const { t } = useTranslation();
  const invitationsQuery = useReceivedInvitations();
  const respondMutation = useRespondInvitation();
  const invitations = invitationsQuery.data ?? [];

  return (
    <CusDialog open={open} onClose={onClose} title={t("doska.invitations.title")} size="md" centered>
      <div className="flex flex-col gap-4">
        {invitationsQuery.isPending ? (
          <div className="flex flex-col gap-3">
            <InvitationSkeleton />
            <InvitationSkeleton />
          </div>
        ) : invitationsQuery.isError ? (
          <p className="text-sm text-error-strong">{t("doska.invitations.loadError")}</p>
        ) : invitations.length === 0 ? (
          <p className="py-6 text-center text-sm text-secondary">{t("doska.invitations.empty")}</p>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
            {invitations.map((invitation) => (
              <InvitationRow
                key={invitation.id}
                invitation={invitation}
                isResponding={
                  respondMutation.isPending && respondMutation.variables?.id === String(invitation.id)
                }
                onRespond={(action) => respondMutation.mutate({ id: String(invitation.id), action })}
              />
            ))}
          </div>
        )}

        {respondMutation.isError && (
          <p className="text-xs text-error-strong">{getApiErrorMessage(respondMutation.error)}</p>
        )}
      </div>
    </CusDialog>
  );
}

function InvitationRow({
  invitation,
  isResponding,
  onRespond,
}: {
  invitation: RawOrganizationInvitation;
  isResponding: boolean;
  onRespond: (action: "accept" | "reject") => void;
}) {
  const { t } = useTranslation();
  const { organization, invited_by, projects } = invitation;

  return (
    <div className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span
          className="flex size-9 flex-none items-center justify-center rounded-avatar text-sm font-semibold text-on-brand"
          style={{ background: avatarColorVar(organization.id) }}
        >
          {organization.name.trim().charAt(0).toUpperCase() || "?"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-primary">{organization.name}</p>
          <p className="truncate text-xs text-secondary">
            {t("doska.invitations.from", {
              name: `${invited_by.first_name} ${invited_by.last_name}`,
            })}{" "}
            · {t("doska.invitations.daysAgo", { count: daysSince(invitation.created_at) })}
          </p>
        </div>
        <CusBadge tone="brand" size="xs">
          {organizationRoleLabel(invitation.role)}
        </CusBadge>
      </div>

      {projects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {projects.map((project) => (
            <CusBadge key={project.id} tone="neutral" size="xs">
              {project.name} · {projectRoleLabel(project.role)}
            </CusBadge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <CusButton
          variant="outline"
          colorPalette="red"
          size="sm"
          onClick={() => onRespond("reject")}
          isDisabled={isResponding}
          className="flex-1"
          leftIcon={<LuX size={14} />}
        >
          {t("doska.invitations.reject")}
        </CusButton>
        <CusButton
          size="sm"
          onClick={() => onRespond("accept")}
          isDisabled={isResponding}
          isLoading={isResponding}
          className="flex-1"
          leftIcon={<LuCheck size={14} />}
          style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
        >
          {t("doska.invitations.accept")}
        </CusButton>
      </div>
    </div>
  );
}

function InvitationSkeleton() {
  return <div className="h-[96px] animate-pulse rounded-card bg-surface-secondary" />;
}
