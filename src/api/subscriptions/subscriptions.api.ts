import { api } from "@/api-config/axiosInstance";
import type {
  NewOrganizationCheckoutRequest,
  RawOrganizationSubscription,
  RawSubscriptionOrder,
  RawSubscriptionPlan,
  RenewCheckoutRequest,
} from "@/api/subscriptions/subscriptions.types";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

export const subscriptionsApi = {
  listPlans: () =>
    api
      .get<ApiEnvelope<{ plans: RawSubscriptionPlan[] }>>("/api/v1/subscription-plans")
      .then((r) => r.data.data.plans),

  getOrganizationSubscription: (organizationID: string) =>
    api
      .get<
        ApiEnvelope<{ subscription: RawOrganizationSubscription }>
      >(`/api/v1/organizations/${organizationID}/subscription`)
      .then((r) => r.data.data.subscription),

  /** Mavjud tashkilot obunasini yangilash. */
  checkoutRenew: (organizationID: string, payload: RenewCheckoutRequest) =>
    api
      .post<
        ApiEnvelope<{ order: RawSubscriptionOrder }>
      >(`/api/v1/organizations/${organizationID}/subscription/checkout`, { data: payload })
      .then((r) => r.data.data.order),

  /** Yangi tashkilot — u to'lov Payme tomonidan tasdiqlangach yaratiladi. */
  checkoutNewOrganization: (payload: NewOrganizationCheckoutRequest) =>
    api
      .post<
        ApiEnvelope<{ order: RawSubscriptionOrder }>
      >("/api/v1/organizations/subscription/checkout", { data: payload })
      .then((r) => r.data.data.order),

  getOrder: (orderID: string) =>
    api
      .get<
        ApiEnvelope<{ order: RawSubscriptionOrder }>
      >(`/api/v1/subscription/payments/${orderID}`)
      .then((r) => r.data.data.order),
};
