import { useEffect, useState } from "react";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { useCreateWorkspace } from "../hooks/useApiDoska";

interface ModalAddWorkspaceProps {
  open: boolean;
  onClose: () => void;
}

export function ModalAddWorkspace({ open, onClose }: ModalAddWorkspaceProps) {
  const [name, setName] = useState("");
  const createWorkspace = useCreateWorkspace();

  // Drawer yopilganda forma tozalanadi — qayta ochilganda eski qiymat qolmasin.
  useEffect(() => {
    if (!open) {
      setName("");
      createWorkspace.reset();
    }
    // createWorkspace har renderda yangi obyekt, shuning uchun bog'liqlikda faqat `open`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const canSubmit = name.trim().length > 0 && !createWorkspace.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createWorkspace.mutate({ name: name.trim() }, { onSuccess: onClose });
  };

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      // To'liq ekran rejimi: backdrop ko'rinmaydi, shuning uchun uni bosib yopish
      // mumkin emas — yopish faqat chapdagi orqaga tugmasi yoki "Отмена" orqali.
      closeOnBackdrop={false}
      closeOnEscape={true}
      title="Новый workspace"
      footer={
        <div className="flex w-full gap-3">
          <CusButton
            variant="outline"
            colorPalette="gray"
            onClick={onClose}
            isDisabled={createWorkspace.isPending}
            className="flex-1"
          >
            Отмена
          </CusButton>
          <CusButton
            onClick={handleSubmit}
            isDisabled={!canSubmit}
            isLoading={createWorkspace.isPending}
            loadingText="Создание..."
            className="flex-1"
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            Создать
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <CusInput
          label="Название"
          isRequired
          placeholder="Synapse"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {createWorkspace.isError && (
          <p className="text-sm text-error-strong">
            Не удалось создать workspace. Попробуйте ещё раз.
          </p>
        )}
      </div>
    </CusDrawer>
  );
}
