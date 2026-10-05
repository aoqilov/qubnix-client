import { useTranslation } from "react-i18next";
import { useState, type FormEvent, type ReactNode } from "react";
import { LuCheck, LuCircleCheck, LuExternalLink } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { useIntlLocale } from "@/i18n/useIntlLocale";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { openExternalLink } from "@/utils/telegram";
import {
  useCreateTariffOrderMutation,
  type BillingPeriod,
  type PaymentProvider,
  type Tariff,
  type TariffOrder,
} from "@/queries/profile.queries";

/** confirm → organization → payment (pullik) yoki done (bepul). */
type CheckoutStep = "confirm" | "organization" | "payment" | "done";

/** Brend nomlari — tarjima qilinmaydi. */
const PROVIDERS: { id: PaymentProvider; name: string }[] = [
  { id: "payme", name: "Payme" }, // i18n-ignore
  { id: "click", name: "Click" }, // i18n-ignore
];

interface TariffCheckoutModalProps {
  open: boolean;
  tariff: Tariff;
  period: BillingPeriod;
  onClose: () => void;
  /** Bepul tarif ulangandan keyin "Готово" — tariflar ro'yxatini ham yopadi. */
  onDone: () => void;
  /** Mobil — to'liq ekran drawer (default), desktop — markazdagi dialog. */
  variant?: "drawer" | "dialog";
}

/**
 * Tarif xaridi — bitta ekranda bosqichma-bosqich ochiladi:
 * 1) xulosa + "Вы покупаете …?" (Да / Отмена), 2) tashkilot nomi, 3) pastda Payme / Click.
 * Har ochilishda holat yangidan boshlanadi — ota komponent `key` almashtiradi.
 */
