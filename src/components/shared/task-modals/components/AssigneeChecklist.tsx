import { useState } from "react";
import { CusCheckbox } from "@/components/ui/inputs/CusCheckbox";
import { avatarColorVar } from "@/utils/avatarColor";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";

/** Telegram avatar URL'i eskirgan/yopiq bo'lishi mumkin — yuklanmasa bosh harflarga qaytiladi. */
function MemberAvatar({ member }: { member: TaskCardMember }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (member.avatarUrl && failedUrl !== member.avatarUrl) {
    return (
      <img
        src={member.avatarUrl}
        alt={member.name}
        onError={() => setFailedUrl(member.avatarUrl ?? null)}
        className="size-8 flex-none rounded-avatar object-cover"
      />
    );
  }
  return (
    <span
      className="flex size-8 flex-none items-center justify-center rounded-avatar text-xs font-semibold text-on-brand"
      style={{ background: avatarColorVar(member.id) }}
    >
      {member.initials}
    </span>
  );
}

interface AssigneeChecklistProps {
  members: TaskCardMember[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  isLoading?: boolean;
}

export function AssigneeChecklist({
  members,
  selectedIds,
  onToggle,
  isLoading = false,
}: AssigneeChecklistProps) {
  if (isLoading) {
    return <p className="py-3 text-center text-sm text-secondary">Yuklanmoqda...</p>;
  }

  if (members.length === 0) {
    return <p className="py-3 text-center text-sm text-secondary">Xodimlar topilmadi</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {members.map((member) => {
        const isSelected = selectedIds.includes(member.id);
        return (
          <div
            key={member.id}
            onClick={() => onToggle(member.id)}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-input border p-2.5 transition ${
              isSelected ? "border-brand bg-brand-subtle" : "border-subtle bg-surface"
            }`}
          >
            <span onClick={(e) => e.stopPropagation()} className="flex-none">
              <CusCheckbox checked={isSelected} onChange={() => onToggle(member.id)} />
            </span>
            <MemberAvatar member={member} />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
              {member.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
