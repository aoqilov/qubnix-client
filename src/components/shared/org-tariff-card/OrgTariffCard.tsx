import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { LuCalendarClock, LuRefreshCw } from "react-icons/lu";
import { CusAccordion } from "@/components/ui/accordion/CusAccordion";
import { CusBadge, type BadgeTone } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { avatarColorVar } from "@/utils/avatarColor";
import { daysLabel } from "@/utils/countLabels";
import { useIntlLocale } from "@/i18n/useIntlLocale";
import {
  orgSubscriptionQuery,
  orgUsageQuery,
  type OrgTariff,
  type OrgTariffState,
  type TariffStatsDepth,
} from "@/queries/profile.queries";

const STATE_TONE: Record<OrgTariffState, BadgeTone> = {
  free: "neutral",
  unlimited: "success",
  active: "success",
  expiring: "warning",
  expired: "error",
  inactive: "neutral",
};

/** "Продлить" — faqat muddati tugagan yoki tez tugaydigan tarifda. */
const RENEWABLE: ReadonlySet<OrgTariffState> = new Set(["expiring", "expired"]);

const STATS_DEPTH_KEY: Record<TariffStatsDepth, `profile.tariffs.details.stats${"Today" | "3months" | "Full"}`> = {
  today: "profile.tariffs.details.statsToday",
  "3months": "profile.tariffs.details.stats3months",
  full: "profile.tariffs.details.statsFull",
};

/** Limitning shuncha foizi ishlatilsa — sariq; 100% — qizil. */
const LIMIT_WARNING_PCT = 80;

interface OrgTariffAccordionProps {
  tariffs: OrgTariff[];
  /** Berilsa — muddati tugagan/tugayotgan tarifda "Продлить" tugmasi chiqadi. */
  onRenew?: (tariff: OrgTariff) => void;
}

/**
 * "Мои тарифы" — har tashkilot bitta accordion bo'limi (mobil drawer va desktop panel).
 * Yopiq holatda: avatar, nom, holat. Ochilganda: muddat, limitlar, holat izohi.
 * Bir nechtasi birga ochiq tura oladi; birinchisi ochiq boshlanadi.
 */
export function OrgTariffAccordion({ tariffs, onRenew }: OrgTariffAccordionProps) {
  const { t } = useTranslation();

  return (
    <CusAccordion
      multiple
      // Xodim/loyiha soni so'rovi faqat bo'lim ochilganda ketadi.
      lazyMount
      defaultValue={tariffs[0] ? [tariffs[0].id] : undefined}
      items={tariffs.map((tariff) => ({
        value: tariff.id,
        title: tariff.name,
        icon: (
          <span
            className="flex size-9 items-center justify-center rounded-input font-semibold text-on-brand"
            style={{ background: avatarColorVar(tariff.id) }}
          >
            {tariff.initials}
          </span>
        ),
        badge: (
          <CusBadge variant="subtle" tone={STATE_TONE[tariff.state]} size="xs">
            {t(`profile.tariffs.state.${tariff.state}`)}
          </CusBadge>
        ),
        content: <OrgTariffDetails tariff={tariff} onRenew={onRenew} />,
      }))}
    />
  );
}

