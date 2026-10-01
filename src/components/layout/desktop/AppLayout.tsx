import { useSyncWorkspaceType } from "@/hooks/useSyncWorkspaceType";
import { PageTransition, type PageDirection } from "@/components/layout/page-transition/PageTransition";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./header/Header";

// Sidebar tartibi: pastdagi bo'limga o'tish — push (o'ngdan kiradi), yuqoridagiga — pop.
const PAGE_ORDER = ["/doska", "/profile", "/tasks", "/calendar", "/statistics", "/settings"];

// Faqat birinchi segment: /settings/members ↔ /settings/roles butun sahifani qayta animatsiya qilmaydi
// (master-detail — chap menyu joyida qoladi). "/" darhol /doska'ga yo'naltiriladi — bitta kalit,
// aks holda ilk yuklanishda sahifa "kirib keladi".
function desktopPageKey(pathname: string): string {
  const segment = pathname.split("/")[1];
  return segment ? `/${segment}` : "/doska";
}

function desktopDirection(from: string, to: string): PageDirection {
  return PAGE_ORDER.indexOf(to) >= PAGE_ORDER.indexOf(from) ? 1 : -1;
}

export function AppLayout() {
  useSyncWorkspaceType();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        {/* Sahifalar ichida absolute qatlam sifatida almashadi — padding va scroll o'sha yerda. */}
        <main className="relative flex-1 overflow-hidden bg-canvas text-primary">
          <PageTransition getKey={desktopPageKey} getDirection={desktopDirection} className="p-6" />
        </main>
      </div>
    </div>
  );
}
