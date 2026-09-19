import { useEffect, useState } from "react";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { avatarColorVar } from "@/utils/avatarColor";
import { ProjectMemberSelectList } from "../components/ProjectMemberSelectList";
import { MOCK_AVAILABLE_MEMBERS } from "../lib/mockProjects";
import type { ProjectFormMember, ProjectMemberRole, ProjectStatsItem } from "../types";

interface EditProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  project: ProjectStatsItem | null;
  onSave: (input: { name: string; members: ProjectFormMember[] }) => void;
}

export function EditProjectDrawer({ open, onClose, project, onSave }: EditProjectDrawerProps) {
  const [name, setName] = useState("");
  // Loyihada qolayotgan mavjud xodimlar: userId -> rol.
  const [keptRoles, setKeptRoles] = useState<Record<string, ProjectMemberRole>>({});
  const [isAddingOpen, setAddingOpen] = useState(false);
  // Yangi qo'shilayotgan xodimlar: userId -> rol.
  const [additions, setAdditions] = useState<Record<string, ProjectMemberRole>>({});

  // Drawer har safar (boshqa proyekt uchun ham) ochilganda o'sha proyektning
  // joriy holatidan qayta boshlanadi.
  useEffect(() => {
    if (open && project) {
      setName(project.name);
      setKeptRoles(
        Object.fromEntries(project.members.map((member) => [member.id, member.role])),
      );
      setAddingOpen(false);
      setAdditions({});
    }
  }, [open, project]);

  if (!project) return null;

  const members = project.members.filter((member) => member.id in keptRoles);

  const availableMembers = MOCK_AVAILABLE_MEMBERS.filter(
    (member) => !(member.id in keptRoles),
  );

  const removeMember = (id: string) => {
    setKeptRoles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleAddition = (id: string) => {
    setAdditions((prev) => {
      if (id in prev) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: "project_member" };
    });
  };

  const setAdditionRole = (id: string, role: ProjectMemberRole) => {
    setAdditions((prev) => ({ ...prev, [id]: role }));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      members: [
        ...Object.entries(keptRoles).map(([userId, role]) => ({ userId, role })),
        ...Object.entries(additions).map(([userId, role]) => ({ userId, role })),
      ],
    });
    onClose();
  };

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      title="Изменить проект"
      footer={
        <div className="flex w-full gap-2">
          <CusButton variant="outline" className="flex-1" onClick={onClose}>
            Отмена
          </CusButton>
          <CusButton className="flex-1" isDisabled={!name.trim()} onClick={handleSave}>
            Сохранить
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <CusInput
          label="Название проекта"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-secondary">
            Сотрудники
          </span>

          {members.length === 0 && (
            <p className="py-4 text-center text-sm text-secondary">Сотрудники не добавлены</p>
          )}

          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 rounded-input border border-subtle p-2"
            >
              <span
                className="flex size-8 flex-none items-center justify-center rounded-avatar text-xs font-semibold text-on-brand"
                style={{ background: avatarColorVar(member.id) }}
              >
                {member.initials}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                {member.name}
              </span>
              <CusBadge tone={member.role === "project_manager" ? "brand" : "neutral"}>
                {member.role === "project_manager" ? "Manager" : "Xodim"}
              </CusBadge>
              <CusButton
                variant="outline"
                colorPalette="red"
                size="xs"
                onClick={() => removeMember(member.id)}
              >
                Убрать
              </CusButton>
            </div>
          ))}
        </div>

        {isAddingOpen ? (
          <div className="flex flex-col">
            <span className="mb-2 text-xs font-medium uppercase tracking-wide text-secondary">
              Добавить сотрудника
            </span>
            {availableMembers.length === 0 ? (
              <p className="py-4 text-center text-sm text-secondary">
                Все сотрудники уже добавлены
              </p>
            ) : (
              <ProjectMemberSelectList
                members={availableMembers}
                selections={additions}
                onToggle={toggleAddition}
                onRoleChange={setAdditionRole}
              />
            )}
          </div>
        ) : (
          <CusButton variant="outline" className="w-full" onClick={() => setAddingOpen(true)}>
            Добавить сотрудника
          </CusButton>
        )}
      </div>
    </CusDrawer>
  );
}
