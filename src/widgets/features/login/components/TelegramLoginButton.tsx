import { useEffect, useRef } from "react";
import type { TelegramLoginWidgetPayload } from "../types";

interface TelegramLoginButtonProps {
  botUsername: string;
  onAuth: (payload: TelegramLoginWidgetPayload) => void;
}

// Telegram Login Widget hujjati: https://core.telegram.org/widgets/login
export function TelegramLoginButton({ botUsername, onAuth }: TelegramLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callbackName = "__qubnixTelegramAuthCallback";
    (window as unknown as Record<string, unknown>)[callbackName] = onAuth;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", `${callbackName}(user)`);
    script.setAttribute("data-request-access", "write");

    containerRef.current?.appendChild(script);

    return () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
    };
  }, [botUsername, onAuth]);

  return <div ref={containerRef} />;
}
