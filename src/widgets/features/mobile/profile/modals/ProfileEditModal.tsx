import { useRef, useState, type ChangeEvent } from "react";
import { LuCamera, LuCheck } from "react-icons/lu";
import { useSessionStore } from "@/store/session.store";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
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
  const user = useSessionStore((s) => s.user);
  const updateUser = useSessionStore((s) => s.updateUser);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfile = useUpdateProfile();

  if (!user) return null;

  const isDirty =
    (fullName.trim().length > 0 && fullName.trim() !== user.fullName) ||
    avatarUrl !== user.avatarUrl;

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  }

  function handleSave() {
    const patch = { fullName: fullName.trim(), avatarUrl };
    updateProfile.mutate(patch, {
      onSuccess: (response) => {
        if (response.status === 200) {
          updateUser(patch);
          onClose();
        }
      },
    });
  }

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title="Profilni tahrirlash"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-none">
            {avatarUrl ? (
              <CusImagePreview
                src={avatarUrl}
                alt={fullName}
                width={56}
                height={56}
                objectFit="cover"
                preview={false}
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-card bg-brand font-condensed text-xl text-on-brand">
                {getInitials(fullName || user.fullName)}
              </span>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Rasmni almashtirish"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--bg-surface)] bg-brand text-on-brand"
            >
              <LuCamera size={12} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="text-sm text-secondary">
            Rasmni almashtirish uchun kamera belgisini bosing
          </div>
        </div>

        <CusInput
          label="Ism familiya"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <CusInput label="Telefon raqam" value={user.phone ?? ""} disabled />
        <div className="flex justify-end">
          <CusButton
            isDisabled={!isDirty}
            isLoading={updateProfile.isPending}
            leftIcon={<LuCheck size={16} />}
            onClick={handleSave}
          >
            Saqlash
          </CusButton>
        </div>
      </div>
    </CusDrawer>
  );
}
