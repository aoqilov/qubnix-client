import { usersApi } from "@/api/users/users.api";
import { getTelegramInitData, initTelegramWebApp } from "@/utils/telegram";
import { useSessionStore } from "@/store/session.store";

export async function enterWayTelegram(): Promise<void> {
  initTelegramWebApp();

  const initData = getTelegramInitData();
  if (!initData) {
    useSessionStore.getState().setStatus("unauthenticated");
    return;
  }

  // initData'ni darhol store'ga yozamiz — interceptor shundan keyingi har bir
  // so'rovga (shu jumladan quyidagi users/me'ga) `initdata` header qo'shadi.
  useSessionStore.getState().setInitData(initData);
  useSessionStore.getState().setStatus("authenticating");
  try {
    const user = await usersApi.me();
    useSessionStore.getState().setSession(user);
  } catch {
    useSessionStore.getState().setStatus("unauthenticated");
  }
}
