import { create } from "zustand";

function detectInstalled(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}

interface PwaState {
  /** Chrome/Edge/Android o'rnatish oynasi — `beforeinstallprompt` ushlangan bo'lsa. iOS'da hech qachon kelmaydi. */
  installPrompt: BeforeInstallPromptEvent | null;
  /** Ilova o'rnatilgan holatda (bosh ekran / alohida oyna) ochilgan. */
  isInstalled: boolean;
  /** Yangi versiya fonda yuklab bo'lindi — user tasdig'ini kutyapti. */
  needRefresh: boolean;
  /** Yangi service worker'ni faollashtirib sahifani qayta yuklaydi (src/pwa/registerPwa.ts beradi). */
  applyUpdate: () => void;
  setInstallPrompt: (event: BeforeInstallPromptEvent | null) => void;
  markInstalled: () => void;
  setNeedRefresh: (value: boolean) => void;
  setApplyUpdate: (fn: () => void) => void;
}

export const usePwaStore = create<PwaState>((set) => ({
  installPrompt: null,
  isInstalled: detectInstalled(),
  needRefresh: false,
  applyUpdate: () => window.location.reload(),
  setInstallPrompt: (installPrompt) => set({ installPrompt }),
  markInstalled: () => set({ isInstalled: true, installPrompt: null }),
  setNeedRefresh: (needRefresh) => set({ needRefresh }),
  setApplyUpdate: (applyUpdate) => set({ applyUpdate }),
}));
