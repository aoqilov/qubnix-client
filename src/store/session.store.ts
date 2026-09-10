import { create } from "zustand";

export interface SessionUser {
  id: string;
  fullName: string;
  role: string;
  phone?: string;
}

interface SessionState {
  token: string | null;
  user: SessionUser | null;
  status: "idle" | "authenticating" | "authenticated" | "unauthenticated";
  setSession: (token: string, user: SessionUser) => void;
  clearSession: () => void;
  setStatus: (status: SessionState["status"]) => void;
}

const TOKEN_STORAGE_KEY = "qubnix_token";

export const useSessionStore = create<SessionState>((set) => ({
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  user: null,
  status: "idle",
  setSession: (token, user) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    set({ token, user, status: "authenticated" });
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({ token: null, user: null, status: "unauthenticated" });
  },
  setStatus: (status) => set({ status }),
}));
