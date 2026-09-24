import { useState } from "react";
import { LuCheck, LuCheckCheck } from "react-icons/lu";
import { avatarColorVar } from "@/utils/avatarColor";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { CusPopover } from "@/components/ui/popover/CusPopover";

export interface TaskCardMember {
  id: string;
  initials: string;
  name: string;
  avatarUrl?: string;
  /** vazifa xodimga yuborilgandan keyingi holati: sent — yuborildi, seen — xodim ko'rdi. */
  readStatus?: "sent" | "seen";
}

interface TaskAvatarGroupProps {
  members: TaskCardMember[];
  overflowCount?: number;
  max?: number;
}

const STACK_AVATAR_SIZE = 28;
const LIST_AVATAR_SIZE = 32;

function MemberAvatar({ member, size }: { member: TaskCardMember; size: number }) {
  // Telegram avatar URL'i eskirgan/yopiq bo'lishi mumkin — yuklanmasa bosh harflarga qaytiladi.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (member.avatarUrl && failedUrl !== member.avatarUrl) {
    return (
      <CusImagePreview
        src={member.avatarUrl}
        alt={member.name}
        width={size}
        height={size}
        borderRadius="var(--radius-avatar, 9999px)"
        preview={false}
        onError={() => setFailedUrl(member.avatarUrl ?? null)}
      />
    );
  }
  return (
    <span
      className="flex w-full items-center justify-center text-xs font-semibold text-on-brand"
      style={{ background: avatarColorVar(member.id) }}
    >
      {member.initials}
    </span>
  );
}

function TaskAvatarGroup({ members, overflowCount, max = 3 }: TaskAvatarGroupProps) {
  const visible = members.slice(0, max);

  return (
    <CusPopover
      trigger={
        <button type="button" className="flex items-center gap-2">
          <div className="flex items-center">
            {visible.map((member, index) => (
              <span
                key={member.id}
                style={{
                  width: STACK_AVATAR_SIZE,
                  height: STACK_AVATAR_SIZE,
                  borderRadius: "var(--radius-avatar, 9999px)",
                  marginLeft: index === 0 ? 0 : -8,
                  border: "2px solid var(--bg-second)",
                  overflow: "hidden",
                  flexShrink: 0,
                  display: "flex",
                }}
              >
                <MemberAvatar member={member} size={STACK_AVATAR_SIZE} />
              </span>
            ))}
          </div>
          {!!overflowCount && (
            <span
              className="whitespace-nowrap font-medium text-secondary"
              style={{ fontSize: "var(--text-caption, 12px)" }}
            >
              еще {overflowCount}
            </span>
          )}
        </button>
      }
      width={260}
    >
      <div className="flex flex-col gap-3 p-3">
        <span
          className="uppercase tracking-wide"
          style={{
            color: "var(--brand-default)",
            fontSize: "var(--text-caption, 12px)",
            fontWeight: 600,
          }}
        >
          Biriktirilgan xodimlar
        </span>

        <div className="flex flex-col gap-2.5">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <span
                style={{
                  width: LIST_AVATAR_SIZE,
                  height: LIST_AVATAR_SIZE,
                  borderRadius: "var(--radius-avatar, 9999px)",
                  border: "1.5px solid var(--border-default)",
                  overflow: "hidden",
                  flexShrink: 0,
                  display: "flex",
                }}
              >
                <MemberAvatar member={member} size={LIST_AVATAR_SIZE} />
              </span>
              <span
                className="flex-1 truncate text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {member.name}
              </span>
              {member.readStatus === "seen" ? (
                <LuCheckCheck size={16} color="var(--status-success-solid)" />
              ) : (
                <LuCheck size={16} color="var(--text-secondary)" />
              )}
            </div>
          ))}
        </div>

        <div
          className="flex flex-col gap-1 border-t pt-2"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <span
            className="flex items-center gap-1.5"
            style={{ fontSize: "var(--text-caption, 12px)", color: "var(--text-secondary)" }}
          >
            <LuCheck size={12} /> — vazifa yaratildi
          </span>
          <span
            className="flex items-center gap-1.5"
            style={{ fontSize: "var(--text-caption, 12px)", color: "var(--text-secondary)" }}
          >
            <LuCheckCheck size={12} color="var(--status-success-solid)" /> — xodim ko'rdi
          </span>
        </div>
      </div>
    </CusPopover>
  );
}

export default TaskAvatarGroup;
