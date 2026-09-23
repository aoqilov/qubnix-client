import { forwardRef, useState } from "react";
import type React from "react";
import { LuChevronDown, LuMoon, LuSun } from "react-icons/lu";
import { useUiStore, type FontSizePreference } from "@/store/ui.store";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";

const MODE_ITEMS = [
  { value: "light", label: "Yorug'", icon: <LuSun size={14} /> },
  { value: "dark", label: "Qorong'u", icon: <LuMoon size={14} /> },
];

const FONT_SIZE_ITEMS = [
  { value: "sm", label: "Kichik" },
  { value: "md", label: "O'rta" },
  { value: "lg", label: "Katta" },
];

// i18n loyihada yo'q (qat'iy qaror) — bu tanlov hech narsani tarjima qilmaydi,
// faqat interfeys sifatida mavjud.
const LANGUAGE_ITEMS = [
  { value: "uz", label: "O'zbek" },
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
];

interface TriggerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  open: boolean;
}

const TriggerButton = forwardRef<HTMLButtonElement, TriggerButtonProps>(
  function TriggerButton({ label, open, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        {...rest}
        className={`flex items-center gap-1 rounded-full bg-brand-subtle px-2.5 py-1 text-sm font-medium text-brand transition ${className ?? ""}`}
      >
        <span>{label}</span>
        <LuChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
    );
  },
);

interface ProfileSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({ open, onClose }: ProfileSettingsModalProps) {
  const isDarkMode = useUiStore((s) => s.isDarkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);
  const fontSize = useUiStore((s) => s.fontSize);
  const setFontSize = useUiStore((s) => s.setFontSize);
  const [language, setLanguage] = useState("uz");

  const modeValue = isDarkMode ? "dark" : "light";
  const modeLabel =
    MODE_ITEMS.find((m) => m.value === modeValue)?.label ?? "Yorug'";
  const languageLabel =
    LANGUAGE_ITEMS.find((l) => l.value === language)?.label ?? "O'zbek";
  const fontSizeLabel =
    FONT_SIZE_ITEMS.find((f) => f.value === fontSize)?.label ?? "O'rta";

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title="Sozlamalar"
    >
      <CusCardbox
        style={{ padding: 0 }}
        className="flex flex-col divide-y divide-[var(--border-default)] rounded-card"
      >
        <div className="flex items-center gap-3 px-4 py-3 text-sm">
          <span>Rejim</span>
          <span className="flex-1" />
          <CusMenuList
            value={modeValue}
            onValueChange={(v) => {
              if ((v === "dark") !== isDarkMode) toggleDarkMode();
            }}
            items={MODE_ITEMS}
            trigger={(triggerOpen) => (
              <TriggerButton label={modeLabel} open={triggerOpen} />
            )}
          />
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-sm">
          <span>Til</span>
          <span className="flex-1" />
          <CusMenuList
            value={language}
            onValueChange={setLanguage}
            items={LANGUAGE_ITEMS}
            trigger={(triggerOpen) => (
              <TriggerButton label={languageLabel} open={triggerOpen} />
            )}
          />
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-sm">
          <span>Shrift kattaligi</span>
          <span className="flex-1" />
          <CusMenuList
            value={fontSize}
            onValueChange={(v) => setFontSize(v as FontSizePreference)}
            items={FONT_SIZE_ITEMS}
            trigger={(triggerOpen) => (
              <TriggerButton label={fontSizeLabel} open={triggerOpen} />
            )}
          />
        </div>
      </CusCardbox>
    </CusDrawer>
  );
}
