import { create } from "zustand";

/**
 * Web sessiyasi — POST /auth/verify-code javobidagi `init_data`. Backend uni `initdata`
 * header'ida kutadi (swagger: InitDataHeader). Cookie (`qubnix_session`) yetarli emas: iOS
 * (WebKit — iPhone'dagi Chrome ham) boshqa domen cookie'sini saqlamaydi, API esa boshqa
 * domenda. Telegram'da saqlanmaydi — Mini App SDK har ochilishda yangisini beradi.
 */
const WEB_INIT_DATA_KEY = "qubnix_init_data";

// Safari private rejimi va bloklangan saqlash localStorage'da xato tashlaydi.
export function readStoredInitData(): string | null {
  try {
    return localStorage.getItem(WEB_INIT_DATA_KEY);
  } catch {
    return null;
  }
}

function writeStoredInitData(value: string | null): void {
  try {
    if (value) localStorage.setItem(WEB_INIT_DATA_KEY, value);
    else localStorage.removeItem(WEB_INIT_DATA_KEY);
  } catch {
    // Saqlab bo'lmasa — sessiya shu tab yopilguncha ishlaydi.
  }
}

export interface SessionUser {
  id: number;
  /** Qubnix'dagi ism (Telegram'dagisi emas) — profilni tahrirlash formasi shundan to'ladi. */
  firstName: string;
  lastName: string;
  /** Ko'rsatish uchun: qubnix ismi, bo'lmasa Telegram ismi, bo'lmasa username. */
  fullName: string;
  avatarUrl?: string;
  phone?: string;
}

interface SessionState {
  // Har so'rovga `initdata` header bo'lib qo'shiladi (interceptors.ts, SSE).
  // Telegram — SDK'dan, saqlanmaydi. Web — verify-code javobidan, localStorage'da
  // (WEB_INIT_DATA_KEY). Web'da null bo'lsa — eski, faqat cookie'li sessiya.
  initData: string | null;
  user: SessionUser | null;
  status: "idle" | "authenticating" | "authenticated" | "unauthenticated";
  /** /auth/request-code'dan kelgan token — OTP tasdiqlangunча vaqtincha, faqat runtime holatda. */
  verificationToken: string | null;
  setVerificationToken: (token: string | null) => void;
  setInitData: (initData: string) => void;
  /** Web login: init_data store'ga va localStorage'ga — sahifa yangilansa ham sessiya qoladi. */
  setWebInitData: (initData: string) => void;
  setSession: (user: SessionUser) => void;
  updateUser: (patch: Partial<SessionUser>) => void;
  clearSession: () => void;
  setStatus: (status: SessionState["status"]) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  initData: null,
  user: null,
  status: "idle",
  verificationToken: null,
  setVerificationToken: (verificationToken) => set({ verificationToken }),
  setInitData: (initData) => set({ initData }),
  setWebInitData: (initData) => {
    writeStoredInitData(initData);
    set({ initData });
  },
  setSession: (user) =>
    set({ user, status: "authenticated", verificationToken: null }),
  updateUser: (patch) =>
    set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
  // Backend logout saqlangan init_data'ni bekor qilmaydi — o'chirish frontend vazifasi.
  clearSession: () => {
    writeStoredInitData(null);
    set({
      initData: null,
      user: null,
      status: "unauthenticated",
      verificationToken: null,
    });
  },
  setStatus: (status) => set({ status }),
}));
