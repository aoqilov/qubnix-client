import { queryOptions, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useSessionStore, type SessionUser } from "@/store/session.store";
import { usersApi } from "@/api/users/users.api";
import type { UpdateMeRequest } from "@/api/users/users.types";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { subscriptionsApi } from "@/api/subscriptions/subscriptions.api";
import type {
  PlanDurationMonths,
  PlanStatsDepth,
  RawPlanLimits,
  RawSubscriptionOrder,
  RawSubscriptionPlan,
  SubscriptionOrderStatus,
} from "@/api/subscriptions/subscriptions.types";
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
 * Tarif va to'lov (Payme) — `api/subscriptions`. Ikkala platforma shu fayldan o'qiydi.
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

/** Tarif ID'si — backend `subscription-plans.id`. */
export type TariffId = number;

/** Tarif kartasidagi imkoniyat belgisi — PricingPlans shu nomdan ikonka tanlaydi. */
export type TariffFeatureIcon = "members" | "projects" | "routines" | "stats";

/** Statistika qancha orqaga ko'rinadi. */
export type TariffStatsDepth = PlanStatsDepth;

/** Tarif chegaralari; null — cheksiz. Narx kartasi ham, "Мои тарифы" ham shundan o'qiydi. */
export type TariffLimits = RawPlanLimits;

