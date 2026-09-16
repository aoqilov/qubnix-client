import { create } from "zustand";
import { syncTelegramChrome } from "@/utils/telegram";

const DARK_MODE_KEY = "qubnix_dark_mode";
const FONT_SIZE_KEY = "qubnix_font_size";

export type FontSizePreference = "sm" | "md" | "lg";

function applyDarkClass(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  // Telegram ichida bo'lsa header/body rangi ham mavzu bilan birga
  // yangilanadi; oddiy webda bu chaqiruv shunchaki no-op bo'ladi.
  syncTelegramChrome(isDark);
}

function applyFontSize(size: FontSizePreference) {
  document.documentElement.setAttribute("data-font-size", size);
}

const initialDarkMode = localStorage.getItem(DARK_MODE_KEY) === "1";
applyDarkClass(initialDarkMode);

const initialFontSize =
  (localStorage.getItem(FONT_SIZE_KEY) as FontSizePreference | null) ?? "md";
applyFontSize(initialFontSize);

interface UiState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeModal: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: FontSizePreference;
  setFontSize: (size: FontSizePreference) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () =>
    set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  activeModal: null,
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
  isDarkMode: initialDarkMode,
  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    localStorage.setItem(DARK_MODE_KEY, next ? "1" : "0");
    applyDarkClass(next);
    set({ isDarkMode: next });
  },
  fontSize: initialFontSize,
  setFontSize: (size) => {
    localStorage.setItem(FONT_SIZE_KEY, size);
    applyFontSize(size);
    set({ fontSize: size });
  },
}));
