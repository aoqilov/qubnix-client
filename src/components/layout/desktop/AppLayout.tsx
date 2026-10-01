import { useSyncWorkspaceType } from "@/hooks/useSyncWorkspaceType";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./header/Header";
import { PageTransition } from "./PageTransition";

export function AppLayout() {
  useSyncWorkspaceType();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        {/* Sahifalar ichida absolute qatlam sifatida almashadi (PageTransition) — padding va scroll o'sha yerda. */}
        <main className="relative flex-1 overflow-hidden bg-canvas text-primary">
          <PageTransition />
        </main>
      </div>
    </div>
  );
}
