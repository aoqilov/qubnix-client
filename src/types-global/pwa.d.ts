export {};

declare global {
  /** Chrome/Edge/Android — o'rnatish oynasi. lib.dom'da hali yo'q. */
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface Navigator {
    /** iOS Safari: bosh ekrandan ochilgan bo'lsa true. */
    standalone?: boolean;
  }
}
