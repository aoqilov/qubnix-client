import type { ComponentType } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LuUser, LuCalendar, LuChartColumn, LuSettings } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";
import {
  footerTabVariants,
  footerTabTransition,
} from "@/styles/animaitons/footer-animation";

const HOME_PATHS = ["/doska", "/profile"];

const HOME_TAB = { to: "/doska", label: "Doska", icon: GrHomeRounded };
const PROFILE_TAB = { to: "/profile", label: "Profil", icon: LuUser };

const WORKSPACE_TABS = [
  { to: "/tasks", label: "BUGUN", icon: FiCheckCircle },
  { to: "/calendar", label: "KALENDAR", icon: LuCalendar },
  { to: "/statistics", label: "STATS", icon: LuChartColumn },
  { to: "/settings", label: "SOZLAMA", icon: LuSettings },
];

// Home rejimda Doska+Profil bitta boxda yonma-yon; workspace rejimda Doska
// yakka o'z boxida, ikkinchi boxda esa workspace tablar.
const BOX1_TABS = { home: [HOME_TAB, PROFILE_TAB], workspace: [HOME_TAB] };
const BOX2_TABS = { home: [], workspace: WORKSPACE_TABS };

function TabIcon({
  isActive,
  label,
  Icon,
}: {
  isActive: boolean;
  label: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
}) {
  return isActive ? (
    <span className="flex flex-row items-center gap-1.5 rounded-[18px] bg-brand px-4 py-2.5 text-on-brand">
      <Icon size={16} />
      <span className="font-condensed text-[14px] tracking-wide">{label}</span>
    </span>
  ) : (
    <Icon size={20} className="text-secondary" />
  );
}
// fix bvo
function TabBox({
  tabs,
  mode,
  direction,
  className,
  animateOnMount = false,
}: {
  tabs: {
    to: string;
    label: string;
    icon: ComponentType<{ size?: number; className?: string }>;
  }[];
  mode: "home" | "workspace";
  direction: number;
  className: string;
  animateOnMount?: boolean;
}) {
  return (
    <nav
      className={`relative flex h-14 items-center overflow-hidden border-y border-subtle px-1.5 shadow-dropdown ${className}`}
      style={{
        background: "color-mix(in srgb, var(--bg-surface) 65%, transparent)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
      }}
    >
      <AnimatePresence initial={animateOnMount} custom={direction}>
        <motion.div
          key={mode}
          custom={direction}
          variants={footerTabVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={footerTabTransition}
          className="absolute inset-0 flex items-center px-1.5"
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="flex flex-1 items-center justify-center"
            >
              {({ isActive }) => (
                <TabIcon
                  isActive={isActive}
                  label={tab.label}
                  Icon={tab.icon}
                />
              )}
            </NavLink>
          ))}
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}

export function BottomTabBar() {
  const location = useLocation();
  const mode: "home" | "workspace" = HOME_PATHS.includes(location.pathname)
    ? "home"
    : "workspace";
  const direction = mode === "workspace" ? 1 : -1;
  const box1Tabs = BOX1_TABS[mode];
  const box2Tabs = BOX2_TABS[mode];

  return (
    <div
      className="z-sticky fixed inset-x-0 flex items-center justify-center gap-2 py-3"
      style={{
        bottom:
          "calc(var(--tg-safe-area-inset-bottom, 0px) + var(--tg-content-safe-area-inset-bottom, 0px))",
        background: "transparent",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
      }}
    >
      <TabBox
        tabs={box1Tabs}
        mode={mode}
        direction={direction}
        className={
          box2Tabs.length > 0
            ? "w-14 flex-none rounded-r-full border-r"
            : "w-44 flex-none rounded-full"
        }
      />

      {box2Tabs.length > 0 && (
        <TabBox
          tabs={box2Tabs}
          mode={mode}
          direction={direction}
          className="flex-1 rounded-l-full border-l"
          animateOnMount
        />
      )}
    </div>
  );
}
