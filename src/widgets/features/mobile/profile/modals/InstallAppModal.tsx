import { useTranslation } from "react-i18next";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import {
  InstallAppActionButton,
  InstallAppGuide,
} from "@/components/shared/install-app/InstallAppGuide";
import { useInstallApp } from "@/components/shared/install-app/useInstallApp";

interface InstallAppModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * "Установить приложение" — yo'riqnoma + footer'da tugmalar (birinchisi asosiy). Dasturiy
 * o'rnatish imkoni yo'q joyda (iOS Safari va h.k.) footer'da "Понятно" — drawer'ni yopadi.
 */
export function InstallAppModal({ open, onClose }: InstallAppModalProps) {
  const { t } = useTranslation();
  const { mode, telegramShortcut, actions, run } = useInstallApp();

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title={t("profile.install.title")}
      footer={
        <div className="flex w-full flex-col gap-2">
          {actions.length > 0 ? (
            actions.map((action, i) => (
              <InstallAppActionButton
                key={action}
                action={action}
                secondary={i > 0}
                onClick={() => run(action)}
                className="w-full"
              />
            ))
          ) : (
            <CusButton className="w-full" onClick={onClose}>
              {t("profile.install.actions.gotIt")}
            </CusButton>
          )}
        </div>
      }
    >
      <InstallAppGuide mode={mode} telegramShortcut={telegramShortcut} />
    </CusDrawer>
  );
}