/** `profile.pricing.features.*` kalitlari — noto'g'ri yozilsa typecheck xato beradi. */
type TariffFeatureKey = `profile.pricing.features.${
  | "members"
  | "membersUnlimited"
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

/** Backend tarif nomi (kichik harfda) → tagline kaliti. Tanilmagan nomda tagline chiqmaydi. */
const TAGLINE_KEYS = {
  start: "profile.pricing.tagline.start",
  pro: "profile.pricing.tagline.pro",
  business: "profile.pricing.tagline.business",
} as const;

export interface Tariff {
  id: TariffId;
  /** Brend nomi — backend'dan, tarjima qilinmaydi. */
  name: string;
  taglineKey?: (typeof TAGLINE_KEYS)[keyof typeof TAGLINE_KEYS];
  /** so'm; null — shu muddatga narx yo'q (bepul tarif). */
  priceMonthly: number | null;
  priceYearly: number | null;
  /** Yillik narxdagi chegirma, foiz (0 — yo'q). */
  yearlyDiscountPercent: number;
  currency: string;
  isFree: boolean;
  /** Kartada ajratib ko'rsatiladi ("Рекомендуем"). */
  recommended?: boolean;
  limits: TariffLimits;
  /** Kartada yuqoridan pastga shu tartibda chiqadi — `limits`dan yasaladi. */
  features: TariffFeature[];
}

const STATS_FEATURE_KEY: Record<TariffStatsDepth, TariffFeatureKey> = {
  today: "profile.pricing.features.statsToday",
  "3months": "profile.pricing.features.stats3months",
  full: "profile.pricing.features.statsFull",
};

/** Narx kartasidagi qatorlar — limitlardan, alohida qo'lda yozilmaydi (ikki joyda farq qilib qolmasin). */
function featuresFromLimits(limits: TariffLimits): TariffFeature[] {
  return [
    limits.members === null
      ? { icon: "members", labelKey: "profile.pricing.features.membersUnlimited" }
      : { icon: "members", labelKey: "profile.pricing.features.members", count: limits.members },
    limits.projects === null
      ? { icon: "projects", labelKey: "profile.pricing.features.projectsUnlimited" }
      : { icon: "projects", labelKey: "profile.pricing.features.projects", count: limits.projects },
    limits.routines === null
      ? { icon: "routines", labelKey: "profile.pricing.features.routinesUnlimited" }
      : { icon: "routines", labelKey: "profile.pricing.features.routines", count: limits.routines },
    { icon: "stats", labelKey: STATS_FEATURE_KEY[limits.stats] },
  ];
}

export type BillingPeriod = "monthly" | "yearly";

/** Davr → backend `duration_months` (dizaynda faqat 1 oy va 1 yil). */
export const PERIOD_MONTHS: Record<BillingPeriod, PlanDurationMonths> = {
  monthly: 1,
  yearly: 12,
};

function toTariff(plan: RawSubscriptionPlan): Tariff {
  const activePrices = plan.prices.filter((price) => price.is_active);
  const priceFor = (months: PlanDurationMonths) =>
    activePrices.find((price) => price.duration_months === months);
  const monthly = priceFor(1);
  const yearly = priceFor(12);
  const taglineKey = TAGLINE_KEYS[plan.name.trim().toLowerCase() as keyof typeof TAGLINE_KEYS];
  return {
    id: plan.id,
    name: plan.name,
    taglineKey,
    priceMonthly: monthly?.amount ?? plan.price_monthly,
    priceYearly: yearly?.amount ?? plan.price_yearly,
    yearlyDiscountPercent: yearly?.discount_percent ?? 0,
    currency: plan.currency,
    isFree: plan.is_free,
    recommended: plan.recommended,
    limits: plan.limits,
    features: featuresFromLimits(plan.limits),
  };
}

/** Tanlangan davr uchun narx (so'm); davrga narx yo'q bo'lsa — null. */
export function tariffPrice(tariff: Tariff, period: BillingPeriod): number | null {
  return period === "yearly" ? tariff.priceYearly : tariff.priceMonthly;
}

export const TARIFFS_KEYS = {
  list: () => ["tariffs"] as const,
  subscription: (organizationId: string) => ["tariffs", "subscription", organizationId] as const,
  order: (orderId: string) => ["tariffs", "order", orderId] as const,
};

export const tariffsQuery = () =>
  queryOptions({
    queryKey: TARIFFS_KEYS.list(),
    queryFn: () => subscriptionsApi.listPlans(),
    select: (plans) =>
      plans
        .filter((plan) => plan.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(toTariff),
  });

export interface CreateTariffOrderRequest {
  tariff: Tariff;
  period: BillingPeriod;
  /** Yangi tashkilot nomi. `organizationId` berilsa (obunani yangilash) kerak emas. */
  organizationName?: string;
  /** Berilsa — shu tashkilot obunasi yangilanadi, yangi tashkilot ochilmaydi. */
  organizationId?: string;
}

export type TariffOrderStatus = SubscriptionOrderStatus;

export interface TariffOrder {
  id: string;
  status: TariffOrderStatus;
  organizationName: string | null;
  /** so'm */
  amount: number;
  /** Payme sahifasi. Bepul tarifda yo'q: to'lov bosqichi ham bo'lmaydi. */
  paymentUrl: string | null;
}

function toTariffOrder(raw: RawSubscriptionOrder): TariffOrder {
  return {
    id: raw.id,
    status: raw.status,
    organizationName: raw.organization_name,
    amount: raw.amount,
    paymentUrl: raw.payment_url ?? null,
  };
}

/** To'lov tasdiqlangach: tashkilotlar ro'yxati va obunalar yangidan o'qiladi. */
export function invalidateAfterPayment(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: DOSKA_KEYS.workspaces() });
  queryClient.invalidateQueries({ queryKey: ["tariffs", "subscription"] });
}

/**
 * Tarif xaridi: buyurtma ochiladi, javobda Payme havolasi keladi. Havola oldindan tayyor
 * bo'lishi shart — "Payme" tugmasi bosilganda `window.open` sinxron chaqirilmasa, brauzer
 * uni popup deb bloklaydi. Yangi tashkilot to'lov tasdiqlangach backend'da yaratiladi.
 */
export function useCreateTariffOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tariff,
      period,
      organizationName,
      organizationId,
    }: CreateTariffOrderRequest) => {
      const body = {
        plan_id: tariff.id,
        duration_months: PERIOD_MONTHS[period],
        provider: "payme" as const,
      };
      const raw = organizationId
        ? await subscriptionsApi.checkoutRenew(organizationId, body)
        : await subscriptionsApi.checkoutNewOrganization({
            ...body,
            organization_name: organizationName ?? "",
          });
      return toTariffOrder(raw);
    },
    onSuccess: (order) => {
      // To'lovsiz buyurtma (bepul tarif) darrov tayyor — ro'yxat yangilansin.
      if (!order.paymentUrl) invalidateAfterPayment(queryClient);
    },
  });
}

/** Buyurtma tugallangan (to'langan yoki rad etilgan) holatlari. */
const FINAL_ORDER_STATUSES: ReadonlySet<TariffOrderStatus> = new Set(["paid", "cancelled", "failed"]);

/**
 * To'lov holati. `enabled` — Payme sahifasi ochilgandan keyin; tugallangunga qadar 3 soniyada
 * bir so'raladi (foydalanuvchi qaytganda ham — oyna fokusida — yangilanadi).
 */
export const tariffOrderQuery = (orderId: string, enabled: boolean) =>
  queryOptions({
    queryKey: TARIFFS_KEYS.order(orderId),
    queryFn: () => subscriptionsApi.getOrder(orderId).then(toTariffOrder),
    enabled,
    refetchInterval: (query) =>
      query.state.data && FINAL_ORDER_STATUSES.has(query.state.data.status) ? false : 3000,
  });

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

/** Tashkilotning haqiqiy obunasi: tarif nomi, limitlari va hozirgi foydalanish (`usage`). */
export const orgSubscriptionQuery = (organizationId: string) =>
  queryOptions({
    queryKey: TARIFFS_KEYS.subscription(organizationId),
    queryFn: () => subscriptionsApi.getOrganizationSubscription(organizationId),
  });
