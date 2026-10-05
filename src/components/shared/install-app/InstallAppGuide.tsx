import { useTranslation } from "react-i18next";
import { useState } from "react";
import { LuCircleCheck, LuDownload, LuExternalLink, LuInfo } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { detectInstallPlatform, type InstallPlatform } from "@/pwa/installPlatform";
import type { InstallAction, InstallMode } from "./useInstallApp";

/** Har platforma uchun yo'riqnoma qadamlari — tartibi shu, matni `profile.install.steps.*` da. */
const INSTALL_STEPS = {
  ios: [
    "profile.install.steps.ios.open",
    "profile.install.steps.ios.share",
    "profile.install.steps.ios.add",
    "profile.install.steps.ios.confirm",
  ],
  android: [
    "profile.install.steps.android.open",
    "profile.install.steps.android.install",
    "profile.install.steps.android.confirm",
  ],
  desktop: [
    "profile.install.steps.desktop.open",
    "profile.install.steps.desktop.install",
    "profile.install.steps.desktop.confirm",
  ],
} as const satisfies Record<InstallPlatform, readonly string[]>;

const PLATFORMS: InstallPlatform[] = ["ios", "android", "desktop"];

interface InstallAppGuideProps {
  mode: InstallMode;
}

/** "Установить приложение" — izoh + platforma bo'yicha qadamlar (mobil drawer va desktop panel uchun umumiy). */
export function InstallAppGuide({ mode }: InstallAppGuideProps) {
  const { t } = useTranslation();
  // Joriy qurilmaniki birinchi ochiladi; boshqa qurilmaga o'rnatmoqchi bo'lsa — tab almashtiradi.
  const [platform, setPlatform] = useState<InstallPlatform>(detectInstallPlatform);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-secondary">{t("profile.install.intro")}</p>

      {mode === "telegram" && (
        <CusCardbox
          className="flex items-start gap-2.5 rounded-card bg-info-soft text-sm text-info-strong"
          style={{ borderColor: "transparent" }}
        >
          <LuInfo size={16} className="mt-0.5 flex-none" />
          <span>{t("profile.install.telegramNote")}</span>
        </CusCardbox>
      )}
      {mode === "installed" && (
        <CusCardbox
          className="flex items-start gap-2.5 rounded-card bg-success-soft text-sm text-success-strong"
          style={{ borderColor: "transparent" }}
        >
          <LuCircleCheck size={16} className="mt-0.5 flex-none" />
          <span>{t("profile.install.installed")}</span>
        </CusCardbox>
      )}

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
          {t("profile.install.stepsTitle")}
        </span>
        <CusSegment
          value={platform}
          onValueChange={(v) => setPlatform(v as InstallPlatform)}
          items={PLATFORMS.map((id) => ({ id, label: t(`profile.install.platform.${id}`) }))}
        />
        <ol className="flex flex-col gap-3">
          {INSTALL_STEPS[platform].map((key, index) => (
            <li key={key} className="flex items-start gap-3">
              <span className="flex size-6 flex-none items-center justify-center rounded-avatar bg-brand-subtle text-xs font-bold text-brand">
                {index + 1}
              </span>
              <span className="pt-0.5 text-sm text-primary">{t(key)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

interface InstallAppActionButtonProps {
  action: InstallAction;
  onClick: () => void;
  className?: string;
}

/** Asosiy tugma: Telegram'da "Открыть в браузере", Chrome/Edge/Android'da "Установить". */
export function InstallAppActionButton({ action, onClick, className }: InstallAppActionButtonProps) {
  const { t } = useTranslation();
  return (
    <CusButton
      className={className}
      leftIcon={action === "install" ? <LuDownload size={16} /> : <LuExternalLink size={16} />}
      onClick={onClick}
    >
      {action === "install"
        ? t("profile.install.actions.install")
        : t("profile.install.actions.openInBrowser")}
    </CusButton>
  );
}
