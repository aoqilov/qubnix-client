import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { useCreateWorkspace } from "../hooks/useApiDoska";

interface CreateWorkspaceDialogProps {
  open: boolean;
  onClose: () => void;
}

/** Yangi tashkilot — desktop'da markazdagi dialog (mobil'da to'liq ekran drawer). */
export function CreateWorkspaceDialog({ open, onClose }: CreateWorkspaceDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const createWorkspace = useCreateWorkspace();

  // Yopilganda forma tozalanadi — qayta ochilganda eski qiymat qolmasin.
  useEffect(() => {
    if (!open) {
      setName("");
      createWorkspace.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const canSubmit = name.trim().length > 0 && !createWorkspace.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createWorkspace.mutate({ name: name.trim() }, { onSuccess: onClose });
  };

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title={t("doska.createOrganization.title")}
      size="sm"
      centered
      closeOnBackdrop={!createWorkspace.isPending}
      footer={
        <>
          <CusButton
            variant="outline"
            colorPalette="gray"
            onClick={onClose}
            isDisabled={createWorkspace.isPending}
          >
            {t("common.actions.cancel")}
          </CusButton>
          <CusButton
            onClick={handleSubmit}
            isDisabled={!canSubmit}
            isLoading={createWorkspace.isPending}
            loadingText={t("common.states.creating")}
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            {t("common.actions.create")}
          </CusButton>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <CusInput
          label={t("doska.createOrganization.nameLabel")}
          isRequired
          placeholder={t("doska.createOrganization.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        {createWorkspace.isError && (
          <p className="text-sm text-error-strong">{t("doska.createOrganization.error")}</p>
        )}
      </div>
    </CusDialog>
  );
}
