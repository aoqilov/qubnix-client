import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { OrganizationType } from "@/api/organizations/organizations.types";
import { DoskaSectionHeader } from "./components/DoskaSectionHeader";
import { PersonalTasksCard } from "./components/PersonalTasksCard";
import { WorkspaceCard } from "./components/WorkspaceCard";
import { AddWorkspaceButton } from "./components/AddWorkspaceButton";
import { AcceptInvitationsButton } from "./components/AcceptInvitationsButton";
import { ModalAddWorkspace } from "./modals/ModalAddWorkspace";
import { InvitationsDrawer } from "./modals/InvitationsDrawer";
import { usePersonalSummary, useReceivedInvitations, useWorkspaceList } from "./hooks/useApiDoska";
import { formatWeekdayDate } from "@/utils/formatWeekdayDate";
import { orgsLabel } from "@/utils/countLabels";

export default function FeatureDoska() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectWorkspace = useWorkspaceStore((s) => s.selectWorkspace);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isInvitationsOpen, setInvitationsOpen] = useState(false);

  const workspacesQuery = useWorkspaceList();
  const personalQuery = usePersonalSummary();
  const invitationsQuery = useReceivedInvitations();

  const workspaces = workspacesQuery.data ?? [];
  const invitationsCount = invitationsQuery.data?.length ?? 0;

  const openWorkspace = (id: string | undefined, type: OrganizationType) => {
    if (!id) return;
    selectWorkspace(id, type);
    navigate("/tasks");
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <header>
        <h1 className="text-3xl font-bold leading-tight text-primary">
          {t("doska.title")}
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand">
          {formatWeekdayDate()}
        </p>
      </header>

      <section>
        <DoskaSectionHeader index="01" label={t("doska.sections.personal")} />
        {personalQuery.isPending ? (
          <CardSkeleton />
        ) : (
          <PersonalTasksCard
            tasksCount={personalQuery.data?.tasksCount ?? 0}
            onClick={() => openWorkspace(personalQuery.data?.id, "personal")}
          />
        )}
      </section>

      <section>
        <DoskaSectionHeader
          index="02"
          label={t("doska.sections.organizations")}
          meta={workspacesQuery.isPending ? undefined : orgsLabel(workspaces.length)}
        />

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <AddWorkspaceButton onClick={() => setAddOpen(true)} />
            <AcceptInvitationsButton
              count={invitationsCount}
              onClick={() => setInvitationsOpen(true)}
            />
          </div>

          {workspacesQuery.isPending ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : workspacesQuery.isError ? (
            <p className="px-1 text-sm text-error-strong">
              {t("doska.listError")}
            </p>
          ) : (
            workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                onClick={() => openWorkspace(workspace.id, "organization")}
              />
            ))
          )}
        </div>
      </section>

      <ModalAddWorkspace open={isAddOpen} onClose={() => setAddOpen(false)} />
      <InvitationsDrawer open={isInvitationsOpen} onClose={() => setInvitationsOpen(false)} />
    </div>
  );
}

/** Karta balandligidagi yuklanish placeholder'i. */
function CardSkeleton() {
  return (
    <div className="h-[72px] animate-pulse rounded-card border border-subtle bg-surface" />
  );
}
