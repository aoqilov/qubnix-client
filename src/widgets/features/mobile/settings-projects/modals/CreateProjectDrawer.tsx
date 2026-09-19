import { useEffect, useState } from "react";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { ProjectMemberSelectList } from "../components/ProjectMemberSelectList";
import { MOCK_AVAILABLE_MEMBERS } from "../lib/mockProjects";
import type { ProjectFormInput, ProjectMemberRole } from "../types";

interface CreateProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: ProjectFormInput) => void;
}

export function CreateProjectDrawer({ open, onClose, onCreate }: CreateProjectDrawerProps) {
  const [name, setName] = useState("");
  // userId -> tanlangan rol. Kalit borligi shu odam belgilanganini bildiradi.
  const [selections, setSelections] = useState<Record<string, ProjectMemberRole>>({});

  useEffect(() => {
    if (open) {
      setName("");
      setSelections({});
    }
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
    onCreate({
      name: name.trim(),
      members: Object.entries(selections).map(([userId, role]) => ({ userId, role })),
    });
    onClose();
  };

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      title="Новый проект"
      footer={
        <div className="flex w-full gap-2">
          <CusButton variant="outline" className="flex-1" onClick={onClose}>
            Отмена
          </CusButton>
          <CusButton className="flex-1" isDisabled={!name.trim()} onClick={handleCreate}>
            Создать
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <CusInput
          label="Название проекта"
          placeholder="Например, Редизайн"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex flex-col">
          <span className="mb-2 text-xs font-medium uppercase tracking-wide text-secondary">
            Сотрудники
          </span>

          <ProjectMemberSelectList
            members={MOCK_AVAILABLE_MEMBERS}
            selections={selections}
            onToggle={toggleMember}
            onRoleChange={setMemberRole}
          />
        </div>
      </div>
    </CusDrawer>
  );
}
