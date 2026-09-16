import { create } from "zustand";

export interface SessionUser {
  id: number;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
}

interface SessionState {
  // Faqat Telegram uchun — Mini App SDK har ochilishda yangisini beradi,
  // shuning uchun saqlash shart emas. Web uchun har doim null — sessiya
  // backend o'rnatadigan qubnix_session HttpOnly cookie orqali ishlaydi
  // (bu cookie JS'dan ko'rinmaydi/boshqarilmaydi, browser avtomatik yuboradi).
  initData: string | null;
  user: SessionUser | null;
  status: "idle" | "authenticating" | "authenticated" | "unauthenticated";
  /** /auth/request-code'dan kelgan token — OTP tasdiqlangunча vaqtincha, faqat runtime holatda. */
  verificationToken: string | null;
  setVerificationToken: (token: string | null) => void;
  setInitData: (initData: string) => void;
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
  setSession: (user) =>
    set({ user, status: "authenticated", verificationToken: null }),
  updateUser: (patch) =>
    set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
  clearSession: () =>
    set({
      initData: null,
      user: null,
      status: "unauthenticated",
      verificationToken: null,
    }),
  setStatus: (status) => set({ status }),
}));
