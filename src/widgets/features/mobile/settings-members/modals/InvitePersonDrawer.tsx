import { forwardRef, useEffect, useState } from "react";
import type React from "react";
import {
  LuChevronDown,
  LuCircleCheckBig,
  LuFolderKanban,
  LuPlus,
  LuSearch,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import { avatarColorVar } from "@/utils/avatarColor";
import { useCreateInvitation, useSearchEmployee } from "../hooks/useApiInvitations";
import type {
  InvitationPersonSummary,
  InvitationProjectInput,
  OrganizationRole,
  ProjectMemberRole,
  SearchProjectOption,
} from "@/api/organization-invitations/organization-invitations.types";

interface InvitePersonDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface ProjectAssignment {
  projectId: number;
  role: ProjectMemberRole;
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
      className="flex w-full min-w-0 items-center gap-2 rounded-input border border-default bg-surface px-3 py-2 text-left text-sm font-medium text-primary hover:bg-surface-secondary"
    >
      <LuFolderKanban size={14} className="flex-none text-secondary" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <LuChevronDown size={14} className="flex-none text-secondary" />
    </button>
  );
});

const RoleTriggerButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }
>(function RoleTriggerButton({ label, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className="flex w-full items-center justify-between gap-1.5 rounded-input border border-default bg-surface px-3 py-2 text-sm font-medium text-primary hover:bg-surface-secondary"
    >
      <span>{label}</span>
      <LuChevronDown size={14} className="flex-none text-secondary" />
    </button>
  );
});

const PROJECT_ROLE_LABELS: Record<ProjectMemberRole, string> = {
  project_manager: "Менежер",
  project_member: "A'zo",
};

function ToggleButtonGroup<T extends string>({
  value,
  onChange,
  options,
  size = "sm",
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  size?: "xs" | "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <CusButton
            key={option.value}
            size={size}
            variant={isActive ? "solid" : "outline"}
            rounded="9999px"
            onClick={() => onChange(option.value)}
            style={
              isActive
                ? { background: "var(--brand-default)", color: "var(--text-on-brand)" }
                : { borderColor: "var(--border-default)", color: "var(--text-secondary)" }
            }
          >
            {option.label}
          </CusButton>
        );
      })}
    </div>
  );
}

