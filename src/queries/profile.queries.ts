import { queryOptions, useMutation } from "@tanstack/react-query";
import { useSessionStore, type SessionUser } from "@/store/session.store";
import { usersApi } from "@/api/users/users.api";
import type { UpdateMeRequest } from "@/api/users/users.types";
import { organizationsApi } from "@/api/organizations/organizations.api";
import type {
  OrganizationModuleStatus,
  RawOrganization,
} from "@/api/organizations/organizations.types";
import { daysUntil } from "@/utils/daysUntil";
import { DOSKA_KEYS } from "@/queries/doska.queries";

/**
 * /profile — mobil va desktop uchun umumiy qatlam. Platforma feature'lari
 * (`widgets/features/<platform>/profile/hooks/*`) shu ustida yupqa hook yozadi.
 *
 * Tarif endpointlari backend'da hali yo'q — hozircha mock. Tayyor bo'lganda faqat
 * shu fayldagi queryFn/mutationFn almashtiriladi, ikkala platforma o'zgarishsiz qoladi.
 */

/** PATCH /users/me — javobdagi foydalanuvchi sessiyaga yoziladi (header, profil karta darhol yangilanadi). */
/**
 * Formadagi ism/familiyadan PATCH body: ikkalasi ham ixtiyoriy — faqat bo'sh bo'lmagan
 * va joriy qiymatdan farq qiladigan maydon yuboriladi. O'zgarish yo'q bo'lsa — null.
 */
export function buildNamePatch(
  current: Pick<SessionUser, "firstName" | "lastName">,
  firstName: string,
  lastName: string,
): UpdateMeRequest | null {
  const patch: UpdateMeRequest = {};
  const first = firstName.trim();
  const last = lastName.trim();
  if (first && first !== current.firstName) patch.first_name = first;
  if (last && last !== current.lastName) patch.last_name = last;
  return Object.keys(patch).length > 0 ? patch : null;
}

export function useUpdateProfileMutation() {
  const updateUser = useSessionStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (data: UpdateMeRequest) => usersApi.updateMe(data),
    onSuccess: (user) => updateUser(user),
  });
}

export type TariffId = "start" | "pro" | "business";

/** Tarif kartasidagi imkoniyat belgisi — PricingPlans shu nomdan ikonka tanlaydi. */
export type TariffFeatureIcon = "members" | "projects" | "routines" | "stats";

/** `profile.pricing.features.*` kalitlari — noto'g'ri yozilsa typecheck xato beradi. */
type TariffFeatureKey = `profile.pricing.features.${
  | "members"
  | "projects"
  | "projectsUnlimited"
  | "routines"
  | "routinesUnlimited"
  | "statsToday"
  | "stats3months"
  | "statsFull"}`;

/** Kartadagi bitta qator: belgi + tarjima kaliti (+ son bo'lsa, ko'plik shakli shundan). */
export interface TariffFeature {
  icon: TariffFeatureIcon;
  labelKey: TariffFeatureKey;
  count?: number;
}

export interface Tariff {
  id: TariffId;
  /** Brend nomi — tarjima qilinmaydi. */
  name: string;
  taglineKey: `profile.pricing.tagline.${TariffId}`;
  /** so'm; 0 — bepul. */
  priceMonthly: number;
  /** so'm; bepul tarifda 0. */
  priceYearly: number;
  currency: string;
  /** Kartada ajratib ko'rsatiladi ("Рекомендуем"). */
  recommended?: boolean;
  /** Kartada yuqoridan pastga shu tartibda chiqadi. */
  features: TariffFeature[];
}

/**
 * Tariflar jadvali — kartada nima ko'rinsa, hammasi shu yerda.
 * Backend `GET /plans` tayyor bo'lganda shu ro'yxat o'rniga keladi.
 *
 * | Tarif    | Oylik   | Yillik    | Xodim | Loyiha  | Takroriy | Statistika |
 * |----------|---------|-----------|-------|---------|----------|------------|
 * | Start    | bepul   | bepul     | 5     | 2       | 3        | bugun      |
 * | Pro      | 149 000 | 1 490 000 | 25    | 20      | 50       | 3 oy       |
 * | Business | 349 000 | 3 490 000 | 100   | cheksiz | cheksiz  | to'liq     |
 */
