import { avatarColorVar } from "@/utils/avatarColor";

export interface TaskCardMember {
  id: string;
  initials: string;
}

interface TaskAvatarGroupProps {
  members: TaskCardMember[];
  overflowCount?: number;
  max?: number;
}

function TaskAvatarGroup({ members, overflowCount, max = 3 }: TaskAvatarGroupProps) {
  const visible = members.slice(0, max);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {visible.map((member, index) => (
          <span
            key={member.id}
            className="flex items-center justify-center text-xs font-semibold text-on-brand"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-avatar, 9999px)",
              background: avatarColorVar(member.id),
              marginLeft: index === 0 ? 0 : -8,
              border: "2px solid var(--bg-second)",
            }}
          >
            {member.initials}
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
    </div>
  );
}

export default TaskAvatarGroup;
