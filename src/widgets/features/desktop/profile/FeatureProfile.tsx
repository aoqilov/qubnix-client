import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LuChevronRight, LuCircleCheck, LuDownload, LuSlidersVertical, LuX } from "react-icons/lu";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { useUiStore } from "@/store/ui.store";
import { TariffsSection, CurrentTariffCard, TariffsListCard } from "./components/TariffsSection";
import { ProfileUserCard } from "./components/ProfileUserCard";
import { ProfileEditCard } from "./components/ProfileEditCard";
import { ProfileSettingsCard } from "./components/ProfileSettingsCard";
import { InstallAppCard } from "./components/InstallAppCard";
import { usePwaStore } from "@/store/pwa.store";

type PanelId =
  | "settings"
  | "current-tariff"
  | "tariffs-list"
  | "edit-profile"
  | "install-app"
  | null;

/**
 * Desktop profil — chapda menyu, tanlangan bo'lim o'ngdagi panelda ochiladi
 * (mobil'da har biri to'liq ekran drawer). Panel ochiq paytda sidebar yig'iladi.
 */
export default function FeatureProfile() {
  const { t } = useTranslation();
  const [activePanel, setActivePanel] = useState<PanelId>(null);
  const setSidebarCollapsed = useUiStore((s) => s.setSidebarCollapsed);

  // "Продлить" bosilgan tashkilot; tariflar menyudan ochilsa — yo'q (yangi tashkilot).
  const [renewOrg, setRenewOrg] = useState<{ id: string; name: string } | null>(null);

  function select(id: PanelId) {
    setRenewOrg(null);
    setActivePanel(id);
    setSidebarCollapsed(true);
  }

  function close() {
    setActivePanel(null);
    setSidebarCollapsed(false);
  }

  useEffect(() => {
    return () => setSidebarCollapsed(false);
  }, [setSidebarCollapsed]);

  const isInstalled = usePwaStore((s) => s.isInstalled);
  const [searchParams, setSearchParams] = useSearchParams();

  // Tashqaridan panelni to'g'ridan-to'g'ri ochish:
  // - Telegram'dan "Открыть в браузере" → /profile?install=1 — o'rnatish yo'riqnomasi;
  // - /doska'dagi "Создать организацию" → /profile?tariffs=1 — tariflar (tanlov → checkout).
  useEffect(() => {
    const panel: PanelId =
      searchParams.get("install") === "1"
        ? "install-app"
        : searchParams.get("tariffs") === "1"
          ? "tariffs-list"
          : null;
    if (!panel) return;
    // "Улучшить тариф" (limit oynasidan): ?tariffs=1&renew=<orgId>&renewName=<nom> — shu tashkilot uchun.
    const renewId = searchParams.get("renew");
    setRenewOrg(renewId ? { id: renewId, name: searchParams.get("renewName") ?? "" } : null);
    setActivePanel(panel);
    setSidebarCollapsed(true);
    const next = new URLSearchParams(searchParams);
    next.delete("install");
    next.delete("tariffs");
    next.delete("renew");
    next.delete("renewName");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, setSidebarCollapsed]);

  return (
    <div className="flex flex-col gap-5">
      <CusPageTitle className="" title={t("profile.title")} subtitle={t("profile.description")} />

      <div className="flex gap-6">
        <div className="flex w-full max-w-xl flex-none flex-col gap-5">
          <ProfileUserCard
            active={activePanel === "edit-profile"}
            onEdit={() => select("edit-profile")}
          />

          <CusCardbox
            style={{ padding: 0 }}
            className="flex flex-col divide-y divide-default overflow-hidden rounded-card"
          >
            <button
              onClick={() => select("settings")}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-secondary ${
                activePanel === "settings" ? "bg-surface-secondary" : ""
              }`}
            >
              <LuSlidersVertical size={18} className="flex-none text-secondary" />
              <span className="flex-1 text-sm font-medium text-primary">{t("profile.settings")}</span>
              <LuChevronRight size={16} className="flex-none text-secondary" />
            </button>
            {isInstalled ? (
              <div className="flex w-full items-center gap-3 px-4 py-3.5">
                <LuCircleCheck size={18} className="flex-none text-success-strong" />
                <span className="flex-1 text-sm font-medium text-primary">
                  {t("profile.install.installedTitle")}
                </span>
              </div>
            ) : (
              <button
                onClick={() => select("install-app")}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-secondary ${
                  activePanel === "install-app" ? "bg-surface-secondary" : ""
                }`}
              >
                <LuDownload size={18} className="flex-none text-secondary" />
                <span className="flex-1 text-sm font-medium text-primary">{t("profile.install.title")}</span>
                <LuChevronRight size={16} className="flex-none text-secondary" />
              </button>
            )}
          </CusCardbox>

          <TariffsSection
            activeId={
              activePanel === "current-tariff" || activePanel === "tariffs-list" ? activePanel : null
            }
            onSelect={select}
          />

          <p className="text-center text-xs text-disabled">
            {t("profile.version", { version: __APP_VERSION__ })}
          </p>
        </div>

        {activePanel && (
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex justify-end">
              <button
                onClick={close}
                aria-label={t("common.actions.close")}
                className="rounded-input p-1.5 text-secondary transition hover:bg-surface-secondary hover:text-primary"
              >
                <LuX size={18} />
              </button>
            </div>
            {activePanel === "edit-profile" && <ProfileEditCard onSaved={close} />}
            {activePanel === "settings" && <ProfileSettingsCard />}
            {activePanel === "current-tariff" && (
              <CurrentTariffCard
                onRenew={(org) => {
                  select("tariffs-list");
                  setRenewOrg({ id: org.id, name: org.name });
                }}
              />
            )}
            {activePanel === "tariffs-list" && <TariffsListCard organization={renewOrg ?? undefined} onDone={() => select("current-tariff")} />}
            {activePanel === "install-app" && <InstallAppCard />}
          </div>
        )}
      </div>
    </div>
  );
}
