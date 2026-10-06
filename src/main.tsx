import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api-config/queryClient";
import "./api-config/interceptors";
import "./i18n"; // App'dan oldin — birinchi render'dayoq tarjima tayyor bo'lsin.
import { enterWay } from "./components/layout/enter-way";
import { registerPwa } from "./pwa/registerPwa";
import { trackKeyboardInset } from "./utils/keyboardInset";
import App from "./App";
import "./styles/globals.css";

// Session holati (Telegram silent-auth yoki web token) fon rejimida
// tayyorlanadi — render'ni kutdirmaymiz, chunki AppRoutes o'zi
// sessionStatus'ga (idle/authenticating/authenticated/unauthenticated)
// qarab loading/xato/app holatini ko'rsatadi (Telegram uchun
// TelegramAuthGate, web uchun /login).
void enterWay();

// O'rnatish oynasi (beforeinstallprompt) va yangilanishlar — web'da service worker.
registerPwa();

// Klaviatura ochilganda CusDialog/CusDrawer footer'i uning ustida tursin (--keyboard-inset).
trackKeyboardInset();

const root = document.getElementById("root")!;
createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
