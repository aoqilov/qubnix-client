import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "@/store/workspace.store";
import { DoskaSectionHeader } from "./components/DoskaSectionHeader";
import { PersonalTasksCard } from "./components/PersonalTasksCard";
import { WorkspaceCard } from "./components/WorkspaceCard";
import { AddWorkspaceButton } from "./components/AddWorkspaceButton";
import { AcceptInvitationsButton } from "./components/AcceptInvitationsButton";
import { ModalAddWorkspace } from "./modals/ModalAddWorkspace";
import { InvitationsDrawer } from "./modals/InvitationsDrawer";
import { usePersonalSummary, useReceivedInvitations, useWorkspaceList } from "./hooks/useApiDoska";
import { formatBoardDate } from "./lib/formatBoardDate";
import { orgsLabel } from "@/utils/pluralRu";

export default function FeatureDoska() {
  const navigate = useNavigate();
  const selectWorkspace = useWorkspaceStore((s) => s.selectWorkspace);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isInvitationsOpen, setInvitationsOpen] = useState(false);

  const workspacesQuery = useWorkspaceList();
  const personalQuery = usePersonalSummary();
  const invitationsQuery = useReceivedInvitations();

  const workspaces = workspacesQuery.data ?? [];
  const invitationsCount = invitationsQuery.data?.length ?? 0;

  const openWorkspace = (id: string | undefined) => {
    if (!id) return;
    selectWorkspace(id);
    navigate(`/tasks?organizationId=${id}`);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <header>
        <h1 className="text-3xl font-bold leading-tight text-primary">
          Где будем работать?
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand">
          {formatBoardDate()}
        </p>
      </header>

      <section>
        <DoskaSectionHeader index="01" label="Личное" />
        {personalQuery.isPending ? (
          <CardSkeleton />
        ) : (
          <PersonalTasksCard
            tasksCount={personalQuery.data?.tasksCount ?? 0}
            onClick={() => openWorkspace(personalQuery.data?.id)}
          />
        )}
      </section>

      <section>
        <DoskaSectionHeader
          index="02"
          label="Workspace"
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
              Не удалось загрузить список. Обновите страницу.
            </p>
          ) : (
            workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                onClick={() => openWorkspace(workspace.id)}
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
