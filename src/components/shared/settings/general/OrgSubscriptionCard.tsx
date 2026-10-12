import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge, type BadgeTone } from "@/components/ui/badge/CusBadge";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { RoleGate } from "@/components/shared/role-gate/RoleGate";
import { PricingPlans } from "@/components/shared/pricing/PricingPlans";
import { TariffCheckoutModal } from "@/components/shared/tariff-checkout/TariffCheckoutModal";
import { TariffsListModal } from "@/components/shared/tariff-checkout/TariffsListModal";
import { useTariffCheckoutSelection } from "@/components/shared/tariff-checkout/useTariffCheckoutSelection";
import { WORKSPACE_ROLES } from "@/const/roles";
import type { SettingsWorkspace } from "@/hooks/useApiSettings";
import { useIntlLocale } from "@/i18n/useIntlLocale";
import {
  orgSubscriptionQuery,
  tariffsQuery,
  TARIFF_WARNING_DAYS,
  type OrgTariffState,
} from "@/queries/profile.queries";
import { daysLabel } from "@/utils/countLabels";
import { daysUntil } from "@/utils/daysUntil";

type SubscriptionState = Extract<OrgTariffState, "unlimited" | "active" | "expiring" | "expired">;

const STATE_TONE: Record<SubscriptionState, BadgeTone> = {
  unlimited: "success",
  active: "success",
  expiring: "warning",
  expired: "error",
};

/** Obuna boshlanishidan tugashigacha o'tgan ulush (0–100). */
function elapsedPercent(startsAt: string, expiresAt: string): number {
  const start = new Date(startsAt).getTime();
  const end = new Date(expiresAt).getTime();
  if (!(end > start)) return 100;
  return Math.min(100, Math.max(0, Math.round(((Date.now() - start) / (end - start)) * 100)));
}

interface OrgSubscriptionCardProps {
  organization: SettingsWorkspace;
  /** Mobil — to'liq ekran drawer, desktop — markazdagi dialog. */
  variant?: "drawer" | "dialog";
}

/** "Общие настройки" dagi obuna kartasi: tarif nomi, muddat, progress va "Продлить подписку". */
export function OrgSubscriptionCard({ organization, variant = "drawer" }: OrgSubscriptionCardProps) {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const [isRenewOpen, setRenewOpen] = useState(false);
  const { data: subscription, isPending, isError } = useQuery(orgSubscriptionQuery(organization.id));

  if (isPending) {
    return <div className="h-[148px] animate-pulse rounded-card border border-subtle bg-surface" />;
  }
  if (isError) {
    return <p className="text-sm text-error-strong">{t("settings.general.subscriptionError")}</p>;
  }

  const { expires_at: expiresAt, starts_at: startsAt } = subscription;
  const daysLeft = expiresAt ? daysUntil(expiresAt) : null;
  const state: SubscriptionState =
    subscription.status !== "active" || (expiresAt && new Date(expiresAt).getTime() <= Date.now())
      ? "expired"
      : daysLeft === null
        ? "unlimited"
        : daysLeft <= TARIFF_WARNING_DAYS
          ? "expiring"
          : "active";
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(
      new Date(iso),
    );

  const renewOrganization = { id: organization.id, name: organization.name };
  const closeRenew = () => setRenewOpen(false);

  return (
    <CusCardbox className="flex flex-col gap-3 rounded-card bg-surface">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-semibold text-primary">{subscription.plan_name}</span>
        <CusBadge tone={STATE_TONE[state]}>{t(`profile.tariffs.state.${state}`)}</CusBadge>
      </div>

      <span className="text-sm text-secondary">
        {expiresAt && daysLeft !== null
          ? state === "expired"
            ? t("profile.tariffs.details.expiredAt") + ": " + formatDate(expiresAt)
            : t("settings.general.remaining", { label: daysLabel(daysLeft), date: formatDate(expiresAt) })
          : t("profile.tariffs.unlimitedHint")}
      </span>

      {expiresAt && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
          <div
            className={`h-full rounded-full ${state === "expired" ? "bg-error" : state === "expiring" ? "bg-warning" : "bg-brand"}`}
            style={{ width: `${elapsedPercent(startsAt, expiresAt)}%` }}
          />
        </div>
      )}

      <RoleGate roles={[organization.role]} allow={[WORKSPACE_ROLES.OWNER]}>
        <div>
          <CusButton
            className={variant === "drawer" ? "w-full" : undefined}
            size={variant === "drawer" ? "lg" : "md"}
            rounded={variant === "drawer" ? "9999px" : undefined}
            onClick={() => setRenewOpen(true)}
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            {t("settings.general.extend")}
          </CusButton>
        </div>
      </RoleGate>

      {variant === "drawer" ? (
        <TariffsListModal open={isRenewOpen} onClose={closeRenew} organization={renewOrganization} />
      ) : (
        <RenewDialog open={isRenewOpen} onClose={closeRenew} organization={renewOrganization} />
      )}
    </CusCardbox>
  );
}

/** Desktop: tarif tanlash dialogi → checkout dialogi. Mobil'dagi `TariffsListModal` ning dialog varianti. */
function RenewDialog({
  open,
  onClose,
  organization,
}: {
  open: boolean;
  onClose: () => void;
  organization: { id: string; name: string };
}) {
  const { t } = useTranslation();
  const { data: tariffs, isPending, isError } = useQuery({ ...tariffsQuery(), enabled: open });
  const checkout = useTariffCheckoutSelection(tariffs, organization);

  return (
    <CusDialog open={open} onClose={onClose} size="xl" closeOnBackdrop={false} title={t("profile.tariffs.list")}>
      {isPending ? (
        <p className="text-sm text-secondary">{t("common.states.loading")}</p>
      ) : isError ? (
        <p className="text-sm text-error-strong">{t("profile.tariffs.loadError")}</p>
      ) : (
        <PricingPlans tariffs={tariffs} columns="three" onChoose={checkout.choose} />
      )}

      {checkout.selection && (
        <TariffCheckoutModal
          key={checkout.selection.key}
          variant="dialog"
          open={checkout.isOpen}
          tariff={checkout.selection.tariff}
          period={checkout.selection.period}
          organization={checkout.selection.organization}
          onClose={checkout.close}
          onDone={() => {
            checkout.close();
            onClose();
          }}
        />
      )}
    </CusDialog>
  );
}
