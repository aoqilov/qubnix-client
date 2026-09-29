import { useTranslation } from "react-i18next";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { ProfilePreferencesList } from "@/components/shared/profile-preferences/ProfilePreferencesList";

interface ProfileSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

/** Tema, til, shrift — mobil'da to'liq ekran drawer (desktop'da o'ng panel). */
export function ProfileSettingsModal({ open, onClose }: ProfileSettingsModalProps) {
  const { t } = useTranslation();
  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title={t("profile.settings")}
    >
      <ProfilePreferencesList />
    </CusDrawer>
  );
}