function OrgTariffDetails({ tariff, onRenew }: { tariff: OrgTariff; onRenew?: (tariff: OrgTariff) => void }) {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  // Haqiqiy obuna: tarif nomi va limitlar (holat/muddat sarlavhadagi bilan bir manbadan — tashkilot moduli).
  const { data: subscription } = useQuery(orgSubscriptionQuery(tariff.id));
  const usage = useQuery(orgUsageQuery(tariff.id));
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(
      new Date(iso),
    );

  const termRows =
    tariff.state === "free" || tariff.state === "unlimited" ? (
      <DetailRow label={t("profile.tariffs.details.validity")} value={t("profile.tariffs.unlimitedHint")} />
    ) : tariff.state === "expired" ? (
      tariff.expiresAt && (
        <DetailRow
          label={t("profile.tariffs.details.expiredAt")}
          value={formatDate(tariff.expiresAt)}
          valueClassName="text-error-strong"
        />
      )
    ) : (
      tariff.expiresAt && (
        <>
          <DetailRow label={t("profile.tariffs.details.validUntil")} value={formatDate(tariff.expiresAt)} />
          {tariff.daysLeft !== null && (
            <DetailRow
              label={t("profile.tariffs.details.left")}
              value={daysLabel(tariff.daysLeft)}
              valueClassName={tariff.state === "expiring" ? "text-warning-strong" : undefined}
            />
          )}
        </>
      )
    );

  return (
    <div className="flex flex-col gap-4 border-t border-subtle pt-3">
      <DetailSection title={t("profile.tariffs.details.term")}>
        <DetailRow label={t("profile.tariffs.details.plan")} value={subscription?.plan_name ?? "—"} />
        {termRows}
      </DetailSection>

      {subscription && (
        <DetailSection title={t("profile.tariffs.details.limits")}>
          <LimitRow
            label={t("profile.tariffs.details.members")}
            used={usage.data?.members}
            max={subscription.limits.members}
            isLoading={usage.isPending}
          />
          <LimitRow
            label={t("profile.tariffs.details.projects")}
            used={usage.data?.projects}
            max={subscription.limits.projects}
            isLoading={usage.isPending}
          />
          <DetailRow
            label={t("profile.tariffs.details.routines")}
            value={
              subscription.limits.routines === null
                ? t("profile.tariffs.details.noLimit")
                : t("profile.tariffs.details.upTo", { count: subscription.limits.routines })
            }
          />
          <DetailRow label={t("profile.tariffs.details.stats")} value={t(STATS_DEPTH_KEY[subscription.limits.stats])} />
        </DetailSection>
      )}

      <DetailSection title={t("profile.tariffs.details.status")}>
        <p className="text-sm text-primary">{t(`profile.tariffs.details.statusHint.${tariff.state}`)}</p>
        {onRenew && RENEWABLE.has(tariff.state) && (
          <CusButton
            size="sm"
            rounded="9999px"
            className="self-start"
            leftIcon={<LuRefreshCw size={14} />}
            onClick={() => onRenew(tariff)}
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            {t("profile.tariffs.renew")}
          </CusButton>
        )}
      </DetailSection>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-secondary">{title}</h4>
      {children}
    </section>
  );
}

interface DetailRowProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}

function DetailRow({ label, value, valueClassName = "text-primary" }: DetailRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-secondary">{label}</span>
      <span className={`text-right font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}

interface LimitRowProps {
  label: string;
  /** undefined — hali yuklanmoqda yoki so'rov xato berdi. */
  used: number | undefined;
  /** null — cheksiz. */
  max: number | null;
  isLoading: boolean;
}

/** "7 / 10" + to'ldirilish chizig'i. Cheksiz limitda chiziq yo'q; son kelmasa — faqat limit. */
function LimitRow({ label, used, max, isLoading }: LimitRowProps) {
  const { t } = useTranslation();
  const noLimit = t("profile.tariffs.details.noLimit");

  if (max === null) {
    return <DetailRow label={label} value={used === undefined ? noLimit : `${used} · ${noLimit}`} />;
  }

  const pct = used === undefined ? 0 : Math.min(100, Math.round((used / max) * 100));
  const barColor = pct >= 100 ? "bg-error" : pct >= LIMIT_WARNING_PCT ? "bg-warning" : "bg-brand";
  const value = isLoading
    ? "…"
    : used === undefined
      ? t("profile.tariffs.details.upTo", { count: max })
      : `${used} / ${max}`;

  return (
    <div className="flex flex-col gap-1.5">
      <DetailRow
        label={label}
        value={value}
        valueClassName={pct >= 100 ? "text-error-strong" : pct >= LIMIT_WARNING_PCT ? "text-warning-strong" : undefined}
      />
      {(isLoading || used !== undefined) && (
        <div className={`h-1.5 overflow-hidden rounded-chip bg-surface-secondary ${isLoading ? "animate-pulse" : ""}`}>
          <div className={`h-full rounded-chip transition-[width] ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

/** Yopiq accordion bo'limi balandligida. */
export function OrgTariffCardSkeleton() {
  return <div className="h-16 animate-pulse rounded-card border border-subtle bg-surface" />;
}

/** Foydalanuvchi hech bir tashkilotning egasi emas. */
export function OrgTariffEmpty() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuCalendarClock size={20} />
      </span>
      <p className="text-sm font-medium text-primary">{t("profile.tariffs.noOwned")}</p>
      <p className="text-xs text-secondary">{t("profile.tariffs.noOwnedHint")}</p>
    </div>
  );
}
