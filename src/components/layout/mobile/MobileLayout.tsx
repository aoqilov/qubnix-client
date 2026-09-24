import { useSyncWorkspaceType } from "@/hooks/useSyncWorkspaceType";
import { Outlet } from "react-router-dom";
import { BottomTabBar } from "./nav/BottomTabBar";

// Telegram (ayniqsa fullscreen rejimida) --tg-safe-area-inset-* (qurilma
// notch/nav) va --tg-content-safe-area-inset-* (Telegram'ning o'zi
// chiqaradigan tugmalar) CSS o'zgaruvchilarini avtomatik o'rnatadi. Oddiy
// brauzerda bu o'zgaruvchilar yo'q, shuning uchun fallback 0px — brauzerdan
// kirilganda safe-area padding ataylab qo'yilmaydi, faqat Telegram'da ishlaydi.
const SAFE_AREA_STYLE = {
  paddingTop:
    "calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px))",
  paddingBottom:
    "calc(var(--tg-safe-area-inset-bottom, 0px) + var(--tg-content-safe-area-inset-bottom, 0px))",
};

export function MobileLayout() {
  useSyncWorkspaceType();

  return (
    <div
      className="flex h-dvh flex-col  bg-canvas text-primary"
      style={SAFE_AREA_STYLE}
    >
      {/* <Header /> */}
      <main
        className="flex-1 overflow-auto border-t border-subtle"
        style={{ paddingBottom: 80 }}
      >
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
