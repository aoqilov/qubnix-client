import { Dialog } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface CusDialogDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export function CusDialogDelete({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  description,
}: CusDialogDeleteProps) {
  const resolvedTitle = title ?? "Подтвердить удаление";
  const resolvedDescription = description ?? "Это действие нельзя отменить.";
  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open }) => !open && onClose()}
      placement="center"
      size="sm"
      closeOnInteractOutside={!isLoading}
      closeOnEscape={!isLoading}
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop bg="rgba(0,0,0,0.55)" backdropFilter="blur(2px)" />
      <Dialog.Positioner>
        <Dialog.Content
          bg="var(--bg-second)"
          borderColor="var(--border-default)"
          borderWidth="1px"
          borderRadius="14px"
          boxShadow="0 20px 40px rgba(0,0,0,0.35)"
          color="var(--text-default)"
          maxW="400px"
          w="90vw"
        >
          <Dialog.Body px="6" py="6">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LuTriangleAlert size={24} color="#ef4444" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-default)" }}>
                  {resolvedTitle}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {resolvedDescription}
                </p>
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer
            borderTopWidth="1px"
            borderColor="var(--border-default)"
            px="6"
            py="4"
            gap="2"
            display="flex"
            justifyContent="flex-end"
          >
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline" size="sm" isDisabled={isLoading}>
                Отмена
              </CusButton>
            </Dialog.ActionTrigger>
            <CusButton
              size="sm"
              variant="solid"
              colorPalette="red"
              isLoading={isLoading}
              loadingText="Удаление..."
              onClick={onConfirm}
            >
              Удалить
            </CusButton>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
