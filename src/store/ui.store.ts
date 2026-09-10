import { create } from "zustand";

const DARK_MODE_KEY = "qubnix_dark_mode";

function applyDarkClass(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

const initialDarkMode = localStorage.getItem(DARK_MODE_KEY) === "1";
applyDarkClass(initialDarkMode);

interface UiState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeModal: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () =>
    set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
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
}));
