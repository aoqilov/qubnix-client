import { useTranslation } from "react-i18next";
import { LuCheck, LuX } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusAccordion } from "@/components/ui/accordion/CusAccordion";
import { avatarColorVar } from "@/utils/avatarColor";
import { daysSince } from "@/utils/daysSince";
import { organizationRoleLabel, projectRoleLabel } from "@/utils/roleLabels";
import { useReceivedInvitations, useRespondInvitation } from "../hooks/useApiDoska";
import type { RawOrganizationInvitation } from "@/api/organization-invitations/organization-invitations.types";


interface InvitationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function InvitationsDrawer({ open, onClose }: InvitationsDrawerProps) {
  const { t } = useTranslation();
  const invitationsQuery = useReceivedInvitations();
  const respondMutation = useRespondInvitation();

  const invitations = invitationsQuery.data ?? [];

  const respond = (invitation: RawOrganizationInvitation, action: "accept" | "reject") => {
    respondMutation.mutate({ id: String(invitation.id), action });
  };

  return (
    <CusDrawer open={open} onClose={onClose} placement="end" size="full" title={t("doska.invitations.title")}>
      {invitationsQuery.isPending ? (
        <div className="flex flex-col gap-3">
          <InvitationSkeleton />
          <InvitationSkeleton />
        </div>
      ) : invitationsQuery.isError ? (
        <p className="text-sm text-error-strong">{t("doska.invitations.loadError")}</p>
      ) : invitations.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-secondary">
          {t("doska.invitations.empty")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {invitations.map((invitation) => {
            const isRespondingToThis =
              respondMutation.isPending && respondMutation.variables?.id === String(invitation.id);

            return (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                isResponding={isRespondingToThis}
                onAccept={() => respond(invitation, "accept")}
                onReject={() => respond(invitation, "reject")}
              />
            );
          })}
        </div>
      )}
    </CusDrawer>
  );
}

function InvitationCard({
  invitation,
  isResponding,
  onAccept,
  onReject,
}: {
  invitation: RawOrganizationInvitation;
  isResponding: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const { t } = useTranslation();
  const { organization, invited_by, projects } = invitation;

  return (
    <div className="rounded-card border border-subtle bg-surface p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 flex-none items-center justify-center rounded-avatar text-sm font-semibold text-inverse"
          style={{ background: avatarColorVar(organization.id) }}
        >
          {organization.name.trim().charAt(0).toUpperCase() || "?"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-primary">{organization.name}</p>
          <p className="text-xs text-secondary">
            {t("doska.invitations.from", {
              name: `${invited_by.first_name} ${invited_by.last_name}`,
            })}{" "}
            ·{" "}
            {t("doska.invitations.daysAgo", { count: daysSince(invitation.created_at) })}
          </p>
        </div>
        <CusBadge tone="brand">{organizationRoleLabel(invitation.role)}</CusBadge>
      </div>

      {projects.length > 0 && (
        <div className="mt-3">
          <CusAccordion
            items={[
              {
                value: "projects",
                title: t("doska.invitations.projects", { count: projects.length }),
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

      <div className="mt-3 flex gap-2">
        <CusButton
          variant="outline"
          colorPalette="red"
          onClick={onReject}
          isDisabled={isResponding}
          className="flex-1"
          leftIcon={<LuX size={16} />}
        >
          {t("doska.invitations.reject")}
        </CusButton>
        <CusButton
          onClick={onAccept}
          isDisabled={isResponding}
          isLoading={isResponding}
          className="flex-1"
          leftIcon={<LuCheck size={16} />}
          style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
        >
          {t("doska.invitations.accept")}
        </CusButton>
      </div>
    </div>
  );
}

function InvitationSkeleton() {
  return <div className="h-[104px] animate-pulse rounded-card border border-subtle bg-surface" />;
}
