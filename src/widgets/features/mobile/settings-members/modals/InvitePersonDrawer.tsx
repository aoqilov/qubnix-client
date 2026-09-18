import { forwardRef, useEffect, useState } from "react";
import type React from "react";
import { LuChevronDown, LuFolderKanban, LuPlus, LuX } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import { ORGANIZATION_ROLE_LABELS } from "@/utils/roleLabels";
import { MOCK_PROJECTS } from "../lib/mockMembers";
import type { MockInvite, ProjectAssignment, ProjectMemberRole } from "../lib/mockMembers";

type InvitedRole = MockInvite["invitedRole"];

interface InvitePersonDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (invite: {
    contact: string;
    invitedRole: InvitedRole;
    projects: ProjectAssignment[];
  }) => void;
}

// CusMenuList'ning Menu.Trigger asChild'i trigger DOM node'iga pozitsiya
// hisoblash uchun o'z proplarini beradi — CusButton esa faqat o'zi bilgan
// nomlangan proplarni forward qiladi, qolganini yutib yuboradi, shu sabab
// menyu har doim (0,0)da chiqib qolardi. Shuning uchun bu yerda ...propsni
// to'liq spread qiladigan oddiy <button> ishlatiladi.
const ProjectTriggerButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }
>(function ProjectTriggerButton({ label, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className="flex min-w-0 flex-1 items-center gap-2 rounded-input border border-default bg-surface px-3 py-2 text-left text-sm font-medium text-primary hover:bg-surface-secondary"
    >
      <LuFolderKanban size={14} className="flex-none text-secondary" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <LuChevronDown size={14} className="flex-none text-secondary" />
    </button>
  );
});

function ProjectAssignmentRow({
  assignment,
  takenProjectIds,
  onChangeProject,
  onChangeRole,
  onRemove,
}: {
  assignment: ProjectAssignment;
  takenProjectIds: string[];
  onChangeProject: (projectId: string) => void;
  onChangeRole: (role: ProjectMemberRole) => void;
  onRemove: () => void;
}) {
  const project = MOCK_PROJECTS.find((p) => p.id === assignment.projectId);
  const projectItems = MOCK_PROJECTS.map((p) => ({
    value: p.id,
    label: p.name,
    disabled: p.id !== assignment.projectId && takenProjectIds.includes(p.id),
  }));

  return (
    <div className="flex items-center gap-2">
      <CusMenuList
        value={assignment.projectId}
        onValueChange={onChangeProject}
        items={projectItems}
        width={180}
        trigger={<ProjectTriggerButton label={project?.name ?? "Loyiha tanlang"} />}
      />
      <div className="flex-none">
        <CusSegment
          value={assignment.role}
          onValueChange={(v) => onChangeRole(v as ProjectMemberRole)}
          size="sm"
          layout="inline"
          items={[
            { id: "project_manager", label: "Менежер" },
            { id: "project_member", label: "A'zo" },
          ]}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="flex size-8 flex-none items-center justify-center rounded-input text-secondary hover:bg-surface-secondary"
      >
        <LuX size={16} />
      </button>
    </div>
  );
}

export function InvitePersonDrawer({ open, onClose, onSubmit }: InvitePersonDrawerProps) {
  const [contact, setContact] = useState("");
  const [role, setRole] = useState<InvitedRole>("member");
  const [projects, setProjects] = useState<ProjectAssignment[]>([]);

  // Drawer yopilganda forma tozalanadi — qayta ochilganda eski qiymat qolmasin.
  useEffect(() => {
    if (!open) {
      setContact("");
      setRole("member");
      setProjects([]);
    }
  }, [open]);

  const canSubmit = contact.trim().length > 0;
  const takenProjectIds = projects.map((p) => p.projectId);
  const canAddProject = projects.length < MOCK_PROJECTS.length;

  const addProjectRow = () => {
    const nextProject = MOCK_PROJECTS.find((p) => !takenProjectIds.includes(p.id));
    if (!nextProject) return;
    setProjects((prev) => [...prev, { projectId: nextProject.id, role: "project_member" }]);
  };

  const updateProjectRow = (index: number, patch: Partial<ProjectAssignment>) => {
    setProjects((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const removeProjectRow = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ contact: contact.trim(), invitedRole: role, projects });
  };

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      title="Odam qo'shish"
      footer={
        <div className="flex w-full gap-3">
          <CusButton variant="outline" colorPalette="gray" onClick={onClose} className="flex-1">
            Bekor qilish
          </CusButton>
          <CusButton
            onClick={handleSubmit}
            isDisabled={!canSubmit}
            className="flex-1"
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            Taklif yuborish
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <CusInput
          label="Telefon yoki Telegram username"
          isRequired
          placeholder="+998 90 123 45 67 yoki @username"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <div>
          <p className="mb-1.5 text-sm font-medium text-secondary">Rol</p>
          <CusSegment
            value={role}
            onValueChange={(v) => setRole(v as InvitedRole)}
            items={[
              { id: "admin", label: ORGANIZATION_ROLE_LABELS.admin },
              { id: "member", label: ORGANIZATION_ROLE_LABELS.member },
              { id: "viewer", label: ORGANIZATION_ROLE_LABELS.viewer },
            ]}
          />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-secondary">
            Loyihalarga biriktirish (ixtiyoriy)
          </p>
          <div className="flex flex-col gap-2">
            {projects.map((assignment, index) => (
              <ProjectAssignmentRow
                key={index}
                assignment={assignment}
                takenProjectIds={takenProjectIds}
                onChangeProject={(projectId) => updateProjectRow(index, { projectId })}
                onChangeRole={(projectRole) => updateProjectRow(index, { role: projectRole })}
                onRemove={() => removeProjectRow(index)}
              />
            ))}
          </div>
          {canAddProject && (
            <CusButton
              variant="plain"
              onClick={addProjectRow}
              className="mt-2 w-full"
              style={{
                height: "40px",
                width: "100%",
                border: "1px dashed var(--border-default)",
                borderRadius: "var(--radius-card)",
                color: "var(--brand-default)",
                fontWeight: 600,
              }}
              leftIcon={<LuPlus size={16} />}
            >
              Loyiha qo'shish
            </CusButton>
          )}
        </div>
      </div>
    </CusDrawer>
  );
}
