import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSessionStore, type SessionUser } from "@/store/session.store";
import { usersApi } from "@/api/users/users.api";
import type { UpdateMeRequest } from "@/api/users/users.types";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { projectsApi } from "@/api/projects/projects.api";
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

/** Statistika qancha orqaga ko'rinadi. */
export type TariffStatsDepth = "today" | "3months" | "full";

/** Tarif chegaralari; null — cheksiz. Narx kartasi ham, "Мои тарифы" ham shundan o'qiydi. */
export interface TariffLimits {
  members: number;
  projects: number | null;
  routines: number | null;
  stats: TariffStatsDepth;
}

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
    { icon: "members", labelKey: "profile.pricing.features.members", count: limits.members },
    limits.projects === null
      ? { icon: "projects", labelKey: "profile.pricing.features.projectsUnlimited" }
      : { icon: "projects", labelKey: "profile.pricing.features.projects", count: limits.projects },
    limits.routines === null
      ? { icon: "routines", labelKey: "profile.pricing.features.routinesUnlimited" }
      : { icon: "routines", labelKey: "profile.pricing.features.routines", count: limits.routines },
    { icon: "stats", labelKey: STATS_FEATURE_KEY[limits.stats] },
  ];
}

/**
 * Tariflar jadvali — kartada nima ko'rinsa, hammasi shu yerda.
 * Backend `GET /plans` tayyor bo'lganda shu ro'yxat o'rniga keladi.
 *
 * | Tarif    | Oylik   | Yillik    | Xodim | Loyiha  | Takroriy | Statistika |
 * |----------|---------|-----------|-------|---------|----------|------------|
 * | Start    | bepul   | bepul     | 2     | 1       | 3        | bugun      |
 * | Pro      | 149 000 | 1 490 000 | 10    | 5       | 30       | 3 oy       |
 * | Business | 349 000 | 3 490 000 | 100   | cheksiz | cheksiz  | to'liq     |
 */
const TARIFF_SEEDS: Omit<Tariff, "features">[] = [
  {
    id: "start",
    name: "Start", // i18n-ignore
    taglineKey: "profile.pricing.tagline.start",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "UZS",
    limits: { members: 2, projects: 1, routines: 3, stats: "today" },
  },
  {
    id: "pro",
    name: "Pro", // i18n-ignore
    taglineKey: "profile.pricing.tagline.pro",
    priceMonthly: 149000,
    priceYearly: 1490000,
    currency: "UZS",
    recommended: true,
    limits: { members: 10, projects: 5, routines: 30, stats: "3months" },
  },
  {
    id: "business",
    name: "Business", // i18n-ignore
    taglineKey: "profile.pricing.tagline.business",
    priceMonthly: 349000,
    priceYearly: 3490000,
    currency: "UZS",
    limits: { members: 100, projects: null, routines: null, stats: "full" },
  },
];

const TARIFFS: Tariff[] = TARIFF_SEEDS.map((seed) => ({
  ...seed,
  features: featuresFromLimits(seed.limits),
}));

export type BillingPeriod = "monthly" | "yearly";

export const TARIFFS_KEYS = {
  list: () => ["tariffs"] as const,
  usage: (organizationId: string) => ["tariffs", "usage", organizationId] as const,
};

export const tariffsQuery = () =>
  queryOptions({
    queryKey: TARIFFS_KEYS.list(),
    queryFn: () => Promise.resolve(TARIFFS),
  });

export type PaymentProvider = "payme" | "click";

export interface CreateTariffOrderRequest {
  tariffId: TariffId;
  period: BillingPeriod;
  /** Tarif ulanadigan yangi tashkilot nomi. */
  organizationName: string;
}

export interface TariffOrder {
  id: string;
  tariffId: TariffId;
  period: BillingPeriod;
  organizationName: string;
  /** so'm; bepul tarifda 0. */
  amount: number;
  /**
   * To'lov havolalari — backend tayyorlab beradi (merchant ID, buyurtma ID, summa ichida).
   * Bepul tarifda null: to'lov bosqichi bo'lmaydi.
   */
  paymentUrls: Record<PaymentProvider, string> | null;
}

