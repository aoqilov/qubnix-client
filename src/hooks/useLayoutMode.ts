import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";

export type LayoutMode = "desktop" | "mobile";

export function useLayoutMode(): LayoutMode {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop ? "desktop" : "mobile";
}
