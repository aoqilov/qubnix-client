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
  const { mode, telegramShortcut, actions, run } = useInstallApp();

  return (
    <CusCardbox className="flex flex-col gap-4 rounded-card">
      <div className="text-sm font-semibold text-primary">{t("profile.install.title")}</div>
      <InstallAppGuide mode={mode} telegramShortcut={telegramShortcut} />
      {actions.length > 0 && (
        <div className="flex flex-row-reverse flex-wrap justify-start gap-2">
          {actions.map((action, i) => (
            <InstallAppActionButton key={action} action={action} secondary={i > 0} onClick={() => run(action)} />
          ))}
        </div>
      )}
    </CusCardbox>
  );
}
