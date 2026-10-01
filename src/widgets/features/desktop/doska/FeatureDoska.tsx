import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuBuilding2, LuPlus } from "react-icons/lu";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { OrganizationType } from "@/api/organizations/organizations.types";
import { formatWeekdayDate } from "@/utils/formatWeekdayDate";
import { orgsLabel } from "@/utils/countLabels";
import { PersonalTile } from "./components/PersonalTile";
import { WorkspaceTile } from "./components/WorkspaceTile";
import { ActionTile } from "./components/ActionTile";
import { CreateWorkspaceDialog } from "./modals/CreateWorkspaceDialog";
import { InvitationsDialog } from "./modals/InvitationsDialog";
import { usePersonalSummary, useReceivedInvitations, useWorkspaceList } from "./hooks/useApiDoska";

export default function FeatureDoska() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectWorkspace = useWorkspaceStore((s) => s.selectWorkspace);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isInvitationsOpen, setInvitationsOpen] = useState(false);

  const workspacesQuery = useWorkspaceList();
  const personalQuery = usePersonalSummary();
  const invitationsQuery = useReceivedInvitations();
  const workspaces = workspacesQuery.data ?? [];

  const openWorkspace = (id: string | undefined, type: OrganizationType) => {
    if (!id) return;
    selectWorkspace(id, type);
    navigate("/tasks");
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <CusPageTitle className="" title={t("doska.title")} subtitle={formatWeekdayDate()} />

      {/* Shaxsiy vazifalar — to'liq en */}
      <section>
        {personalQuery.isPending ? (
          <div className="h-[82px] animate-pulse rounded-card border border-subtle bg-surface" />
        ) : (
          <PersonalTile
            tasksCount={personalQuery.data?.tasksCount ?? 0}
            onClick={() => openWorkspace(personalQuery.data?.id, "personal")}
          />
        )}
      </section>

      {/* Amallar — yangi tashkilot va taklifnomalar (ikkalasi ham markazdagi dialog) */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <ActionTile
            icon={<LuPlus size={20} />}
            label={t("doska.addOrganization")}
            onClick={() => setCreateOpen(true)}
          />
          <ActionTile
            icon={<LuBell size={20} />}
            label={t("doska.invitations.button")}
            count={invitationsQuery.data?.length ?? 0}
            onClick={() => setInvitationsOpen(true)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader
          label={t("doska.sections.organizations")}
          meta={workspacesQuery.isPending ? undefined : orgsLabel(workspaces.length)}
        />

        {/* Tashkilotlar — 2 ustun */}
        {workspacesQuery.isPending ? (
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[82px] animate-pulse rounded-card border border-subtle bg-surface"
              />
            ))}
          </div>
        ) : workspacesQuery.isError ? (
          <p className="px-1 text-sm text-error-strong">{t("doska.listError")}</p>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-default py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
              <LuBuilding2 size={20} />
            </span>
            <p className="text-sm text-secondary">{t("doska.emptyOrganizations")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {workspaces.map((workspace) => (
              <WorkspaceTile
                key={workspace.id}
                workspace={workspace}
                onClick={() => openWorkspace(workspace.id, "organization")}
              />
            ))}
          </div>
        )}
      </section>

      <CreateWorkspaceDialog open={isCreateOpen} onClose={() => setCreateOpen(false)} />
      <InvitationsDialog open={isInvitationsOpen} onClose={() => setInvitationsOpen(false)} />
    </div>
  );
}

/** Bo'lim sarlavhasi — chapda nom, o'ngda son. */
function SectionHeader({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-secondary">{label}</span>
      {meta && <span className="text-xs font-medium text-secondary">{meta}</span>}
    </div>
  );
}