// ── Mock: to'lov endpointi yo'q. Backend tayyor bo'lganda `POST /tariff-orders` javobi keladi,
// quyidagi merchant ID'lar va havola yasash frontend'dan butunlay olib tashlanadi.
const MOCK_PAYME_MERCHANT_ID = "mock-payme-merchant";
const MOCK_CLICK_SERVICE_ID = "00000";
const MOCK_CLICK_MERCHANT_ID = "00000";

/** Payme checkout: `m=<merchant>;ac.order_id=<id>;a=<tiyin>;c=<qaytish>` → base64. */
function mockPaymeUrl(orderId: string, amount: number, returnUrl: string): string {
  const params = `m=${MOCK_PAYME_MERCHANT_ID};ac.order_id=${orderId};a=${amount * 100};c=${returnUrl}`;
  return `https://checkout.paycom.uz/${btoa(params)}`;
}

/** Click: summa so'mda, buyurtma ID — `transaction_param`. */
function mockClickUrl(orderId: string, amount: number, returnUrl: string): string {
  const params = new URLSearchParams({
    service_id: MOCK_CLICK_SERVICE_ID,
    merchant_id: MOCK_CLICK_MERCHANT_ID,
    amount: String(amount),
    transaction_param: orderId,
    return_url: returnUrl,
  });
  return `https://my.click.uz/services/pay?${params}`;
}

function mockTariffOrder({ tariffId, period, organizationName }: CreateTariffOrderRequest): TariffOrder {
  const tariff = TARIFFS.find((item) => item.id === tariffId);
  const amount = !tariff ? 0 : period === "yearly" ? tariff.priceYearly : tariff.priceMonthly;
  const id = `mock-${Date.now()}`;
  const returnUrl = `${window.location.origin}/profile`;
  return {
    id,
    tariffId,
    period,
    organizationName,
    amount,
    paymentUrls:
      amount === 0
        ? null
        : { payme: mockPaymeUrl(id, amount, returnUrl), click: mockClickUrl(id, amount, returnUrl) },
  };
}

/**
 * Tarif xaridi: tashkilot nomi saqlanganda buyurtma ochiladi va to'lov havolalari qaytadi.
 * Havolalar oldindan tayyor bo'lishi shart — Payme/Click tugmasi bosilganda `window.open`
 * sinxron chaqirilmasa, brauzer uni popup deb bloklaydi.
 *
 * Bepul tarif — to'lovsiz: tashkilot hozirgi ochiq `POST /organizations` orqali haqiqatan
 * yaratiladi (/doska'dagi "Создать организацию" shu oqimdan o'tadi, yaratish yo'qolmasin).
 * Pullik tarif — buyurtma hali mock, tashkilot to'lov tasdiqlangach backend'da yaratiladi.
 */
export function useCreateTariffOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTariffOrderRequest) => {
      const order = mockTariffOrder(data);
      if (!order.paymentUrls) await organizationsApi.create({ name: data.organizationName });
      return order;
    },
    onSuccess: (order) => {
      if (!order.paymentUrls) queryClient.invalidateQueries({ queryKey: DOSKA_KEYS.workspaces() });
    },
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
  /**
   * Qaysi tarif — limitlar shundan. Mock: backend `module`da tarif ID'sini hali qaytarmaydi,
   * shuning uchun bepul → Start, pullik → Pro. `module.plan` kelganda shu yerdan o'qiladi.
   */
  planId: TariffId;
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
    planId: is_free ? "start" : "pro",
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

/** Tashkilotda hozir nechta xodim va loyiha bor — limit bilan solishtirish uchun. */
export interface OrgUsage {
  members: number;
  projects: number;
}

/**
 * Ikki yengil so'rov (`limit=1` — faqat jami son kerak). Takroriy vazifalar sanalmaydi: ular
 * loyiha ichida, har loyihaga alohida so'rov ketardi — backend `usage` bersa, shu yerga qo'shiladi.
 */
export const orgUsageQuery = (organizationId: string) =>
  queryOptions({
    queryKey: TARIFFS_KEYS.usage(organizationId),
    queryFn: async (): Promise<OrgUsage> => {
      const [members, projects] = await Promise.all([
        organizationsApi.listMembers(organizationId, { limit: 1 }),
        projectsApi.list(organizationId, { limit: 1 }),
      ]);
      return { members: members.members_count, projects: projects.pagination.total };
    },
  });
