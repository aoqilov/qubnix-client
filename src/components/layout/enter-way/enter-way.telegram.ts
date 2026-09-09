import { authApi } from "@/api/auth/auth.api";
import { getTelegramInitData, initTelegramWebApp } from "@/utils/telegram";
import { useSessionStore } from "@/store/session.store";

export async function enterWayTelegram(): Promise<void> {
  initTelegramWebApp();

  const initData = getTelegramInitData();
  if (!initData) {
    useSessionStore.getState().setStatus("unauthenticated");
    return;
  }

  useSessionStore.getState().setStatus("authenticating");
  try {
    const { token, user } = await authApi.byTelegramInitData({ initData });
    useSessionStore.getState().setSession(token, user);
  } catch {
    useSessionStore.getState().setStatus("unauthenticated");
  }
}
