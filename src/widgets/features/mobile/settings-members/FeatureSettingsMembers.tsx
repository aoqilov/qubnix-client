import { useMemo, useState } from "react";
import { LuSearchX, LuPlus } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { MembersToolbar } from "./components/MembersToolbar";
import { MemberRow } from "./components/MemberRow";
import { MemberCard } from "./components/MemberCard";
import { InviteRow } from "./components/InviteRow";
import { InvitePersonDrawer } from "./modals/InvitePersonDrawer";
import { useMemberViewStyle } from "./hooks/useMemberViewStyle";
import {
  MOCK_INVITES,
  MOCK_MEMBERS,
  MOCK_WORKSPACE_NAME,
} from "./lib/mockMembers";
import type { MemberRoleFilter, MockInvite } from "./lib/mockMembers";

type MembersTab = "general" | "invites";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuSearchX size={20} />
      </span>
      <p className="text-sm font-medium text-primary">Hech narsa topilmadi</p>
      <p className="text-xs text-secondary">Qidiruv yoki filtrni o'zgartirib ko'ring</p>
    </div>
  );
}

function CountPill({ count }: { count: number }) {
  return (
    <span
      className="inline-flex min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold"
      style={{
        background: "color-mix(in srgb, currentColor 18%, transparent)",
      }}
    >
      {count}
    </span>
  );
}

export default function FeatureSettingsMembers() {
  const [tab, setTab] = useState<MembersTab>("general");
  const [search, setSearch] = useState("");
  const [viewStyle, setViewStyle] = useMemberViewStyle();
  const [roleFilter, setRoleFilter] = useState<MemberRoleFilter>("all");
  const [invites, setInvites] = useState<MockInvite[]>(MOCK_INVITES);
  const [isInviteOpen, setInviteOpen] = useState(false);

  const handleInviteSubmit = (input: Pick<MockInvite, "contact" | "invitedRole" | "projects">) => {
    setInvites((prev) => [
      { id: `i-${Date.now()}`, sentDaysAgo: 0, ...input },
      ...prev,
    ]);
    setInviteOpen(false);
  };

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return MOCK_MEMBERS.filter((member) => {
      const matchesRole = roleFilter === "all" || member.organization_role === roleFilter;
      const matchesQuery =
        !query ||
        `${member.first_name} ${member.last_name} ${member.telegram_username ?? ""}`
          .toLowerCase()
          .includes(query);
      return matchesRole && matchesQuery;
    });
  }, [search, roleFilter]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title="Сотрудники" />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {MOCK_WORKSPACE_NAME.toUpperCase()} - {MOCK_MEMBERS.length}{" "}
        пользователей
      </p>

      <CusSegment
        value={tab}
        onValueChange={(v) => setTab(v as MembersTab)}
        iconPosition="right"
        items={[
          {
            id: "general",
            label: "Общее",
            icon: <CountPill count={MOCK_MEMBERS.length} />,
          },
          {
            id: "invites",
            label: "Приглашения",
            icon: <CountPill count={invites.length} />,
          },
        ]}
      />

      {tab === "general" ? (
        <>
          <div className="sticky top-0 z-sticky -mx-4 bg-canvas px-4 py-2">
            <MembersToolbar
              value={search}
              onValueChange={setSearch}
              viewStyle={viewStyle}
              onViewStyleChange={setViewStyle}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
            />
          </div>
          {filteredMembers.length === 0 ? (
            <EmptyState />
          ) : viewStyle === "card" ? (
            <div className="grid grid-cols-3 gap-2">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredMembers.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <CusButton
            variant="plain"
            onClick={() => setInviteOpen(true)}
            className="w-full"
            style={{
              height: "48px",
              width: "100%",
              border: "1px dashed var(--border-default)",
              borderRadius: "var(--radius-card)",
              color: "var(--brand-default)",
              fontWeight: 600,
            }}
            leftIcon={<LuPlus size={16} />}
          >
            Odam qo'shish
          </CusButton>
          {invites.map((invite) => (
            <InviteRow key={invite.id} invite={invite} />
          ))}
        </div>
      )}

      <InvitePersonDrawer
        open={isInviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInviteSubmit}
      />
    </div>
  );
}