export function TariffCheckoutModal({
  open,
  tariff,
  period,
  onClose,
  onDone,
  variant = "drawer",
}: TariffCheckoutModalProps) {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const createOrder = useCreateTariffOrderMutation();
  const [step, setStep] = useState<CheckoutStep>("confirm");
  const [orgName, setOrgName] = useState("");
  const [orgError, setOrgError] = useState<string | null>(null);
  const [order, setOrder] = useState<TariffOrder | null>(null);
  const [openedProvider, setOpenedProvider] = useState<PaymentProvider | null>(null);

  const amount = period === "yearly" ? tariff.priceYearly : tariff.priceMonthly;
  const isFree = amount === 0;
  const price = new Intl.NumberFormat(intlLocale).format(amount);
  const periodLabel =
    period === "yearly" ? t("profile.checkout.periodYearly") : t("profile.checkout.periodMonthly");

  function saveOrganization() {
    const name = orgName.trim();
    if (!name) {
      setOrgError(t("profile.checkout.orgRequired"));
      return;
    }
    createOrder.mutate(
      { tariffId: tariff.id, period, organizationName: name },
      {
        onSuccess: (created) => {
          setOrder(created);
          setOrgName(name);
          setStep(created.paymentUrls ? "payment" : "done");
        },
        onError: (err) => setOrgError(getApiErrorMessage(err)),
      },
    );
  }

  // Klaviaturadagi "Готово"/Enter — tugma bilan bir xil.
  function submitOrganization(event: FormEvent) {
    event.preventDefault();
    saveOrganization();
  }

  // Nom o'zgarsa buyurtma ham yangidan ochiladi — eski havolada eski nom qolib ketmasin.
  function editOrganization() {
    setOrder(null);
    setOpenedProvider(null);
    setStep("organization");
  }

  function pay(provider: PaymentProvider) {
    const url = order?.paymentUrls?.[provider];
    if (!url) return;
    openExternalLink(url);
    setOpenedProvider(provider);
  }

  const footer =
    step === "payment" ? (
      <div className="flex w-full flex-col gap-2">
        {PROVIDERS.map((provider) => (
          <CusButton
            key={provider.id}
            size="lg"
            className="w-full"
            rounded="var(--radius-button)"
            rightIcon={<LuExternalLink size={16} />}
            onClick={() => pay(provider.id)}
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)", fontWeight: 700 }}
          >
            {provider.name}
          </CusButton>
        ))}
        <CusButton
          size="lg"
          className="w-full"
          rounded="var(--radius-button)"
          variant="outline"
          colorPalette="gray"
          onClick={onClose}
        >
          {t("common.actions.cancel")}
        </CusButton>
      </div>
    ) : step === "done" ? (
      <CusButton size="lg" className="w-full" onClick={onDone}>
        {t("common.actions.done")}
      </CusButton>
    ) : undefined;

  const title = t("profile.checkout.title");
  const body = (
    <div className="flex flex-col gap-4">
      {/* 1. Tasdiqlash */}
      <CheckoutStepCard index={1} title={t("profile.checkout.steps.confirm")} done={step !== "confirm"}>
        <dl className="flex flex-col gap-2 text-sm">
          <SummaryRow label={t("profile.checkout.tariff")} value={tariff.name} />
          <SummaryRow label={t("profile.checkout.period")} value={periodLabel} />
          <SummaryRow
            label={t("profile.checkout.total")}
            value={isFree ? t("profile.pricing.free") : t("profile.checkout.price", { price })}
            strong
          />
        </dl>

        {step === "confirm" && (
          <>
            <p className="rounded-input bg-brand-subtle px-3 py-2.5 text-sm text-primary">
              {isFree
                ? t("profile.checkout.confirmQuestionFree", { name: tariff.name })
                : t("profile.checkout.confirmQuestion", { name: tariff.name, period: periodLabel, price })}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <CusButton variant="outline" colorPalette="gray" onClick={onClose}>
                {t("common.actions.cancel")}
              </CusButton>
              <CusButton onClick={() => setStep("organization")}>{t("profile.checkout.confirmYes")}</CusButton>
            </div>
          </>
        )}
      </CheckoutStepCard>

      {/* 2. Tashkilot nomi */}
      {step !== "confirm" && (
        <CheckoutStepCard
          index={2}
          title={t("profile.checkout.steps.organization")}
          done={step === "payment" || step === "done"}
        >
          {step === "organization" ? (
            <form onSubmit={submitOrganization} className="flex flex-col gap-3">
              <CusInput
                label={t("profile.checkout.orgLabel")}
                placeholder={t("profile.checkout.orgPlaceholder")}
                helperText={orgError ? undefined : t("profile.checkout.orgHint")}
                errorText={orgError ?? undefined}
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  setOrgError(null);
                }}
                enterKeyHint="done"
                autoFocus
              />
              <CusButton isLoading={createOrder.isPending} onClick={saveOrganization}>
                {t("common.actions.save")}
              </CusButton>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-sm font-semibold text-primary">{orgName}</span>
              {step === "payment" && (
                <CusButton size="sm" variant="ghost" colorPalette="gray" onClick={editOrganization}>
                  {t("common.actions.edit")}
                </CusButton>
              )}
            </div>
          )}
        </CheckoutStepCard>
      )}

      {/* 3. To'lov — tugmalar pastda (footer) */}
      {step === "payment" && (
        <CheckoutStepCard index={3} title={t("profile.checkout.steps.payment")} done={false}>
          <p className="text-sm text-secondary">{t("profile.checkout.payHint")}</p>
          {openedProvider && (
            <p className="rounded-input bg-info-soft px-3 py-2.5 text-sm text-info-strong">
              {t("profile.checkout.payOpened", {
                provider: PROVIDERS.find((p) => p.id === openedProvider)?.name,
              })}
            </p>
          )}
        </CheckoutStepCard>
      )}

      {step === "done" && order && (
        <p className="flex items-start gap-2 rounded-input bg-success-soft px-3 py-2.5 text-sm text-success-strong">
          <LuCircleCheck size={18} className="mt-px flex-none" />
          {t("profile.checkout.freeDone", { name: order.organizationName, tariff: tariff.name })}
        </p>
      )}
    </div>
  );

  // Desktop — markazdagi dialog (orqa fon bosilsa yopilmaydi: nom/to'lov yo'qolmasin).
  if (variant === "dialog") {
    return (
      <CusDialog open={open} onClose={onClose} centered size="md" closeOnBackdrop={false} title={title} footer={footer}>
        {body}
      </CusDialog>
    );
  }

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title={title}
      footer={footer}
    >
      {body}
    </CusDrawer>
  );
}

interface CheckoutStepCardProps {
  index: number;
  title: string;
  done: boolean;
  children: ReactNode;
}

/** Bosqich kartasi: raqam (tugagach ✓) + sarlavha + tarkib. */
function CheckoutStepCard({ index, title, done, children }: CheckoutStepCardProps) {
  return (
    <CusCardbox className="flex flex-col gap-3 rounded-card">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex size-6 flex-none items-center justify-center rounded-avatar text-xs font-bold ${
            done ? "bg-success-soft text-success-strong" : "bg-brand-subtle text-brand"
          }`}
        >
          {done ? <LuCheck size={14} /> : index}
        </span>
        <span className="text-sm font-semibold text-primary">{title}</span>
      </div>
      {children}
    </CusCardbox>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-secondary">{label}</dt>
      <dd className={strong ? "text-base font-bold text-primary" : "font-medium text-primary"}>{value}</dd>
    </div>
  );
}
