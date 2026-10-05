import { usePwaStore } from "@/store/pwa.store";
import { isTelegramMiniApp } from "@/utils/platform";
import { webInstallUrl } from "@/pwa/installPlatform";

/**
 * - installed — ilova o'rnatilgan holatda ochilgan
 * - telegram  — Mini App ichida: o'rnatib bo'lmaydi, web'ni tashqi brauzerda ochamiz
 * - prompt    — Chrome/Edge/Android: tizimning o'rnatish oynasi tayyor
 * - manual    — iOS Safari va boshqalar: faqat yo'riqnoma
 */
export type InstallMode = "installed" | "telegram" | "prompt" | "manual";
export type InstallAction = "install" | "openInBrowser";

export function useInstallApp() {
  const installPrompt = usePwaStore((s) => s.installPrompt);
  const isInstalled = usePwaStore((s) => s.isInstalled);
  const setInstallPrompt = usePwaStore((s) => s.setInstallPrompt);
  const markInstalled = usePwaStore((s) => s.markInstalled);

  const mode: InstallMode = isInstalled
    ? "installed"
    : isTelegramMiniApp()
      ? "telegram"
      : installPrompt
        ? "prompt"
        : "manual";

  const primaryAction: InstallAction | null =
    mode === "telegram" ? "openInBrowser" : mode === "prompt" ? "install" : null;

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    // Bitta event'da prompt() faqat bir marta ishlaydi.
    setInstallPrompt(null);
    if (outcome === "accepted") markInstalled();
  }

  // Telegram linki emas — web manzil tizim brauzerida ochiladi (u yerda o'rnatish mumkin).
  function openInBrowser() {
    const url = webInstallUrl();
    const openLink = window.Telegram?.WebApp?.openLink;
    if (openLink) openLink(url);
    else window.open(url, "_blank", "noopener");
  }

  function runPrimaryAction() {
    if (primaryAction === "install") void install();
    else if (primaryAction === "openInBrowser") openInBrowser();
  }

  return { mode, isInstalled, primaryAction, runPrimaryAction };
}
