import { usersApi } from "@/api/users/users.api";
import { useSessionStore } from "@/store/session.store";

// initData header yuborilmaydi (web'da initData har doim null) — bu so'rov
// faqat qubnix_session HttpOnly cookie orqali (withCredentials: true)
// autentifikatsiya qilinadi. Cookie yo'q/eskirgan bo'lsa 401 keladi va
// interceptor sessiyani "unauthenticated"ga tozalaydi.
export async function enterWayWeb(): Promise<void> {
  useSessionStore.getState().setStatus("authenticating");
  try {
    const user = await usersApi.me();
    useSessionStore.getState().setSession(user);
  } catch {
    useSessionStore.getState().setStatus("unauthenticated");
  }
}
