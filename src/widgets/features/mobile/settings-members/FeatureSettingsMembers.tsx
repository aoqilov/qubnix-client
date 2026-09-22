import { useMemo, useState } from "react";
import { LuSearchX, LuPlus } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { useSelectedOrganization } from "@/widgets/features/mobile/settings/hooks/useApiSettings";
import { MembersToolbar } from "./components/MembersToolbar";
import { MemberRow } from "./components/MemberRow";
import { MemberCard } from "./components/MemberCard";
import { InviteRow } from "./components/InviteRow";
import { InvitePersonDrawer } from "./modals/InvitePersonDrawer";
import { MemberActionsDrawer } from "./modals/MemberActionsDrawer";
import { useMemberViewStyle } from "./hooks/useMemberViewStyle";
import { useOrganizationMembers } from "./hooks/useApiSettingsMembers";
import { useSentInvitations } from "./hooks/useApiInvitations";
import type { MemberRoleFilter } from "./lib/mockMembers";

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

function MemberRowSkeleton() {
  return (
    <div className="h-[68px] animate-pulse rounded-card border border-subtle bg-surface" />
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
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [actionsMemberId, setActionsMemberId] = useState<number | null>(null);

  const organizationQuery = useSelectedOrganization();
  const membersQuery = useOrganizationMembers(roleFilter === "all" ? undefined : roleFilter);
  const members = membersQuery.data?.members ?? [];
  // ID orqali har renderda qayta topiladi — shunda rol o'zgartirilgach so'rov
  // qayta yuklanganda (invalidate) drawer eski (snapshot) emas, yangi
  // ma'lumotni ko'rsatadi.
  const actionsMember = members.find((m) => m.id === actionsMemberId) ?? null;
  // organization_roles — rolga qarab filtrlanmagan, tashkilotdagi umumiy son.
  const totalMembersCount =
    membersQuery.data?.organization_roles.reduce((sum, r) => sum + r.role_member_count, 0) ??
    members.length;

  const invitationsQuery = useSentInvitations();
  const invites = invitationsQuery.data?.invitations ?? [];
  const invitesCount = invitationsQuery.data?.pagination.total ?? invites.length;

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) =>
      `${member.first_name} ${member.last_name} ${member.telegram_username ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [members, search]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title="Сотрудники" />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {(organizationQuery.data?.name ?? "").toUpperCase()} - {totalMembersCount}{" "}
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
            icon: <CountPill count={totalMembersCount} />,
          },
          {
            id: "invites",
            label: "Приглашения",
            icon: <CountPill count={invitesCount} />,
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
          {membersQuery.isPending ? (
            <div className="flex flex-col gap-2">
              <MemberRowSkeleton />
              <MemberRowSkeleton />
              <MemberRowSkeleton />
            </div>
          ) : membersQuery.isError ? (
            <p className="px-1 text-sm text-error-strong">
              Не удалось загрузить сотрудников.
            </p>
          ) : filteredMembers.length === 0 ? (
            <EmptyState />
          ) : viewStyle === "card" ? (
            <div className="grid grid-cols-3 gap-2">
              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onOpenActions={() => setActionsMemberId(member.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredMembers.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onOpenActions={() => setActionsMemberId(member.id)}
                />
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
          {invitationsQuery.isPending ? (
            <div className="flex flex-col gap-2">
              <MemberRowSkeleton />
              <MemberRowSkeleton />
            </div>
          ) : invitationsQuery.isError ? (
            <p className="px-1 text-sm text-error-strong">
              Не удалось загрузить приглашения.
            </p>
          ) : invites.length === 0 ? (
            <EmptyState />
          ) : (
            invites.map((invite) => <InviteRow key={invite.id} invite={invite} />)
          )}
        </div>
      )}

      <InvitePersonDrawer open={isInviteOpen} onClose={() => setInviteOpen(false)} />

      <MemberActionsDrawer
        open={actionsMemberId !== null}
        onClose={() => setActionsMemberId(null)}
        member={actionsMember}
      />
    </div>
  );
}
