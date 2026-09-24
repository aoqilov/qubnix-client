import { useTranslation } from "react-i18next";
import { useState } from "react";
import { LuClock } from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusAccordion } from "@/components/ui/accordion/CusAccordion";
import { organizationRoleLabel, projectRoleLabel } from "@/utils/roleLabels";
import { daysSince } from "@/utils/daysSince";
import { CancelInvitationDialog } from "../modals/CancelInvitationDialog";
import { useRespondToInvitation } from "../hooks/useApiInvitations";
import type { RawOrganizationInvitation } from "@/api/organization-invitations/organization-invitations.types";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface InviteRowProps {
  invite: RawOrganizationInvitation;
}

export function InviteRow({ invite }: InviteRowProps) {
  const { t } = useTranslation();
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const { employee, projects } = invite;
  const name = `${employee.first_name} ${employee.last_name}`.trim();
  const displayName = name || (employee.telegram_username ? `@${employee.telegram_username}` : t("members.unknownUser"));

  const respondToInvitation = useRespondToInvitation();

  const handleConfirmCancel = () => {
    respondToInvitation.mutate(
      { invitationId: String(invite.id), action: "reject" },
      { onSuccess: () => setConfirmOpen(false) },
    );
  };

  return (
    <div className="rounded-card border border-subtle bg-surface p-3">
      <div className="flex items-center gap-3">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-primary">
            {displayName}
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-xs text-secondary">
            <LuClock size={12} />
            {t("members.sentAgo", { count: daysSince(invite.created_at) })}
          </span>
          <CusBadge variant="subtle" tone="neutral">
            {organizationRoleLabel(invite.role)}
          </CusBadge>
        </span>
        <div>
          <CusButton
            variant="outline"
            size="sm"
            colorPalette="red"
            onClick={() => setConfirmOpen(true)}
          >
            {t("members.cancelInvite")}
          </CusButton>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="mt-3">
          <CusAccordion
            items={[
              {
                value: "projects",
                title: t("members.projectsCount", { count: projects.length }),
                content: (
                  <div className="flex flex-col gap-2">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm text-primary">
                          {project.name}
                        </span>
                        <CusBadge tone="neutral">{projectRoleLabel(project.role)}</CusBadge>
                      </div>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      <CancelInvitationDialog
        open={isConfirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          respondToInvitation.reset();
        }}
        onConfirm={handleConfirmCancel}
        employeeName={displayName}
        isLoading={respondToInvitation.isPending}
        isError={respondToInvitation.isError}
      />
    </div>
  );
}
