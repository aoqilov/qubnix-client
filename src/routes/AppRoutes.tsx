import { useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { useLayoutMode } from "@/hooks/useLayoutMode";
import { AppLayout } from "@/components/layout/desktop/AppLayout";
import { MobileLayout } from "@/components/layout/mobile/MobileLayout";
import { webRoutes } from "./routes.web";
import { mobileRoutes } from "./routes.mobile";
import NotFound from "@/pages/NotFound";

// Layout fork: ekran kengligiga qarab (isTma ga emas — Telegram Desktop
// kabi keng oynalar ham shu yerdan AppLayout'ga tushadi).
// Auth talabi yo'q — istalgan sahifaga URL orqali to'g'ridan-to'g'ri o'tiladi.
export function AppRoutes() {
  const layoutMode = useLayoutMode();

  const platformBranch: RouteObject =
    layoutMode === "desktop"
      ? { element: <AppLayout />, children: webRoutes }
      : { element: <MobileLayout />, children: mobileRoutes };

  return useRoutes([platformBranch, { path: "*", element: <NotFound /> }]);
}
