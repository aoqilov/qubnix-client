import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { ProjectMemberSelectList } from "../components/ProjectMemberSelectList";
import { useCreateProject, useOrgMembersForNewProject } from "../hooks/useApiSettingsProjects";
import type { ProjectMemberRole } from "../types";
import { useWorkspaceStore } from "@/store/workspace.store";

interface CreateProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  organizationId: string | null;
}

export function CreateProjectDrawer({ open, onClose, organizationId }: CreateProjectDrawerProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  // userId -> tanlangan rol. Kalit borligi shu odam belgilanganini bildiradi.
  const [selections, setSelections] = useState<Record<string, ProjectMemberRole>>({});

  // Personal workspace'da boshqa xodim yo'q — ro'yxat ham, uning so'rovi ham kerak emas.
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const membersQuery = useOrgMembersForNewProject(organizationId, !isPersonal);
  const createProject = useCreateProject(organizationId);
  const availableMembers = membersQuery.data ?? [];

  useEffect(() => {
    if (open) {
      setName("");
      setSelections({});
      createProject.reset();
    }
    // createProject har renderda yangi obyekt, shuning uchun bog'liqlikda faqat `open`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleMember = (id: string) => {
    setSelections((prev) => {
      if (id in prev) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: "project_member" };
    });
  };

  const setMemberRole = (id: string, role: ProjectMemberRole) => {
    setSelections((prev) => ({ ...prev, [id]: role }));
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    createProject.mutate(
      {
        name: name.trim(),
        members: isPersonal
          ? undefined
          : Object.entries(selections).map(([userId, role]) => ({
              user_id: Number(userId),
              role,
            })),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      title={t("projects.newProject")}
      footer={
        <div className="flex w-full gap-2">
          <CusButton
            variant="outline"
            className="flex-1"
            onClick={onClose}
            isDisabled={createProject.isPending}
          >
            {t("common.actions.cancel")}
          </CusButton>
          <CusButton
            className="flex-1"
            isDisabled={!name.trim()}
            isLoading={createProject.isPending}
            loadingText={t("common.states.creating")}
            onClick={handleCreate}
          >
            {t("common.actions.create")}
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <CusInput
          label={t("projects.create.nameLabel")}
          placeholder={t("projects.create.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {createProject.isError && (
          <p className="text-sm text-error-strong">
            {t("projects.create.error")}
          </p>
        )}

        {!isPersonal && (
          <div className="flex flex-col">
            <span className="mb-2 text-xs font-medium uppercase tracking-wide text-secondary">
              {t("projects.members")}
            </span>

            {membersQuery.isPending ? (
              <p className="py-4 text-center text-sm text-secondary">{t("common.states.loading")}</p>
            ) : (
              <ProjectMemberSelectList
                members={availableMembers}
                selections={selections}
                onToggle={toggleMember}
                onRoleChange={setMemberRole}
              />
            )}
          </div>
        )}
      </div>
    </CusDrawer>
  );
}
