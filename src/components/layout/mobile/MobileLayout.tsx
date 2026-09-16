import { Outlet } from "react-router-dom";
import { BottomTabBar } from "./nav/BottomTabBar";

// Telegram (ayniqsa fullscreen rejimida) --tg-safe-area-inset-* (qurilma
// notch/nav) va --tg-content-safe-area-inset-* (Telegram'ning o'zi
// chiqaradigan tugmalar) CSS o'zgaruvchilarini avtomatik o'rnatadi. Oddiy
// mobil brauzerda (Telegram'siz) bu o'zgaruvchilar yo'q — o'sha holatda
// standart env(safe-area-inset-*)'ga (index.html'dagi viewport-fit=cover
// buni yoqadi) tushamiz, aks holda qurilmaning gesture-nav/home-indicator
// maydoni butunlay hisobga olinmay qolardi. Ikkalasi qo'shilmaydi —
// --tg-safe-area-inset-* mavjud bo'lsa (Telegram), var() fallback'i
// ishlamaydi, shuning uchun ikki marta hisoblanib ketmaydi.
const SAFE_AREA_STYLE = {
  paddingTop:
    "calc(var(--tg-safe-area-inset-top, env(safe-area-inset-top, 0px)) + var(--tg-content-safe-area-inset-top, 0px))",
  paddingBottom:
    "calc(var(--tg-safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)) + var(--tg-content-safe-area-inset-bottom, 0px))",
};

export function MobileLayout() {
  return (
    <div
      className="flex h-screen flex-col bg-canvas text-primary"
      style={SAFE_AREA_STYLE}
    >
      {/* <Header /> */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
