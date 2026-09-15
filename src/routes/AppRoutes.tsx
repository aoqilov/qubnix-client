import { Navigate, useLocation, useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { useLayoutMode } from "@/hooks/useLayoutMode";
import { AppLayout } from "@/components/layout/desktop/AppLayout";
import { MobileLayout } from "@/components/layout/mobile/MobileLayout";
import { desktopRoutes } from "./routes.desktop";
import { mobileRoutes } from "./routes.mobile";
import NotFound from "@/pages/NotFound";
import { useSessionStore } from "@/store/session.store";
import { isTelegramMiniApp } from "@/utils/platform";
import FeatureLogin from "@/widgets/features/login/FeatureLogin";

// Layout fork: ekran kengligiga qarab (isTma ga emas — Telegram Desktop
// kabi keng oynalar ham shu yerdan AppLayout'ga tushadi).
// Telegram Mini App ichida auth avtomatik (enterWay), shuning uchun gate
// faqat web-entry va autentifikatsiya qilinmagan holatda /login ga yo'naltiradi.
export function AppRoutes() {
  const layoutMode = useLayoutMode();
  const location = useLocation();
  const sessionStatus = useSessionStore((s) => s.status);
  const needsLogin = !isTelegramMiniApp() && sessionStatus !== "authenticated";

  const platformBranch: RouteObject =
    layoutMode === "desktop"
      ? { element: <AppLayout />, children: desktopRoutes }
      : { element: <MobileLayout />, children: mobileRoutes };

  // Muhim: useRoutes har renderda chaqirilishi shart (Rules of Hooks) —
  // shuning uchun gate early return emas, route jadvalining o'zida hal bo'ladi.
  const loginRoute: RouteObject = {
    path: "/login",
    element: needsLogin ? <FeatureLogin /> : <Navigate to="/doska" replace />,
  };

  // Autentifikatsiyadan o'tmagan holatda har qanday boshqa URL /login ga
  // ketadi, lekin qayerdan kelgani `state.from` da saqlanadi.
  const guardedBranch: RouteObject = needsLogin
    ? {
        path: "*",
        element: (
          <Navigate
            to="/login"
            replace
            state={{ from: location.pathname + location.search }}
          />
        ),
      }
    : { path: "*", element: <NotFound /> };

  return useRoutes(
    needsLogin
      ? [loginRoute, guardedBranch]
      : [loginRoute, platformBranch, guardedBranch],
  );
}
