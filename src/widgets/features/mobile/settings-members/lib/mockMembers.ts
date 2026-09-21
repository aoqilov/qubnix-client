import type {
  OrganizationMemberRole,
  RawOrganizationMember,
} from "@/api/organizations/organizations.types";

export type MemberRoleFilter = "all" | OrganizationMemberRole;

// Hali /settings/members uchun real API ulanmagan — swagger yangilangach
// shu fayl o'rniga organizationsApi.listMembers()ga o'tkaziladi (RawOrganizationMember
// bilan bir xil shaklda, shuning uchun almashtirish oson bo'ladi).
export const MOCK_WORKSPACE_NAME = "Synapse";

export const MOCK_MEMBERS: RawOrganizationMember[] = [
  {
    id: 1,
    first_name: "Sardor",
    last_name: "Rasulov",
    telegram_username: "sardor_r",
    telegram_avatar_url: null,
    phone: "+998 90 111 22 33",
    index_quality: 1,
    organization_role: "admin",
    created_at: "2026-02-10T08:00:00.000Z",
  },
  {
    id: 2,
    first_name: "Dilnoza",
    last_name: "Yusupova",
    telegram_username: "dilnoza_y",
    telegram_avatar_url: null,
    phone: "+998 91 222 33 44",
    index_quality: 1,
    organization_role: "member",
    created_at: "2026-04-22T08:00:00.000Z",
  },
  {
    id: 3,
    first_name: "Aziz",
    last_name: "Karimov",
    telegram_username: "aziz_k",
    telegram_avatar_url: null,
    phone: "+998 93 333 44 55",
    index_quality: 1,
    organization_role: "member",
    created_at: "2026-06-05T08:00:00.000Z",
  },
  {
    id: 4,
    first_name: "Nigora",
    last_name: "Saidova",
    telegram_username: "nigora_s",
    telegram_avatar_url: null,
    phone: "+998 94 444 55 66",
    index_quality: 1,
    organization_role: "viewer",
    created_at: "2026-07-18T08:00:00.000Z",
  },
  {
    id: 5,
    first_name: "Jasur",
    last_name: "Toxtayev",
    telegram_username: "jasur_t",
    telegram_avatar_url: null,
    phone: "+998 97 555 66 77",
    index_quality: 1,
    organization_role: "member",
    created_at: "2026-08-30T08:00:00.000Z",
  },
  {
    id: 6,
    first_name: "Malika",
    last_name: "Qodirova",
    telegram_username: "malika_q",
    telegram_avatar_url: null,
    phone: "+998 99 666 77 88",
    index_quality: 1,
    organization_role: "member",
    created_at: "2026-09-16T08:00:00.000Z",
  },
  {
    id: 7,
    first_name: "Otabek",
    last_name: "Jalilov",
    telegram_username: "otabek_j",
    telegram_avatar_url: null,
    phone: "+998 95 777 88 99",
    index_quality: 1,
    organization_role: "viewer",
    created_at: "2026-10-01T08:00:00.000Z",
  },
  {
    id: 8,
    first_name: "Gulnora",
    last_name: "Islomova",
    telegram_username: "gulnora_i",
    telegram_avatar_url: null,
    phone: "+998 92 888 99 00",
    index_quality: 1,
    organization_role: "member",
    created_at: "2026-11-12T08:00:00.000Z",
  },
  {
    id: 9,
    first_name: "Shahzod",
    last_name: "Abdullayev",
    telegram_username: "shahzod_a",
    telegram_avatar_url: null,
    phone: "+998 91 999 00 11",
    index_quality: 1,
    organization_role: "admin",
    created_at: "2026-12-25T08:00:00.000Z",
  },
  {
    id: 10,
    first_name: "Nilufar",
    last_name: "Rashidova",
    telegram_username: "nilufar_r",
    telegram_avatar_url: null,
    phone: "+998 90 000 11 22",
    index_quality: 1,
    organization_role: "member",
    created_at: "2027-01-15T08:00:00.000Z",
  },
  {
    id: 11,
    first_name: "Jasmina",
    last_name: "Karimova",
    telegram_username: "jasmina_k",
    telegram_avatar_url: null,
    phone: "+998 93 111 22 33",
    index_quality: 1,
    organization_role: "viewer",
    created_at: "2027-02-28T08:00:00.000Z",
  },
  {
    id: 12,
    first_name: "Rustam",
    last_name: "Yusupov",
    telegram_username: "rustam_y",
    telegram_avatar_url: null,
    phone: "+998 94 222 33 44",
    index_quality: 1,
    organization_role: "member",
    created_at: "2027-03-10T08:00:00.000Z",
  },
];

export interface MockProject {
  id: string;
  name: string;
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: "redizayn", name: "Redizayn" },
  { id: "mijoz", name: "Mijoz" },
  { id: "marketing", name: "Marketing" },
];

export type ProjectMemberRole = "project_manager" | "project_member";

export interface ProjectAssignment {
  projectId: string;
  role: ProjectMemberRole;
}

export interface MockInvite {
  id: string;
  contact: string;
  invitedRole: "admin" | "member" | "viewer";
  sentDaysAgo: number;
  projects?: ProjectAssignment[];
}

export const MOCK_INVITES: MockInvite[] = [
  {
    id: "i1",
    contact: "+998 90 123 45 67",
    invitedRole: "member",
    sentDaysAgo: 1,
  },
  { id: "i2", contact: "@shohruh_dev", invitedRole: "member", sentDaysAgo: 2 },
  {
    id: "i3",
    contact: "+998 93 555 12 34",
    invitedRole: "viewer",
    sentDaysAgo: 3,
  },
  { id: "i4", contact: "@olimjon_pm", invitedRole: "admin", sentDaysAgo: 5 },
  {
    id: "i5",
    contact: "+998 97 777 88 99",
    invitedRole: "member",
    sentDaysAgo: 6,
  },
  {
    id: "i6",
    contact: "+998 91 888 99 00",
    invitedRole: "viewer",
    sentDaysAgo: 7,
  },
  {
    id: "i7",
    contact: "@dilshod_dev",
    invitedRole: "member",
    sentDaysAgo: 8,
  },
  {
    id: "i8",
    contact: "+998 94 111 22 33",
    invitedRole: "admin",
    sentDaysAgo: 10,
  },
];
