import { useTranslation } from "react-i18next";
import { useState } from "react";
import type React from "react";
import { LuArrowLeft, LuExternalLink, LuPhone, LuSend } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusOtpInput } from "@/components/ui/inputs/CusOtpInput";
import ErrorDialog from "@/components/shared/error-dialog/ErrorDialog";
import {
  authErrorMessage,
  isUserNotFoundError,
  useSendPhoneCode,
  useVerifyPhoneCode,
} from "../hooks/usePhoneLogin";
import { useCountdown } from "../hooks/useCountdown";
import { useLoginRedirect } from "../hooks/useLoginRedirect";
import { BOT_URL, BOT_USERNAME, openBot } from "../lib/bot";
import {
  UZ_DIAL_CODE,
  extractUzDigits,
  formatUzPhone,
  isValidUzPhone,
  toE164,
} from "../lib/phone";

const OTP_LENGTH = 6;

type Step = "phone" | "code";

export function LoginPhoneForm() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("phone");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [code, setCode] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [userNotFoundOpen, setUserNotFoundOpen] = useState(false);

  const timer = useCountdown();
  const sendCode = useSendPhoneCode();
  const verifyCode = useVerifyPhoneCode();
  const redirectAfterLogin = useLoginRedirect();

  const phone = toE164(phoneDigits);

  const requestCode = () => {
    if (!isValidUzPhone(phoneDigits)) {
      setPhoneError(t("auth.phone.incomplete"));
      return;
    }
    setPhoneError(null);
    setCodeError(null);
    setCode("");
    sendCode.mutate(
      { phone },
      {
        onSuccess: ({ expiresIn }) => {
          setStep("code");
          timer.start(expiresIn);
        },
        onError: (error) => {
          if (isUserNotFoundError(error)) {
            setUserNotFoundOpen(true);
            return;
          }
          setPhoneError(authErrorMessage(error, t("auth.phone.sendFailed")));
        },
      },
    );
  };

  const submitCode = (value: string = code) => {
    if (value.length !== OTP_LENGTH) {
      setCodeError(t("auth.code.mustBeSix"));
      return;
    }
    setCodeError(null);
    verifyCode.mutate(
      { code: value },
      {
        onSuccess: () => {
          timer.stop();
          redirectAfterLogin();
        },
        onError: (error) => {
          setCodeError(authErrorMessage(error, t("auth.code.invalid")));
          setCode("");
        },
      },
    );
  };

  const backToPhone = () => {
    timer.stop();
    setStep("phone");
    setCode("");
    setCodeError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "phone") requestCode();
    else submitCode();
  };

  const errorDialog = (
    <ErrorDialog
      open={userNotFoundOpen}
      onClose={() => setUserNotFoundOpen(false)}
      title={t("auth.userNotFound.title")}
      badgeValue={`${UZ_DIAL_CODE} ${formatUzPhone(phoneDigits)}`}
      description={t("auth.userNotFound.text")}
    />
  );

  // ─── 1-qadam: telefon raqami ───────────────────────────────────────────────
  if (step === "phone") {
    return (
      <>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CusInput
            label={t("auth.phone.label")}
            isRequired
            inputMode="tel"
            autoFocus
            inputSize="lg"
            labelFontSize="md"
            helperFontSize="sm"
            placeholder="90 123 45 67"
            value={formatUzPhone(phoneDigits)}
            onChange={(e) => {
              setPhoneDigits(extractUzDigits(e.target.value));
              setPhoneError(null);
            }}
            errorText={phoneError ?? undefined}
            helperText={t("auth.phone.helper")}
            leftElementWidth="5rem"
            leftElement={
              <span className="flex items-center gap-1.5 whitespace-nowrap text-base text-secondary">
                <LuPhone size={16} />
                {UZ_DIAL_CODE}
              </span>
            }
          />

          <CusButton
            size="xl"
            isLoading={sendCode.isPending}
            loadingText={t("common.states.sending")}
            isDisabled={!isValidUzPhone(phoneDigits)}
            rightIcon={<LuSend size={18} />}
            onClick={requestCode}
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            {t("auth.phone.send")}
          </CusButton>
        </form>
        {errorDialog}
      </>
    );
  }

  // ─── 2-qadam: tasdiqlash kodi ──────────────────────────────────────────────
  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-card bg-brand-subtle p-4">
          <p className="text-base leading-relaxed text-primary">
            {t("auth.code.sentBefore")}{" "}
            <a
              href={BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand underline underline-offset-2"
            >
              @{BOT_USERNAME}
            </a>{" "}
            {t("auth.code.sentAfter")}
          </p>

          <CusButton
            colorPalette="purple"
            variant="outline"
            size="sm"
            leftIcon={<LuSend size={15} />}
            rightIcon={<LuExternalLink size={14} />}
            onClick={() => openBot()}
          >
            {t("auth.code.openBot")}
          </CusButton>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-medium text-secondary">
              {t("auth.code.label")}
            </span>
            <span className="text-base text-secondary">
              {UZ_DIAL_CODE} {formatUzPhone(phoneDigits)}
            </span>
          </div>

          <CusOtpInput
            length={OTP_LENGTH}
            value={code}
            autoFocus
            disabled={verifyCode.isPending}
            invalid={!!codeError}
            onChange={(next) => {
              setCode(next);
              setCodeError(null);
            }}
            onComplete={submitCode}
          />

          {codeError ? (
            <span className="text-sm font-medium text-error-strong">{codeError}</span>
          ) : (
            <span className="text-sm text-secondary">
              {timer.isRunning
                ? t("auth.code.validFor", { time: timer.formatted })
                : t("auth.code.expired")}
            </span>
          )}
        </div>

        {timer.isRunning ? (
          <CusButton
            size="xl"
            isLoading={verifyCode.isPending}
            loadingText={t("auth.code.checking")}
            isDisabled={code.length !== OTP_LENGTH}
            rightIcon={<LuSend size={18} />}
            onClick={() => submitCode()}
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            {t("auth.phone.send")}
          </CusButton>
        ) : (
          <CusButton
            colorPalette="purple"
            size="xl"
            variant="outline"
            isLoading={sendCode.isPending}
            loadingText={t("common.states.sending")}
            onClick={requestCode}
          >
            {t("auth.code.resend")}
          </CusButton>
        )}

        <button
          type="button"
          onClick={backToPhone}
          className="mx-auto flex items-center gap-1.5 text-base text-secondary transition hover:text-brand"
        >
          <LuArrowLeft size={16} />
          {t("auth.code.changePhone")}
        </button>
      </form>
      {errorDialog}
    </>
  );
}
