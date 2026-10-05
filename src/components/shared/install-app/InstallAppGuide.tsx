import { useTranslation } from "react-i18next";
import { useState, type ReactNode } from "react";
import { LuCircleCheck, LuDownload, LuExternalLink, LuInfo, LuSquarePlus } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { detectInstallPlatform, type InstallPlatform } from "@/pwa/installPlatform";
import type { InstallAction, InstallMode, TelegramShortcut } from "./useInstallApp";

/** Brauzer'dan o'rnatish qadamlari — tartibi shu, matni `profile.install.steps.*` da. */
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

/**
 * Telegram ichidan yorliq qo'shish (Telegram "•••" → "Добавить на экран «Домой»" yoki pastdagi tugma).
 * iOS'da Telegram Safari'ni ochadi — 2–4 qadamlar brauzerdagi bilan (va videodagi bilan) bir xil.
 * Telegram Desktop yorliqni qo'llamaydi — u yerda brauzer qadamlari.
 */
const TELEGRAM_STEPS = {
  ios: [
    "profile.install.telegramSteps.ios.menu",
    "profile.install.steps.ios.share",
    "profile.install.steps.ios.add",
    "profile.install.steps.ios.confirm",
  ],
  android: [
    "profile.install.telegramSteps.android.button",
    "profile.install.telegramSteps.android.confirm",
  ],
  desktop: INSTALL_STEPS.desktop,
} as const satisfies Record<InstallPlatform, readonly string[]>;

const PLATFORMS: InstallPlatform[] = ["ios", "android", "desktop"];

/**
 * Qadamlar ostidagi 10 soniyalik video (D:/qubnix-video'da render qilinadi → public/install/).
 * Fayli yo'q platformada video bloki chiqmaydi. PWA keshiga kirmaydi (mp4 globPatterns'da yo'q).
 */
const INSTALL_VIDEOS: Partial<Record<InstallPlatform, string>> = {
  ios: "/install/ios.mp4",
  android: "/install/android.mp4",
  desktop: "/install/desktop.mp4",
};

/** Telefon videolari vertikal (3:4), kompyuterniki gorizontal (16:10). */
const VIDEO_CLASS: Record<InstallPlatform, string> = {
  ios: "aspect-[3/4] max-w-[280px]",
  android: "aspect-[3/4] max-w-[280px]",
  desktop: "aspect-[16/10] max-w-[560px]",
};

/** Telegram'dan boshlanadigan variant (tepadagi "•••") — qadamlari TELEGRAM_STEPS bilan bir xil. */
const TELEGRAM_VIDEOS: Partial<Record<InstallPlatform, string>> = {
  ios: "/install/ios-telegram.mp4",
  android: "/install/android-telegram.mp4",
  desktop: INSTALL_VIDEOS.desktop,
};

/** iOS Safari/Telegram webview avtomatik o'ynatishi uchun `muted` atribut ham, property ham kerak. */
function playMuted(video: HTMLVideoElement | null) {
  if (!video) return;
  video.muted = true;
  void video.play().catch(() => {});
}

function Note({ tone, children }: { tone: "info" | "success"; children: ReactNode }) {
  return (
    <CusCardbox
      className={`flex items-start gap-2.5 rounded-card text-sm ${
        tone === "info" ? "bg-info-soft text-info-strong" : "bg-success-soft text-success-strong"
      }`}
      style={{ borderColor: "transparent" }}
    >
      {tone === "info" ? (
        <LuInfo size={16} className="mt-0.5 flex-none" />
      ) : (
        <LuCircleCheck size={16} className="mt-0.5 flex-none" />
      )}
      <span>{children}</span>
    </CusCardbox>
  );
}

interface InstallAppGuideProps {
  mode: InstallMode;
  telegramShortcut: TelegramShortcut;
}

/** "Установить приложение" — izoh + platforma bo'yicha qadamlar (mobil drawer va desktop panel uchun umumiy). */
export function InstallAppGuide({ mode, telegramShortcut }: InstallAppGuideProps) {
  const { t } = useTranslation();
  // Joriy qurilmaniki birinchi ochiladi; boshqa qurilmaga o'rnatmoqchi bo'lsa — tab almashtiradi.
  const [platform, setPlatform] = useState<InstallPlatform>(detectInstallPlatform);
  const steps = telegramShortcut ? TELEGRAM_STEPS[platform] : INSTALL_STEPS[platform];
  const video = (telegramShortcut ? TELEGRAM_VIDEOS : INSTALL_VIDEOS)[platform];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-secondary">{t("profile.install.intro")}</p>

      {mode === "telegram" && telegramShortcut === "added" && (
        <Note tone="success">{t("profile.install.shortcutAdded")}</Note>
      )}
      {mode === "telegram" && (
        <Note tone="info">
          {telegramShortcut ? t("profile.install.telegramShortcutNote") : t("profile.install.telegramNote")}
        </Note>
      )}
      {mode === "installed" && <Note tone="success">{t("profile.install.installed")}</Note>}

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
          {steps.map((key, index) => (
            <li key={key} className="flex items-start gap-3">
              <span className="flex size-6 flex-none items-center justify-center rounded-avatar bg-brand-subtle text-xs font-bold text-brand">
                {index + 1}
              </span>
              <span className="pt-0.5 text-sm text-primary">{t(key)}</span>
            </li>
          ))}
        </ol>
        {video && (
          <CusCardbox style={{ padding: 12 }} className="flex justify-center rounded-card">
            <video
              key={video}
              ref={playMuted}
              src={video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className={`w-full rounded-input ${VIDEO_CLASS[platform]}`}
            />
          </CusCardbox>
        )}
      </div>
    </div>
  );
}

const ACTION_META: Record<InstallAction, { icon: ReactNode; labelKey: `profile.install.actions.${InstallAction}` }> = {
  install: { icon: <LuDownload size={16} />, labelKey: "profile.install.actions.install" },
  addToHomeScreen: { icon: <LuSquarePlus size={16} />, labelKey: "profile.install.actions.addToHomeScreen" },
  openInBrowser: { icon: <LuExternalLink size={16} />, labelKey: "profile.install.actions.openInBrowser" },
};

interface InstallAppActionButtonProps {
  action: InstallAction;
  onClick: () => void;
  /** Ikkinchi darajali (masalan Telegram'da "Открыть в браузере" yorliq tugmasi ostida). */
  secondary?: boolean;
  className?: string;
}

/** "Установить" / "Добавить на главный экран" / "Открыть в браузере". */
export function InstallAppActionButton({ action, onClick, secondary, className }: InstallAppActionButtonProps) {
  const { t } = useTranslation();
  const { icon, labelKey } = ACTION_META[action];
  return (
    <CusButton
      className={className}
      variant={secondary ? "outline" : "solid"}
      colorPalette={secondary ? "gray" : "blue"}
      leftIcon={icon}
      onClick={onClick}
    >
      {t(labelKey)}
    </CusButton>
  );
}
