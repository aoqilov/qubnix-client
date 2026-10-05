import { useTranslation } from "react-i18next";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import {
  InstallAppActionButton,
  InstallAppGuide,
} from "@/components/shared/install-app/InstallAppGuide";
import { useInstallApp } from "@/components/shared/install-app/useInstallApp";

/** "Установить приложение" — o'ng paneldagi yo'riqnoma. */
export function InstallAppCard() {
  const { t } = useTranslation();
  const { mode, primaryAction, runPrimaryAction } = useInstallApp();

  return (
    <CusCardbox className="flex flex-col gap-4 rounded-card">
      <div className="text-sm font-semibold text-primary">{t("profile.install.title")}</div>
      <InstallAppGuide mode={mode} />
      {primaryAction && (
        <div className="flex justify-end">
          <InstallAppActionButton action={primaryAction} onClick={runPrimaryAction} />
        </div>
      )}
    </CusCardbox>
  );
}