function EmployeeSearchRow({
  employee,
  isSelected,
  onSelect,
}: {
  employee: InvitationPersonSummary;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-input border p-2.5 text-left hover:bg-surface-secondary ${
        isSelected ? "border-brand" : "border-subtle"
      } bg-surface`}
    >
      <span
        className="flex size-9 flex-none items-center justify-center rounded-avatar text-xs font-semibold text-on-brand"
        style={{ background: avatarColorVar(employee.id) }}
      >
        {`${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-primary">
          {employee.first_name} {employee.last_name}
        </span>
        {employee.telegram_username && (
          <span className="block truncate text-xs text-secondary">
            @{employee.telegram_username}
          </span>
        )}
      </span>
      {isSelected && (
        <LuCircleCheckBig
          size={20}
          className="flex-none"
          style={{ color: "var(--status-success-text)" }}
        />
      )}
    </button>
  );
}

function ProjectAssignmentRow({
  assignment,
  projectOptions,
  takenProjectIds,
  roleRequired,
  onChangeProject,
  onChangeRole,
  onRemove,
}: {
  assignment: ProjectAssignment;
  projectOptions: SearchProjectOption[];
  takenProjectIds: number[];
  roleRequired: boolean;
  onChangeProject: (projectId: number) => void;
  onChangeRole: (role: ProjectMemberRole) => void;
  onRemove: () => void;
}) {
  const project = projectOptions.find((p) => p.id === assignment.projectId);
  const projectItems = projectOptions.map((p) => ({
    value: String(p.id),
    label: p.name,
    disabled: p.id !== assignment.projectId && takenProjectIds.includes(p.id),
  }));

  return (
    <div
      className={`grid items-center gap-2 ${
        roleRequired ? "grid-cols-[45%_45%_10%]" : "grid-cols-[1fr_10%]"
      }`}
    >
      <CusMenuList
        value={String(assignment.projectId)}
        onValueChange={(v) => onChangeProject(Number(v))}
        items={projectItems}
        width={180}
        trigger={
          <ProjectTriggerButton label={project?.name ?? "Loyiha tanlang"} />
        }
      />
      {roleRequired && (
        <CusMenuList
          value={assignment.role}
          onValueChange={(v) => onChangeRole(v as ProjectMemberRole)}
          items={[
            { value: "project_manager", label: PROJECT_ROLE_LABELS.project_manager },
            { value: "project_member", label: PROJECT_ROLE_LABELS.project_member },
          ]}
          width={140}
          trigger={<RoleTriggerButton label={PROJECT_ROLE_LABELS[assignment.role]} />}
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="flex size-8 items-center justify-center justify-self-center rounded-input text-secondary hover:bg-surface-secondary"
      >
        <LuX size={16} />
      </button>
    </div>
  );
}

export function InvitePersonDrawer({ open, onClose }: InvitePersonDrawerProps) {
  const [contact, setContact] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [role, setRole] = useState<OrganizationRole | null>(null);
  const [projects, setProjects] = useState<ProjectAssignment[]>([]);

  const createInvitation = useCreateInvitation();

  // Drawer yopilganda forma tozalanadi — qayta ochilganda eski qiymat qolmasin.
  useEffect(() => {
    if (!open) {
      setContact("");
      setDebouncedQuery("");
      setSelectedEmployeeId(null);
      setRole(null);
      setProjects([]);
      createInvitation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Har bosilgan tugmadan keyin emas, yozish to'xtagach so'raladi.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(contact.trim()), 400);
    return () => clearTimeout(id);
  }, [contact]);

  // Qidiruv matni o'zgarsa, avvalgi natijadan tanlangan xodim endi
  // ko'rinmaydigan ro'yxatga tegishli bo'lib qolmasligi kerak.
  useEffect(() => {
    setSelectedEmployeeId(null);
  }, [debouncedQuery]);

  const searchQuery = useSearchEmployee(debouncedQuery);
  const employees = searchQuery.data?.employees ?? [];
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) ?? null;
  const availableRoles = searchQuery.data?.roles ?? [];
  const availableProjects = searchQuery.data?.projects ?? [];

  // Boshqa xodim tanlanganda avvalgi rol/loyiha tanlovlari yangi odamga
  // tegishli bo'lmay qoladi, shuning uchun tozalanadi.
  useEffect(() => {
    setRole(availableRoles[0]?.code ?? null);
    setProjects([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployee?.id]);

  // Faqat "member" uchun loyihaga tanlangan rol (Менежер/A'zo) majburiy;
  // "viewer" ham loyihalarga biriktiriladi, lekin loyiha-darajasidagi rolsiz.
  const needsProjects = role === "member" || role === "viewer";
  const roleRequiredPerProject = role === "member";

  const takenProjectIds = projects.map((p) => p.projectId);
  const canAddProject = projects.length < availableProjects.length;

  const addProjectRow = () => {
    const nextProject = availableProjects.find((p) => !takenProjectIds.includes(p.id));
    if (!nextProject) return;
    setProjects((prev) => [...prev, { projectId: nextProject.id, role: "project_member" }]);
  };

  const updateProjectRow = (index: number, patch: Partial<ProjectAssignment>) => {
    setProjects((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const removeProjectRow = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = !!selectedEmployee && !!role && (!needsProjects || projects.length > 0);

  const handleSubmit = () => {
    if (!selectedEmployee || !role) return;

    const projectPayload: InvitationProjectInput[] | undefined = needsProjects
      ? projects.map((p) => ({
          id: p.projectId,
          ...(roleRequiredPerProject ? { role: p.role } : {}),
        }))
      : undefined;

    createInvitation.mutate(
      { user_id: selectedEmployee.id, role, projects: projectPayload },
      { onSuccess: onClose },
    );
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
          <CusButton
            variant="outline"
            colorPalette="gray"
            onClick={onClose}
            className="flex-1"
            isDisabled={createInvitation.isPending}
          >
            Bekor qilish
          </CusButton>
          <CusButton
            onClick={handleSubmit}
            isDisabled={!canSubmit}
            isLoading={createInvitation.isPending}
            loadingText="Yuborilmoqda..."
            className="flex-1"
            style={{
              background: "var(--brand-default)",
              color: "var(--text-on-brand)",
            }}
          >
            Taklif yuborish
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <CusInput
            label="Telefon yoki Telegram username"
            isRequired
            placeholder="+998 90 123 45 67 yoki @username"
            leftElement={<LuSearch size={16} />}
            leftElementWidth="2.25rem"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          {debouncedQuery.length > 0 && debouncedQuery.length < 3 && (
            <p className="text-xs text-secondary">Kamida 3 ta belgi kiriting</p>
          )}

          {debouncedQuery.length >= 3 && searchQuery.isFetching && (
            <p className="text-xs text-secondary">Qidirilmoqda...</p>
          )}

          {debouncedQuery.length >= 3 && !searchQuery.isFetching && searchQuery.isError && (
            <div className="flex items-center gap-2 rounded-input border border-subtle bg-surface p-2.5 text-xs text-error-strong">
              <LuTriangleAlert size={14} className="flex-none" />
              Qidiruvda xatolik yuz berdi. Qayta urinib ko'ring.
            </div>
          )}

          {debouncedQuery.length >= 3 &&
            !searchQuery.isFetching &&
            !searchQuery.isError &&
            employees.length === 0 && (
              <div className="flex items-center gap-2 rounded-input border border-subtle bg-surface p-2.5 text-xs text-error-strong">
                <LuTriangleAlert size={14} className="flex-none" />
                Foydalanuvchi topilmadi. U avval botga ro'yxatdan o'tgan
                bo'lishi kerak.
              </div>
            )}

          {employees.length > 0 && (
            <div className="flex max-h-[268px] flex-col gap-2 overflow-y-auto pr-1">
              {employees.map((emp) => (
                <EmployeeSearchRow
                  key={emp.id}
                  employee={emp}
                  isSelected={emp.id === selectedEmployeeId}
                  onSelect={() => setSelectedEmployeeId(emp.id)}
                />
              ))}
            </div>
          )}
        </div>

        {selectedEmployee && role && (
          <>
            <div>
              <p className="mb-1.5 text-sm font-medium text-secondary">Rol</p>
              <ToggleButtonGroup
                size="md"
                value={role}
                onChange={setRole}
                options={availableRoles.map((r) => ({ value: r.code, label: r.name }))}
              />
            </div>

            {needsProjects && (
              <div>
                <p className="mb-1.5 text-sm font-medium text-secondary">
                  Loyihalarga biriktirish
                </p>
                <div className="flex flex-col gap-2">
                  {projects.map((assignment, index) => (
                    <ProjectAssignmentRow
                      key={index}
                      assignment={assignment}
                      projectOptions={availableProjects}
                      takenProjectIds={takenProjectIds}
                      roleRequired={roleRequiredPerProject}
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
            )}

            {createInvitation.isError && (
              <p className="text-xs text-error-strong">
                Taklif yuborilmadi. Qayta urinib ko'ring.
              </p>
            )}
          </>
        )}
      </div>
    </CusDrawer>
  );
}
