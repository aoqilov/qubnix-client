import { useTranslation } from "react-i18next";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { useSessionStore } from "@/store/session.store";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { buildNamePatch } from "@/queries/profile.queries";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { useUpdateProfile } from "../hooks/useApiProfile";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ open, onClose }: ProfileEditModalProps) {
  const { t } = useTranslation();
  const user = useSessionStore((s) => s.user);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const updateProfile = useUpdateProfile();

  if (!user) return null;

  const patch = buildNamePatch(user, firstName, lastName);
  const previewName = `${firstName} ${lastName}`.trim() || user.fullName;

  function handleSave() {
    if (!patch) return;
    updateProfile.mutate(patch, { onSuccess: onClose });
  }

  // Drawer doim mount bo'lib turadi — saqlamasdan yopilsa, keyingi ochilishda eski matn/xato qolmasin.
  function handleClose() {
    setFirstName(user!.firstName);
    setLastName(user!.lastName);
    updateProfile.reset();
    onClose();
  }

  return (
    <CusDrawer
      open={open}
      onClose={handleClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title={t("profile.editProfile")}
      footer={
        <div className="flex w-full gap-3">
          <CusButton
            variant="outline"
            colorPalette="gray"
            onClick={handleClose}
            isDisabled={updateProfile.isPending}
            className="flex-1"
          >
            {t("common.actions.cancel")}
          </CusButton>
          <CusButton
            isDisabled={!patch}
            isLoading={updateProfile.isPending}
            leftIcon={<LuCheck size={16} />}
            onClick={handleSave}
            className="flex-1"
          >
            {t("common.actions.save")}
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <CusImagePreview
              src={user.avatarUrl}
              alt={previewName}
              width={56}
              height={56}
              objectFit="cover"
              preview={false}
            />
          ) : (
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-card bg-brand font-condensed text-xl text-on-brand">
              {getInitials(previewName)}
            </span>
          )}
          <div className="min-w-0 truncate text-base font-semibold text-primary">{previewName}</div>
        </div>

        <CusInput
          label={t("profile.edit.firstName")}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <CusInput
          label={t("profile.edit.lastName")}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <CusInput label={t("profile.edit.phone")} value={user.phone ?? ""} disabled />
        {updateProfile.isError && (
          <p className="text-xs text-error-strong">{getApiErrorMessage(updateProfile.error)}</p>
        )}
      </div>
    </CusDrawer>
  );
}
