import { useTranslation } from "react-i18next";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { useSessionStore } from "@/store/session.store";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
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

interface ProfileEditCardProps {
  onSaved?: () => void;
}

export function ProfileEditCard({ onSaved }: ProfileEditCardProps) {
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
    updateProfile.mutate(patch, { onSuccess: () => onSaved?.() });
  }

  return (
    <CusCardbox className="flex flex-col gap-4 rounded-card">
      <div className="text-sm font-semibold text-primary">{t("profile.editProfile")}</div>

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

      <div className="grid grid-cols-2 gap-4">
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
      </div>
      <CusInput label={t("profile.edit.phone")} value={user.phone ?? ""} disabled />
      {updateProfile.isError && (
        <p className="text-xs text-error-strong">{getApiErrorMessage(updateProfile.error)}</p>
      )}
      <div className="flex justify-end">
        <CusButton
          isDisabled={!patch}
          isLoading={updateProfile.isPending}
          leftIcon={<LuCheck size={16} />}
          onClick={handleSave}
        >
          {t("common.actions.save")}
        </CusButton>
      </div>
    </CusCardbox>
  );
}
