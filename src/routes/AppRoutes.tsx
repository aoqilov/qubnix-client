import { useEffect, useState } from "react";
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
import { AuthLoading, TelegramAuthError } from "@/components/layout/enter-way/TelegramAuthGate";

// Layout fork: ekran kengligiga qarab (isTma ga emas — Telegram Desktop
// kabi keng oynalar ham shu yerdan AppLayout'ga tushadi).
// Auth fork: Telegram Mini App ichida kirish avtomatik (enterWay, boot
// vaqtida), lekin natija asinxron — shuning uchun sessionStatus'ga qarab
// loading/xato holatini shu yerda ko'rsatamiz. Web'da esa /login ga
// yo'naltiramiz (ro'yxatdan o'tish faqat bot ichida, Telegram'da /login yo'q).
const MIN_LOADING_MS = 2000;

export function AppRoutes() {
  const layoutMode = useLayoutMode();
  const location = useLocation();
  const sessionStatus = useSessionStore((s) => s.status);
  const isTma = isTelegramMiniApp();

  // Loading banner tez o'tib ketib miltillamasligi uchun kamida
  // MIN_LOADING_MS ko'rinib turishi kerak — enterWay tezroq tugasa ham.
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingDone(true), MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  const platformBranch: RouteObject =
    layoutMode === "desktop"
      ? { element: <AppLayout />, children: desktopRoutes }
      : { element: <MobileLayout />, children: mobileRoutes };

  // Muhim: har bir branch aynan bitta useRoutes chaqiradi (Rules of Hooks —
  // hook chaqiruvlar soni/tartibi renderlar orasida bir xil bo'lishi kerak).
  // enterWay hali /users/me javobini kutayotgan bo'lsa (idle/authenticating),
  // gate qarorini asossiz qabul qilmaslik uchun har ikkala oqimda ham
  // avval loading ko'rsatamiz.
  if (sessionStatus === "idle" || sessionStatus === "authenticating" || !minLoadingDone) {
    return useRoutes([{ path: "*", element: <AuthLoading /> }]);
  }

  if (isTma) {
    return useRoutes(
      sessionStatus === "authenticated"
        ? [platformBranch, { path: "*", element: <NotFound /> }]
        : [{ path: "*", element: <TelegramAuthError /> }],
    );
  }

  const needsLogin = sessionStatus !== "authenticated";

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