const TARIFFS: Tariff[] = [
  {
    id: "start",
    name: "Start", // i18n-ignore
    taglineKey: "profile.pricing.tagline.start",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "UZS",
    features: [
      {
        icon: "members",
        labelKey: "profile.pricing.features.members",
        count: 2,
      },
      {
        icon: "projects",
        labelKey: "profile.pricing.features.projects",
        count: 1,
      },
      {
        icon: "routines",
        labelKey: "profile.pricing.features.routines",
        count: 3,
      },
      { icon: "stats", labelKey: "profile.pricing.features.statsToday" },
    ],
  },
  {
    id: "pro",
    name: "Pro", // i18n-ignore
    taglineKey: "profile.pricing.tagline.pro",
    priceMonthly: 149000,
    priceYearly: 1490000,
    currency: "UZS",
    recommended: true,
    features: [
      {
        icon: "members",
        labelKey: "profile.pricing.features.members",
        count: 10,
      },
      {
        icon: "projects",
        labelKey: "profile.pricing.features.projects",
        count: 5,
      },
      {
        icon: "routines",
        labelKey: "profile.pricing.features.routines",
        count: 30,
      },
      { icon: "stats", labelKey: "profile.pricing.features.stats3months" },
    ],
  },
  {
    id: "business",
    name: "Business", // i18n-ignore
    taglineKey: "profile.pricing.tagline.business",
    priceMonthly: 349000,
    priceYearly: 3490000,
    currency: "UZS",
    features: [
      {
        icon: "members",
        labelKey: "profile.pricing.features.members",
        count: 100,
      },
      {
        icon: "projects",
        labelKey: "profile.pricing.features.projectsUnlimited",
      },
      {
        icon: "routines",
        labelKey: "profile.pricing.features.routinesUnlimited",
      },
      { icon: "stats", labelKey: "profile.pricing.features.statsFull" },
    ],
  },
];

export type BillingPeriod = "monthly" | "yearly";

export const TARIFFS_KEYS = {
  list: () => ["tariffs"] as const,
};

export const tariffsQuery = () =>
  queryOptions({
    queryKey: TARIFFS_KEYS.list(),
    queryFn: () => Promise.resolve(TARIFFS),
  });

export function useBuyTariffMutation() {
  return useMutation({
    mutationFn: ({
      tariffId,
      period,
    }: {
      tariffId: TariffId;
      period: BillingPeriod;
    }) => Promise.resolve({ tariffId, period }),
  });
}

/** Shu kundan kam qolsa — "tez tugaydi" (sariq) holati. */
export const TARIFF_WARNING_DAYS = 7;

export type OrgTariffState =
  | "free"
  | "unlimited"
  | "active"
  | "expiring"
  | "expired"
  | "inactive";

export interface OrgTariff {
  id: string;
  name: string;
  initials: string;
  state: OrgTariffState;
  status: OrganizationModuleStatus;
  /** ISO sana yoki null (muddatsiz / bepul). */
  expiresAt: string | null;
  /** `expiresAt` bo'lsa — qolgan kunlar. */
  daysLeft: number | null;
}

function toOrgTariff(org: RawOrganization): OrgTariff {
  const { status, is_free, expires_at } = org.module;
  const daysLeft = expires_at ? daysUntil(expires_at) : null;
  const state: OrgTariffState =
    status === "expired"
      ? "expired"
      : status === "inactive"
        ? "inactive"
        : is_free
          ? "free"
          : daysLeft === null
            ? "unlimited"
            : daysLeft <= TARIFF_WARNING_DAYS
              ? "expiring"
              : "active";
  return {
    id: org.id,
    name: org.name,
    initials: org.name.trim().charAt(0).toUpperCase() || "?",
    state,
    status,
    expiresAt: expires_at,
    daysLeft,
  };
}

/**
 * "Мои тарифы" — foydalanuvchi egasi (owner) bo'lgan tashkilotlar va ularning moduli.
 * /doska bilan bir xil kalit va so'rov (GET /organizations?type=organization) — alohida
 * so'rov ketmaydi, kesh va SSE yangilanishi ulashiladi; faqat `select` boshqacha.
 */
export const myTariffsQuery = () =>
  queryOptions({
    queryKey: DOSKA_KEYS.workspaces(),
    queryFn: () => organizationsApi.list({ type: "organization", limit: 100 }),
    select: (data) =>
      data.organizations.filter((org) => org.role === "owner").map(toOrgTariff),
  });
