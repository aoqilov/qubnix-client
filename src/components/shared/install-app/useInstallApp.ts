import { useEffect, useState } from "react";
import { usePwaStore } from "@/store/pwa.store";
import { isTelegramMiniApp } from "@/utils/platform";
import { webInstallUrl } from "@/pwa/installPlatform";

/**
 * - installed — ilova o'rnatilgan holatda ochilgan
 * - telegram  — Mini App ichida: Telegram yorlig'i (bo'lsa) yoki web'ni tashqi brauzerda ochish
 * - prompt    — Chrome/Edge/Android: tizimning o'rnatish oynasi tayyor
 * - manual    — iOS Safari va boshqalar: faqat yo'riqnoma
 */
export type InstallMode = "installed" | "telegram" | "prompt" | "manual";
export type InstallAction = "install" | "addToHomeScreen" | "openInBrowser";
/** Telegram yorlig'i: available — qo'shish mumkin, added — allaqachon bosh ekranda, null — imkon yo'q. */
export type TelegramShortcut = "available" | "added" | null;

type HomeScreenStatus = "unsupported" | "unknown" | "added" | "missed";

/** `addToHomeScreen` SDK'da doim bor, lekin 8.0 dan eski klientda xato tashlaydi. */
function telegramHomeScreenSupported(): boolean {
  const tg = window.Telegram?.WebApp;
  return Boolean(tg?.addToHomeScreen && tg.isVersionAtLeast?.("8.0"));
}

export function useInstallApp() {
  const installPrompt = usePwaStore((s) => s.installPrompt);
  const isInstalled = usePwaStore((s) => s.isInstalled);
  const setInstallPrompt = usePwaStore((s) => s.setInstallPrompt);
  const markInstalled = usePwaStore((s) => s.markInstalled);
  const isTma = isTelegramMiniApp();
  const [homeScreenStatus, setHomeScreenStatus] = useState<HomeScreenStatus | null>(null);

  // Telegram yorlig'i allaqachon qo'shilganmi — javob event orqali asinxron keladi.
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!isTma || !tg || !telegramHomeScreenSupported()) return;
    tg.checkHomeScreenStatus?.((status) => setHomeScreenStatus(status));
    const onAdded = () => setHomeScreenStatus("added");
    tg.onEvent?.("homeScreenAdded", onAdded);
    return () => tg.offEvent?.("homeScreenAdded", onAdded);
  }, [isTma]);

  const mode: InstallMode = isInstalled
    ? "installed"
    : isTma
      ? "telegram"
      : installPrompt
        ? "prompt"
        : "manual";

  const telegramShortcut: TelegramShortcut =
    mode !== "telegram" || !telegramHomeScreenSupported() || homeScreenStatus === "unsupported"
      ? null
      : homeScreenStatus === "added"
        ? "added"
        : "available";

  /** Tugmalar tartibi: birinchisi asosiy. Telegram'da yorliq + web'ni brauzerda ochish. */
  const actions: InstallAction[] =
    mode === "telegram"
      ? telegramShortcut === "available"
        ? ["addToHomeScreen", "openInBrowser"]
        : ["openInBrowser"]
      : mode === "prompt"
        ? ["install"]
        : [];

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

  // Telegram'ning "•••" → "Добавить на экран «Домой»" bilan bir xil: Android'da tizim oynasi,
  // iOS'da Safari ochilib, qolgan qadamlar u yerda qilinadi.
  function addToHomeScreen() {
    window.Telegram?.WebApp?.addToHomeScreen?.();
  }

  function run(action: InstallAction) {
    if (action === "install") void install();
    else if (action === "addToHomeScreen") addToHomeScreen();
    else openInBrowser();
  }

  return { mode, isInstalled, telegramShortcut, actions, run };
}
