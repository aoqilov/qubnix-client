import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth.api";
import { useSessionStore } from "@/store/session.store";
import type { TelegramLoginWidgetPayload } from "@/api/auth/auth.types";

export function useTelegramWidgetLogin() {
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: TelegramLoginWidgetPayload) =>
      authApi.byTelegramWidget(payload),
    onSuccess: ({ user }) => setSession(user),
  });
}
