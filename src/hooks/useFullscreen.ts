import { useEffect, useState } from "react";

/**
 * Brauzerning to'liq ekran rejimi (F11 bilan bir xil natija, lekin Fullscreen API orqali).
 * F11/Esc bilan tashqaridan o'zgarsa ham holat `fullscreenchange` orqali yangilanadi.
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(() => !!document.fullscreenElement);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  };

  return { isFullscreen, toggle, isSupported: document.fullscreenEnabled };
}
