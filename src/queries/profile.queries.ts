import { queryOptions, useMutation } from "@tanstack/react-query";
import type { SessionUser } from "@/store/session.store";
import { organizationsApi } from "@/api/organizations/organizations.api";
import type { OrganizationModuleStatus, RawOrganization } from "@/api/organizations/organizations.types";
import { daysUntil } from "@/utils/daysUntil";
import { DOSKA_KEYS } from "@/queries/doska.queries";

/**
 * /profile — mobil va desktop uchun umumiy qatlam. Platforma feature'lari
 * (`widgets/features/<platform>/profile/hooks/*`) shu ustida yupqa hook yozadi.
 *
 * Profil-yangilash va tarif endpointlari backend'da hali yo'q — hozircha mock.
 * Tayyor bo'lganda faqat shu fayldagi queryFn/mutationFn almashtiriladi,
 * ikkala platforma o'zgarishsiz qoladi.
 */

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (patch: Partial<SessionUser>) => Promise.resolve({ status: 200, data: patch }),
  });
}

export type TariffId = "start" | "pro" | "business";
/** Statistika qancha davrni qamraydi. */
export type TariffStatsScope = "today" | "3months" | "full";

export interface Tariff {
  id: TariffId;
  name: string;
  /** so'm; 0 — bepul. */
  priceMonthly: number;
  /** so'm; bepul tarifda 0. */
  priceYearly: number;
  currency: string;
  /** Kartada ajratib ko'rsatiladi ("Tavsiya etamiz"). */
  recommended?: boolean;
  /** null — cheklovsiz. */
  limits: {
    members: number | null;
    projects: number | null;
    routines: number | null;
    stats: TariffStatsScope;
  };
}

// Narx va chegaralar — kelishilgan jadval; backend `GET /plans` tayyor bo'lganda shu ro'yxat
// o'rniga keladi. Tarif nomlari — brend, tarjima qilinmaydi.
const MOCK_TARIFFS: Tariff[] = [
  {
    id: "start",
    name: "Start", // i18n-ignore
    priceMonthly: 0,
    priceYearly: 0,
    currency: "UZS",
    limits: { members: 5, projects: 2, routines: 3, stats: "today" },
  },
  {
    id: "pro",
    name: "Pro", // i18n-ignore
    priceMonthly: 149000,
    priceYearly: 1490000,
    currency: "UZS",
    recommended: true,
    limits: { members: 25, projects: 20, routines: 50, stats: "3months" },
  },
  {
    id: "business",
    name: "Business", // i18n-ignore
    priceMonthly: 349000,
    priceYearly: 3490000,
    currency: "UZS",
    limits: { members: 100, projects: null, routines: null, stats: "full" },
  },
];

export type BillingPeriod = "monthly" | "yearly";

export const TARIFFS_KEYS = {
  list: () => ["tariffs"] as const,
};

export const tariffsQuery = () =>
  queryOptions({
    queryKey: TARIFFS_KEYS.list(),
    queryFn: () => Promise.resolve(MOCK_TARIFFS),
  });

export function useBuyTariffMutation() {
  return useMutation({
    mutationFn: ({ tariffId, period }: { tariffId: TariffId; period: BillingPeriod }) =>
      Promise.resolve({ tariffId, period }),
  });
}

/** Shu kundan kam qolsa — "tez tugaydi" (sariq) holati. */
export const TARIFF_WARNING_DAYS = 7;

export type OrgTariffState = "free" | "unlimited" | "active" | "expiring" | "expired" | "inactive";

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
