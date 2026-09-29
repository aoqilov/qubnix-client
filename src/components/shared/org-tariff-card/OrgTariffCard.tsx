import { useTranslation } from "react-i18next";
import { LuCalendarClock, LuInfinity, LuRefreshCw } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusBadge, type BadgeTone } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { avatarColorVar } from "@/utils/avatarColor";
import { daysLabel } from "@/utils/countLabels";
import { useIntlLocale } from "@/i18n/useIntlLocale";
import type { OrgTariff, OrgTariffState } from "@/queries/profile.queries";

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

interface OrgTariffCardProps {
  tariff: OrgTariff;
  /** Berilsa — muddati tugagan/tugayotgan tarifda "Продлить" tugmasi chiqadi. */
  onRenew?: () => void;
}

/** Bitta tashkilot tarifi — "Мои тарифы" ro'yxatidagi karta (mobil drawer va desktop panel). */
export function OrgTariffCard({ tariff, onRenew }: OrgTariffCardProps) {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(
      new Date(iso),
    );

  const detail =
    tariff.state === "free" || tariff.state === "inactive"
      ? null
      : tariff.state === "unlimited"
        ? { icon: <LuInfinity size={14} />, text: t("profile.tariffs.unlimitedHint") }
        : tariff.state === "expired"
          ? tariff.expiresAt && {
              icon: <LuCalendarClock size={14} />,
              text: t("profile.tariffs.expiredOn", { date: formatDate(tariff.expiresAt) }),
            }
          : tariff.expiresAt && {
              icon: <LuCalendarClock size={14} />,
              text: `${t("profile.tariffs.daysLeft", { label: daysLabel(tariff.daysLeft ?? 0) })} · ${t(
                "profile.tariffs.until",
                { date: formatDate(tariff.expiresAt) },
              )}`,
            };

  const detailColor =
    tariff.state === "expired"
      ? "text-error-strong"
      : tariff.state === "expiring"
        ? "text-warning-strong"
        : "text-secondary";

  return (
    <CusCardbox className="flex flex-col gap-3 rounded-card" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 flex-none items-center justify-center rounded-avatar font-semibold text-on-brand"
          style={{ background: avatarColorVar(tariff.id) }}
        >
          {tariff.initials}
        </span>
        <span className="min-w-0 flex-1 truncate font-semibold text-primary">{tariff.name}</span>
        <CusBadge variant="subtle" tone={STATE_TONE[tariff.state]} size="xs">
          {t(`profile.tariffs.state.${tariff.state}`)}
        </CusBadge>
      </div>

      {(detail || (onRenew && RENEWABLE.has(tariff.state))) && (
        <div className="flex items-center justify-between gap-3">
          {detail ? (
            <span className={`flex items-center gap-1.5 text-sm ${detailColor}`}>
              {detail.icon}
              {detail.text}
            </span>
          ) : (
            <span />
          )}
          {onRenew && RENEWABLE.has(tariff.state) && (
            <CusButton
              size="sm"
              rounded="9999px"
              leftIcon={<LuRefreshCw size={14} />}
              onClick={onRenew}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
            >
              {t("profile.tariffs.renew")}
            </CusButton>
          )}
        </div>
      )}
    </CusCardbox>
  );
}

export function OrgTariffCardSkeleton() {
  return <div className="h-[96px] animate-pulse rounded-card border border-subtle bg-surface" />;
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
