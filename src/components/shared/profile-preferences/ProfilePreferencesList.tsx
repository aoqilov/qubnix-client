import { LANGUAGES, isLanguageCode } from "@/i18n/languages";
import { changeLanguage } from "@/i18n";
import { useTranslation } from "react-i18next";
import { forwardRef, type ReactNode } from "react";
import type React from "react";
import {
  LuAArrowDown,
  LuAArrowUp,
  LuALargeSmall,
  LuChevronDown,
  LuLanguages,
  LuMoon,
  LuSun,
  LuSunMoon,
  LuType,
} from "react-icons/lu";
import { useUiStore, type FontSizePreference } from "@/store/ui.store";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import { LanguageFlag } from "@/components/shared/language-flag/LanguageFlag";

interface TriggerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  label: string;
  open: boolean;
}

const TriggerButton = forwardRef<HTMLButtonElement, TriggerButtonProps>(
  function TriggerButton({ icon, label, open, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        {...rest}
        className={`flex items-center gap-1.5 rounded-full bg-brand-subtle px-2.5 py-1 text-sm font-medium text-brand transition ${className ?? ""}`}
      >
        {icon}
        <span>{label}</span>
        <LuChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
    );
  },
);

function PreferenceRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 text-sm text-primary">
      <span className="flex-none text-secondary">{icon}</span>
      <span>{label}</span>
      <span className="flex-1" />
      {children}
    </div>
  );
}

/**
 * Tema, til, shrift o'lchami — mobil (ProfileSettingsModal) va desktop
 * (ProfileSettingsCard) uchun bitta ro'yxat.
 */
export function ProfilePreferencesList() {
  const isDarkMode = useUiStore((s) => s.isDarkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);
  const fontSize = useUiStore((s) => s.fontSize);
  const setFontSize = useUiStore((s) => s.setFontSize);
  const { t, i18n } = useTranslation();

  // Matnlar render paytida — til almashsa yangilanadi.
  const modeItems = [
    { value: "light", label: t("profile.prefs.light"), icon: <LuSun size={14} /> },
    { value: "dark", label: t("profile.prefs.dark"), icon: <LuMoon size={14} /> },
  ];
  const fontSizeItems = [
    { value: "sm", label: t("profile.prefs.fontSm"), icon: <LuAArrowDown size={14} /> },
    { value: "md", label: t("profile.prefs.fontMd"), icon: <LuType size={14} /> },
    { value: "lg", label: t("profile.prefs.fontLg"), icon: <LuAArrowUp size={14} /> },
  ];
  // Til nomlari har doim o'z tilida (Русский / O'zbekcha / Ўзбекча).
  const languageItems = LANGUAGES.map((l) => ({
    value: l.code,
    label: l.label,
    icon: <LanguageFlag code={l.code} />,
  }));

  const modeValue = isDarkMode ? "dark" : "light";
  const mode = modeItems.find((m) => m.value === modeValue) ?? modeItems[0];
  const language = languageItems.find((l) => l.value === i18n.language) ?? languageItems[0];
  const size = fontSizeItems.find((f) => f.value === fontSize) ?? fontSizeItems[1];

  return (
    <CusCardbox
      style={{ padding: 0 }}
      className="flex flex-col divide-y divide-[var(--border-default)] rounded-card"
    >
      <PreferenceRow icon={<LuSunMoon size={18} />} label={t("profile.prefs.mode")}>
        <CusMenuList
          value={modeValue}
          onValueChange={(v) => {
            if ((v === "dark") !== isDarkMode) toggleDarkMode();
          }}
          items={modeItems}
          trigger={(open) => <TriggerButton icon={mode.icon} label={mode.label} open={open} />}
        />
      </PreferenceRow>

      <PreferenceRow icon={<LuLanguages size={18} />} label={t("profile.prefs.language")}>
        <CusMenuList
          value={language.value}
          onValueChange={(code) => {
            if (isLanguageCode(code)) void changeLanguage(code);
          }}
          items={languageItems}
          trigger={(open) => (
            <TriggerButton icon={language.icon} label={language.label} open={open} />
          )}
        />
      </PreferenceRow>

      <PreferenceRow icon={<LuALargeSmall size={18} />} label={t("profile.prefs.fontSize")}>
        <CusMenuList
          value={fontSize}
          onValueChange={(v) => setFontSize(v as FontSizePreference)}
          items={fontSizeItems}
          trigger={(open) => <TriggerButton icon={size.icon} label={size.label} open={open} />}
        />
      </PreferenceRow>
    </CusCardbox>
  );
}
