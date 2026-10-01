import { useTranslation } from "react-i18next";
import { LuChevronDown, LuMaximize, LuMinimize } from "react-icons/lu";
import { useSessionStore } from "@/store/session.store";
import { useFullscreen } from "@/hooks/useFullscreen";
import { isTelegramMiniApp } from "@/utils/platform";
import { CusPopover } from "@/components/ui/popover/CusPopover";
import { ProfilePreferencesList } from "@/components/shared/profile-preferences/ProfilePreferencesList";
import { avatarColorVar } from "@/utils/avatarColor";
import { initialsOf } from "@/utils/calendarDay";

export function Header() {
  const { t } = useTranslation();
  const user = useSessionStore((s) => s.user);
  const fullscreen = useFullscreen();

  return (
    <header className="flex h-14 flex-none items-center justify-end gap-4 border-b border-subtle bg-surface pr-[100px] ">
      {/* To'liq ekran — faqat oddiy brauzerda (Telegram o'z oynasini boshqaradi). */}
      {!isTelegramMiniApp() && fullscreen.isSupported && (
        <button
          type="button"
          onClick={fullscreen.toggle}
          aria-label={fullscreen.isFullscreen ? t("layout.header.exitFullscreen") : t("layout.header.fullscreen")}
          title={fullscreen.isFullscreen ? t("layout.header.exitFullscreen") : t("layout.header.fullscreen")}
          className="flex size-9 items-center justify-center rounded-input text-secondary transition-colors hover:bg-surface-secondary hover:text-primary"
        >
          {fullscreen.isFullscreen ? <LuMinimize size={18} /> : <LuMaximize size={18} />}
        </button>
      )}

      {/* Profil menyusi — ochilganda tema, til, shrift o'lchami. */}
      <CusPopover
        placement="bottom-end"
        width={320}
        trigger={(open) => (
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-card px-2 py-1 text-left transition-colors hover:bg-surface-secondary"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="size-9 flex-none rounded-avatar object-cover"
              />
            ) : (
              <span
                className="flex size-9 flex-none items-center justify-center rounded-avatar text-sm font-semibold text-on-brand"
                style={{ background: avatarColorVar(String(user?.id ?? "")) }}
              >
                {initialsOf(user?.fullName ?? "")}
              </span>
            )}
            <span className="flex min-w-0 flex-col">
              <span className="max-w-[200px] truncate text-sm font-semibold text-primary">
                {user?.fullName ?? "..."}
              </span>
              {user?.phone && (
                <span className="text-xs text-secondary">{user.phone}</span>
              )}
            </span>
            <LuChevronDown
              size={16}
              className={`flex-none text-secondary transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      >
        <div className="p-2">
          <ProfilePreferencesList />
        </div>
      </CusPopover>
    </header>
  );
}
