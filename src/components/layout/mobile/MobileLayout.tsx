import { Outlet } from "react-router-dom";
import { Header } from "./header/Header";
import { BottomTabBar } from "./nav/BottomTabBar";

// Telegram (ayniqsa fullscreen rejimida) --tg-safe-area-inset-* (qurilma
// notch/nav) va --tg-content-safe-area-inset-* (Telegram'ning o'zi
// chiqaradigan tugmalar) CSS o'zgaruvchilarini avtomatik o'rnatadi.
// Oddiy webda bu o'zgaruvchilar yo'q, shuning uchun fallback 0px.
const SAFE_AREA_STYLE = {
  paddingTop:
    "calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px))",
  paddingBottom:
    "calc(var(--tg-safe-area-inset-bottom, 0px) + var(--tg-content-safe-area-inset-bottom, 0px))",
};

export function MobileLayout() {
  return (
    <div className="flex h-screen flex-col" style={SAFE_AREA_STYLE}>
      <Header />
      <main className="flex-1 overflow-auto bg-neutral-100">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
