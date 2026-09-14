import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./header/Header";

export function AppLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-auto bg-[var(--bg-main)] p-6 text-[var(--text-default)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
