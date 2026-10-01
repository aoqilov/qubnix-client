import { useRef } from "react";
import type { NavigationType } from "react-router-dom";
import { useSyncWorkspaceType } from "@/hooks/useSyncWorkspaceType";
import { useMobileBack } from "@/hooks/useMobileBack";
import { PageTransition, type PageDirection } from "@/components/layout/page-transition/PageTransition";
import { BottomTabBar } from "./nav/BottomTabBar";

// Telegram (ayniqsa fullscreen rejimida) --tg-safe-area-inset-* (qurilma
// notch/nav) va --tg-content-safe-area-inset-* (Telegram'ning o'zi
// chiqaradigan tugmalar) CSS o'zgaruvchilarini avtomatik o'rnatadi. Oddiy
// brauzerda bu o'zgaruvchilar yo'q, shuning uchun fallback 0px — brauzerdan
// kirilganda safe-area padding ataylab qo'yilmaydi, faqat Telegram'da ishlaydi.
const SAFE_AREA_STYLE = {
  paddingTop:
    "calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px))",
};

// Pastki safe-area layout'da emas, sahifa ichida: sahifa qatlami ekranning eng pastigacha boradi.
// Shunda animatsiya paytida sahifa ichidagi `fixed` elementlar (TaskAddButton) joyidan sakramaydi.
// 80px — BottomTabBar balandligi.
const PAGE_STYLE = {
  paddingBottom:
    "calc(80px + var(--tg-safe-area-inset-bottom, 0px) + var(--tg-content-safe-area-inset-bottom, 0px))",
};

// Bir xil chuqurlikdagi tablar orasida — BottomTabBar tartibi.
const TAB_ORDER = ["/doska", "/profile", "/tasks", "/calendar", "/statistics", "/settings"];

function mobilePageKey(pathname: string): string {
  return pathname === "/" ? "/doska" : pathname;
}

const depth = (pathname: string) => pathname.split("/").filter(Boolean).length;

// iOS navigation stack: ichkariga (/settings → /settings/members) — push, orqaga — pop.
function mobileDirection(from: string, to: string, navigationType: NavigationType): PageDirection {
  const diff = depth(to) - depth(from);
  if (diff !== 0) return diff > 0 ? 1 : -1;
  const fromTab = TAB_ORDER.indexOf(from);
  const toTab = TAB_ORDER.indexOf(to);
  if (fromTab !== -1 && toTab !== -1) return toTab >= fromTab ? 1 : -1;
  return navigationType === "POP" ? -1 : 1;
}

export function MobileLayout() {
  useSyncWorkspaceType();
  const mainRef = useRef<HTMLElement>(null);
  useMobileBack(mainRef);

  return (
    <div
      className="flex h-dvh flex-col  bg-canvas text-primary"
      style={SAFE_AREA_STYLE}
    >
      {/* <Header /> */}
      <main ref={mainRef} className="relative flex-1 overflow-hidden border-t border-subtle">
        <PageTransition getKey={mobilePageKey} getDirection={mobileDirection} style={PAGE_STYLE} />
      </main>
      <BottomTabBar />
    </div>
  );
}
