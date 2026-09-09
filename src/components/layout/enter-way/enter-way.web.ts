import { authApi } from "@/api/auth/auth.api";
import { useSessionStore } from "@/store/session.store";

export async function enterWayWeb(): Promise<void> {
  const existingToken = useSessionStore.getState().token;
  if (!existingToken) {
    useSessionStore.getState().setStatus("unauthenticated");
    return;
  }

  useSessionStore.getState().setStatus("authenticating");
  try {
    const user = await authApi.me();
    useSessionStore.getState().setSession(existingToken, user);
  } catch {
    useSessionStore.getState().clearSession();
  }
}
