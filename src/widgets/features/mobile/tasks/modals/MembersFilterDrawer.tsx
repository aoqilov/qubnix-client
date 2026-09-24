import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LuCheckCheck, LuX } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { AssigneeChecklist } from "@/components/shared/task-modals/components/AssigneeChecklist";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";

interface MembersFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Aktiv loyihadagi xodimlar. */
  members: TaskCardMember[];
  selectedIds: string[];
  /** "Qo'llash" bosilganda — bo'sh massiv "hammasi" degani. */
  onApply: (ids: string[]) => void;
}

/** Tanlov drawer ichida qoralama sifatida yuradi — faqat "Qo'llash" bosilganda filtrga tushadi. */
export function MembersFilterDrawer({
  open,
  onClose,
  members,
  selectedIds,
  onApply,
}: MembersFilterDrawerProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (open) setDraft(selectedIds);
  }, [open, selectedIds]);

  function toggle(id: string) {
    setDraft((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      title={t("tasks.membersFilter.title")}
      footer={
        <>
          <CusButton variant="outline" className="flex-1" onClick={onClose}>
            {t("common.actions.cancel")}
          </CusButton>
          <CusButton
            className="flex-1"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            {t("common.actions.apply")}
          </CusButton>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <CusButton
            variant="outline"
            size="xs"
            rounded="9999px"
            className="flex-1"
            leftIcon={<LuCheckCheck size={14} />}
            isDisabled={members.length === 0 || draft.length === members.length}
            onClick={() => setDraft(members.map((m) => m.id))}
            style={{ borderColor: "var(--brand-default)", color: "var(--brand-default)" }}
          >
            {t("common.actions.selectAll")}
          </CusButton>
          <CusButton
            variant="outline"
            size="xs"
            rounded="9999px"
            className="flex-1"
            leftIcon={<LuX size={14} />}
            isDisabled={draft.length === 0}
            onClick={() => setDraft([])}
          >
            {t("common.actions.clearAll")}
          </CusButton>
        </div>
        <span className="text-xs font-medium text-secondary">
          {draft.length > 0
            ? t("tasks.membersFilter.selected", { count: draft.length })
            : t("tasks.membersFilter.noneSelected")}
        </span>
        <AssigneeChecklist members={members} selectedIds={draft} onToggle={toggle} />
      </div>
    </CusDrawer>
  );
}
