/** Backend `/api/v1/subscription*` javoblaridagi xom (snake_case) shakllar. */

export type PlanDurationMonths = 1 | 3 | 6 | 12;

/** Statistika qancha orqaga ko'rinadi. */
export type PlanStatsDepth = "today" | "3months" | "full";

/** null — cheksiz. */
export interface RawPlanLimits {
  members: number | null;
  projects: number | null;
  routines: number | null;
  stats: PlanStatsDepth;
}

export interface RawPlanPrice {
  id: number;
  duration_months: PlanDurationMonths;
  /** so'm */
  amount: number;
  discount_percent: number;
  is_active: boolean;
  sort_order: number;
}

export interface RawSubscriptionPlan {
  id: number;
  name: string;
  /** Bepul tarifda null. */
  price_monthly: number | null;
  price_yearly: number | null;
  currency: "UZS";
  recommended: boolean;
  is_free: boolean;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  limits: RawPlanLimits;
  prices: RawPlanPrice[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface RawOrganizationSubscription {
  id: number;
  organization_id: number;
  plan_id: number;
  plan_name: string;
  status: SubscriptionStatus;
  starts_at: string;
  /** null — muddatsiz. */
  expires_at: string | null;
  limits: RawPlanLimits;
}

export type SubscriptionOrderStatus = "created" | "pending" | "paid" | "cancelled" | "failed";

export type SubscriptionOrderPurpose = "create_organization" | "renew_subscription";

export interface RawSubscriptionOrder {
  id: string;
  organization_id: number | null;
  organization_name: string | null;
  purpose: SubscriptionOrderPurpose;
  plan_id: number;
  duration_months: PlanDurationMonths;
  /** so'm */
  amount: number;
  currency: "UZS";
  discount_percent: number;
  provider: "payme";
  status: SubscriptionOrderStatus;
  /** Bepul tarifda kelmasligi mumkin. */
  payment_url?: string;
  expires_at: string;
  paid_at: string | null;
  created_at: string;
}

/** POST /organizations/{id}/subscription/checkout — summani server o'zi hisoblaydi. */
export interface RenewCheckoutRequest {
  plan_id: number;
  duration_months: PlanDurationMonths;
  provider: "payme";
}

/** POST /organizations/subscription/checkout — tashkilot to'lov tasdiqlangach yaratiladi. */
export interface NewOrganizationCheckoutRequest extends RenewCheckoutRequest {
  organization_name: string;
}
