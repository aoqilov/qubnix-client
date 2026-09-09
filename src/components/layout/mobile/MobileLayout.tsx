import { Outlet } from "react-router-dom";
import { Header } from "./header/Header";
import { BottomTabBar } from "./nav/BottomTabBar";

export function MobileLayout() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-auto bg-neutral-100">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
