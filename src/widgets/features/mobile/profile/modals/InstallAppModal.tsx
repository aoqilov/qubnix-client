import { useTranslation } from "react-i18next";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import {
  InstallAppActionButton,
  InstallAppGuide,
} from "@/components/shared/install-app/InstallAppGuide";
import { useInstallApp } from "@/components/shared/install-app/useInstallApp";

interface InstallAppModalProps {
  open: boolean;
  onClose: () => void;
}

/** "Установить приложение" — yo'riqnoma; asosiy tugma (bo'lsa) footer'da. */
export function InstallAppModal({ open, onClose }: InstallAppModalProps) {
  const { t } = useTranslation();
  const { mode, primaryAction, runPrimaryAction } = useInstallApp();

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
        primaryAction && (
          <div className="flex w-full">
            <InstallAppActionButton action={primaryAction} onClick={runPrimaryAction} className="flex-1" />
          </div>
        )
      }
    >
      <InstallAppGuide mode={mode} />
    </CusDrawer>
  );
}
