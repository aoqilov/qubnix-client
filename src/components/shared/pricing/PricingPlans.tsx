import { useTranslation } from "react-i18next";
import { useState, type ReactNode } from "react";
import {
  LuChartColumn,
  LuCheck,
  LuFolderKanban,
  LuGift,
  LuRepeat,
  LuSparkles,
  LuUsers,
} from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { useIntlLocale } from "@/i18n/useIntlLocale";
import type { BillingPeriod, Tariff, TariffId } from "@/queries/profile.queries";

// Pro kartasi — to'liq brend gradient; Chakra/Tailwind'da tayyor sinf yo'q, token'lar inline (hex emas).
const HIGHLIGHT_BG = "linear-gradient(150deg, var(--brand-default), var(--brand-pressed))";

interface PricingPlansProps {
  tariffs: Tariff[];
  onChoose: (tariffId: TariffId, period: BillingPeriod) => void;
  /** So'rov ketayotgan tarif — tugmasida spinner. */
  pendingId?: TariffId | null;
  /** Kartalar joylashuvi: mobil'da ustma-ust, desktop'da 3 ustun. */
  columns?: "stack" | "three";
}

/** "Тарифы и цены" — Oylik/Yillik almashtirgich va 3 ta tarif kartasi (mobil va desktop). */
export function PricingPlans({ tariffs, onChoose, pendingId, columns = "stack" }: PricingPlansProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-xl font-bold text-primary">{t("profile.pricing.title")}</h2>
        <p className="text-sm text-secondary">{t("profile.pricing.subtitle")}</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-full max-w-xs">
          <CusSegment
            value={period}
            onValueChange={(v) => setPeriod(v as BillingPeriod)}
            items={[
              { id: "monthly", label: t("profile.pricing.monthly") },
              { id: "yearly", label: t("profile.pricing.yearly") },
            ]}
          />
        </div>
        <span className="flex items-center gap-1.5 rounded-chip bg-success-soft px-2.5 py-1 text-xs font-semibold text-success-strong">
          <LuGift size={12} />
          {t("profile.pricing.yearlyBonus")}
        </span>
      </div>

      <div
        className={
          columns === "three"
            ? "grid grid-cols-1 items-stretch gap-4 xl:grid-cols-3"
            : "flex flex-col gap-4"
        }
      >
        {tariffs.map((tariff) => (
          <PricingCard
            key={tariff.id}
            tariff={tariff}
            period={period}
            isPending={pendingId === tariff.id}
            onChoose={() => onChoose(tariff.id, period)}
          />
        ))}
      </div>
    </div>
  );
}

interface PricingCardProps {
  tariff: Tariff;
  period: BillingPeriod;
  isPending: boolean;
  onChoose: () => void;
}

function PricingCard({ tariff, period, isPending, onChoose }: PricingCardProps) {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const format = (n: number) => new Intl.NumberFormat(intlLocale).format(n);
  const highlighted = !!tariff.recommended;
  const isFree = tariff.priceMonthly === 0;
  const price = period === "yearly" ? tariff.priceYearly : tariff.priceMonthly;

  const { members, projects, routines, stats } = tariff.limits;
  const features: { icon: ReactNode; text: string }[] = [
    { icon: <LuUsers size={16} />, text: t("profile.pricing.features.members", { count: members ?? 0 }) },
    {
      icon: <LuFolderKanban size={16} />,
      text:
        projects === null
          ? t("profile.pricing.features.projectsUnlimited")
          : t("profile.pricing.features.projects", { count: projects }),
    },
    {
      icon: <LuRepeat size={16} />,
      text:
        routines === null
          ? t("profile.pricing.features.routinesUnlimited")
          : t("profile.pricing.features.routines", { count: routines }),
    },
    {
      icon: <LuChartColumn size={16} />,
      text:
        stats === "today"
          ? t("profile.pricing.features.statsToday")
          : stats === "3months"
            ? t("profile.pricing.features.stats3months")
            : t("profile.pricing.features.statsFull"),
    },
  ];

  const muted = highlighted ? "text-on-brand opacity-80" : "text-secondary";

  return (
    <CusCardbox
      className={`relative flex flex-col gap-5 rounded-popover ${highlighted ? "shadow-md" : ""}`}
      style={
        highlighted
          ? { background: HIGHLIGHT_BG, borderColor: "transparent", color: "var(--text-on-brand)" }
          : { borderColor: "var(--border-subtle)" }
      }
    >
      {/* Nom + tavsiya belgisi */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className={`text-lg font-bold ${highlighted ? "text-on-brand" : "text-primary"}`}>
            {tariff.name}
          </h3>
          <p className={`mt-0.5 text-sm ${muted}`}>{t(`profile.pricing.tagline.${tariff.id}`)}</p>
        </div>
        {highlighted && (
          <span className="flex flex-none items-center gap-1 rounded-chip bg-surface px-2.5 py-1 text-xs font-semibold text-brand">
            <LuSparkles size={12} />
            {t("profile.pricing.recommended")}
          </span>
        )}
      </div>

      {/* Narx */}
      <div>
        {isFree ? (
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${highlighted ? "text-on-brand" : "text-primary"}`}>
              {t("profile.pricing.free")}
            </span>
            <span className={`text-sm ${muted}`}>{t("profile.pricing.forever")}</span>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className={`text-3xl font-extrabold ${highlighted ? "text-on-brand" : "text-primary"}`}>
                {format(price)}
              </span>
              <span className={`text-sm ${muted}`}>
                {period === "yearly" ? t("profile.pricing.perYear") : t("profile.pricing.perMonth")}
              </span>
            </div>
            {period === "yearly" && (
              <p className={`mt-1 text-xs ${muted}`}>
                {t("profile.pricing.yearlyPerMonth", { price: format(Math.round(price / 12)) })}
              </p>
            )}
          </>
        )}
      </div>

      {/* Imkoniyatlar */}
      <ul className="flex flex-1 flex-col gap-2.5">
        {features.map((feature) => (
          <li key={feature.text} className="flex items-center gap-2.5 text-sm">
            <span
              className={`flex size-7 flex-none items-center justify-center rounded-avatar ${
                highlighted ? "bg-surface text-brand" : "bg-brand-subtle text-brand"
              }`}
            >
              {feature.icon}
            </span>
            <span className={`flex-1 ${highlighted ? "text-on-brand" : "text-primary"}`}>{feature.text}</span>
            <LuCheck size={16} className={highlighted ? "text-on-brand" : "text-success-strong"} />
          </li>
        ))}
      </ul>

      {/* Tugma */}
      <CusButton
        size="lg"
        rounded="9999px"
        className="w-full"
        variant={isFree ? "outline" : "solid"}
        isLoading={isPending}
        onClick={onChoose}
        style={
          highlighted
            ? { background: "var(--bg-surface)", color: "var(--brand-default)", fontWeight: 700 }
            : isFree
              ? { borderColor: "var(--brand-default)", color: "var(--brand-default)", fontWeight: 600 }
              : { background: "var(--brand-default)", color: "var(--text-on-brand)", fontWeight: 600 }
        }
      >
        {isFree ? t("profile.pricing.startFree") : t("profile.pricing.choose", { name: tariff.name })}
      </CusButton>
    </CusCardbox>
  );
}
