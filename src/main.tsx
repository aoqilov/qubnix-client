import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api-config/queryClient";
import "./api-config/interceptors";
import { enterWay } from "./components/layout/enter-way";
import App from "./App";
import "./styles/globals.css";

// Session holati (Telegram silent-auth yoki web token) fon rejimida
// tayyorlanadi — render'ni kutdirmaymiz, chunki AppRoutes o'zi
// sessionStatus'ga (idle/authenticating/authenticated/unauthenticated)
// qarab loading/xato/app holatini ko'rsatadi (Telegram uchun
// TelegramAuthGate, web uchun /login).
void enterWay();

const root = document.getElementById("root")!;
createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
