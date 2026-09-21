import { LuCheck, LuX } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusAccordion } from "@/components/ui/accordion/CusAccordion";
import { avatarColorVar } from "@/utils/avatarColor";
import { daysSince } from "@/utils/daysSince";
import { ORGANIZATION_ROLE_LABELS } from "@/utils/roleLabels";
import { useReceivedInvitations, useRespondInvitation } from "../hooks/useApiDoska";
import type {
  ProjectMemberRole,
  RawOrganizationInvitation,
} from "@/api/organization-invitations/organization-invitations.types";

const PROJECT_ROLE_LABELS: Record<ProjectMemberRole, string> = {
  project_manager: "Менеджер",
  project_member: "Участник",
};

interface InvitationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function InvitationsDrawer({ open, onClose }: InvitationsDrawerProps) {
  const invitationsQuery = useReceivedInvitations();
  const respondMutation = useRespondInvitation();

  const invitations = invitationsQuery.data ?? [];

  const respond = (invitation: RawOrganizationInvitation, action: "accept" | "reject") => {
    respondMutation.mutate({ id: String(invitation.id), action });
  };

  return (
    <CusDrawer open={open} onClose={onClose} placement="end" size="full" title="Приглашения">
      {invitationsQuery.isPending ? (
        <div className="flex flex-col gap-3">
          <InvitationSkeleton />
          <InvitationSkeleton />
        </div>
      ) : invitationsQuery.isError ? (
        <p className="text-sm text-error-strong">Не удалось загрузить приглашения.</p>
      ) : invitations.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-secondary">
          Пока нет новых приглашений
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
            От {invited_by.first_name} {invited_by.last_name} ·{" "}
            {daysSince(invitation.created_at)} дн. назад
          </p>
        </div>
        <CusBadge tone="brand">{ORGANIZATION_ROLE_LABELS[invitation.role]}</CusBadge>
      </div>

      {projects.length > 0 && (
        <div className="mt-3">
          <CusAccordion
            items={[
              {
                value: "projects",
                title: `Проекты (${projects.length})`,
                content: (
                  <div className="flex flex-col gap-2">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm text-primary">
                          {project.name}
                        </span>
                        <CusBadge tone="neutral">{PROJECT_ROLE_LABELS[project.role]}</CusBadge>
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
          Отклонить
        </CusButton>
        <CusButton
          onClick={onAccept}
          isDisabled={isResponding}
          isLoading={isResponding}
          className="flex-1"
          leftIcon={<LuCheck size={16} />}
          style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
        >
          Принять
        </CusButton>
      </div>
    </div>
  );
}

function InvitationSkeleton() {
  return <div className="h-[104px] animate-pulse rounded-card border border-subtle bg-surface" />;
}
