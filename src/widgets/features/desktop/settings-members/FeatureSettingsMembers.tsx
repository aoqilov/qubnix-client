import i18n from "@/i18n";
import { useTranslation } from "react-i18next";
import { forwardRef, useMemo, useState } from "react";
import type React from "react";
import { LuFilter, LuPlus, LuSearch, LuSearchX } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import { useIsViewer } from "@/hooks/useIsViewer";
import { membersLabel } from "@/utils/countLabels";
import { organizationRoleLabel } from "@/utils/roleLabels";
import { useOrganizationMembers } from "@/components/shared/settings/members/hooks/useApiSettingsMembers";
import { useSentInvitations } from "@/components/shared/settings/members/hooks/useApiInvitations";
import type { MemberRoleFilter } from "@/components/shared/settings/members/lib/mockMembers";
import { InviteRow } from "@/components/shared/settings/members/components/InviteRow";
import { InvitePersonDrawer } from "@/components/shared/settings/members/modals/InvitePersonDrawer";
import { MemberActionsDrawer } from "@/components/shared/settings/members/modals/MemberActionsDrawer";
import { SettingsSectionHeader } from "@/widgets/features/desktop/settings/components/SettingsSectionHeader";
import { MemberTile } from "./components/MemberTile";

type MembersTab = "general" | "invites";

const GRID_CLASS = "grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

// Matnlar render paytida olinadi — til almashsa yangilanadi.
const buildRoleFilterItems = () => [
  { value: "all", label: i18n.t("members.toolbar.allRoles") },
  { value: "admin", label: organizationRoleLabel("admin") },
  { value: "member", label: organizationRoleLabel("member") },
  { value: "viewer", label: organizationRoleLabel("viewer") },
];

// CusMenuList'ning Menu.Trigger asChild'i o'z proplarini trigger DOM node'iga beradi —
// ...propsni to'liq spread qiladigan forwardRef button kerak (mobile MembersToolbar bilan bir xil sabab).
const FilterTriggerButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function FilterTriggerButton(props, ref) {
    return (
      <button
        ref={ref}
        {...props}
        type="button"
        className="flex size-10 flex-none items-center justify-center rounded-input border border-default bg-surface text-secondary hover:bg-surface-secondary"
      >
        <LuFilter size={16} />
      </button>
    );
  },
);

function CountPill({ count }: { count: number }) {
  return (
    <span
      className="inline-flex min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold"
      style={{ background: "color-mix(in srgb, currentColor 18%, transparent)" }}
    >
      {count}
    </span>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuSearchX size={20} />
      </span>
      <p className="text-sm font-medium text-primary">{t("common.states.nothingFound")}</p>
      <p className="text-xs text-secondary">{t("common.states.nothingFoundHint")}</p>
    </div>
  );
}

function TileSkeletons() {
  return (
    <div className={GRID_CLASS}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-[62px] animate-pulse rounded-card border border-subtle bg-surface" />
      ))}
    </div>
  );
}

export default function FeatureSettingsMembers() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<MembersTab>("general");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<MemberRoleFilter>("all");
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [actionsMemberId, setActionsMemberId] = useState<number | null>(null);
  // Viewer ro'yxatni ko'radi, lekin taklif/rol/o'chirish amallari yo'q.
  const isViewer = useIsViewer();

  const membersQuery = useOrganizationMembers(roleFilter === "all" ? undefined : roleFilter);
  const members = membersQuery.data?.members ?? [];
  // ID orqali har renderda qayta topiladi — rol o'zgargach dialog yangi ma'lumotni ko'rsatadi.
  const actionsMember = members.find((m) => m.id === actionsMemberId) ?? null;
  // organization_roles — rolga qarab filtrlanmagan, tashkilotdagi umumiy son.
  const totalMembersCount =
    membersQuery.data?.organization_roles.reduce((sum, r) => sum + r.role_member_count, 0) ?? members.length;

  const invitationsQuery = useSentInvitations();
  const invites = invitationsQuery.data?.invitations ?? [];
  const invitesCount = invitationsQuery.data?.pagination.total ?? invites.length;

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) =>
      `${member.first_name} ${member.last_name} ${member.telegram_username ?? ""}`.toLowerCase().includes(query),
    );
  }, [members, search]);

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionHeader
        title={t("members.title")}
        subtitle={`${membersLabel(totalMembersCount)} · ${t("members.invitesCount", { count: invitesCount })}`}
      />

      <div>
        <CusSegment
          layout="inline"
          value={tab}
          onValueChange={(v) => setTab(v as MembersTab)}
          iconPosition="right"
          items={[
            { id: "general", label: t("members.tabs.general"), icon: <CountPill count={totalMembersCount} /> },
            { id: "invites", label: t("members.tabs.invites"), icon: <CountPill count={invitesCount} /> },
          ]}
        />
      </div>

      <div className="flex items-center gap-2">
        {tab === "general" ? (
          <>
            <div className="min-w-0 flex-1">
              <CusInput
                placeholder={t("members.toolbar.search")}
                clearable
                leftElementWidth="2.25rem"
                leftElement={<LuSearch size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <CusMenuList
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as MemberRoleFilter)}
              items={buildRoleFilterItems()}
              width={160}
              trigger={<FilterTriggerButton />}
            />
          </>
        ) : (
          <div className="flex-1" />
        )}
        {!isViewer && (
          <CusButton
            variant="subtle"
            leftIcon={<LuPlus size={16} />}
            onClick={() => setInviteOpen(true)}
            style={{ background: "var(--brand-subtle-bg)", color: "var(--brand-default)", fontWeight: 600 }}
          >
            {t("members.invite.send")}
          </CusButton>
        )}
      </div>

      {tab === "general" ? (
        membersQuery.isPending ? (
          <TileSkeletons />
        ) : membersQuery.isError ? (
          <p className="text-sm text-error-strong">{t("members.loadError")}</p>
        ) : filteredMembers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={GRID_CLASS}>
            {filteredMembers.map((member) => (
              <MemberTile
                key={member.id}
                member={member}
                onOpenActions={isViewer ? undefined : () => setActionsMemberId(member.id)}
              />
            ))}
          </div>
        )
      ) : invitationsQuery.isPending ? (
        <TileSkeletons />
      ) : invitationsQuery.isError ? (
        <p className="text-sm text-error-strong">{t("members.invitesLoadError")}</p>
      ) : invites.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {invites.map((invite) => (
            <InviteRow key={invite.id} invite={invite} readOnly={isViewer} />
          ))}
        </div>
      )}

      <InvitePersonDrawer variant="dialog" open={isInviteOpen} onClose={() => setInviteOpen(false)} />

      <MemberActionsDrawer
        variant="dialog"
        open={actionsMemberId !== null}
        onClose={() => setActionsMemberId(null)}
        member={actionsMember}
      />
    </div>
  );
}
