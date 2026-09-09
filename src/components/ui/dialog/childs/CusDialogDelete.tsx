import { Dialog, CloseButton } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface CusDialogDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export default function CusDialogDelete({
  open,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}: CusDialogDeleteProps) {
  const resolvedTitle = title ?? "Удалить?";
  const resolvedDescription = description ?? "Это действие нельзя отменить.";
  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open }) => !open && onClose()}
      placement="center"
      size="sm"
      closeOnInteractOutside
      closeOnEscape
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop bg="rgba(0,0,0,0.55)" backdropFilter="blur(2px)" />

      <Dialog.Positioner>
        <Dialog.Content
          bg="var(--bg-second)"
          borderColor="var(--border-default)"
          borderWidth="1px"
          borderRadius="16px"
          boxShadow="0 25px 50px rgba(0,0,0,0.4)"
          color="var(--text-default)"
          maxW="400px"
          w="90vw"
        >
          {/* Close button */}
          <Dialog.CloseTrigger asChild position="absolute" top="3" right="3">
            <CloseButton
              size="sm"
              color="var(--text-muted)"
              _hover={{ bg: "var(--bg-hover)", color: "var(--text-default)" }}
            />
          </Dialog.CloseTrigger>

          {/* Body */}
          <Dialog.Body px="6" pt="6" pb="5">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LuTriangleAlert size={22} style={{ color: "#ef4444" }} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text-default)", marginBottom: 6 }}>
                  {resolvedTitle}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {resolvedDescription}
                </p>
              </div>
            </div>
          </Dialog.Body>

          {/* Footer */}
          <Dialog.Footer
            borderTopWidth="1px"
            borderColor="var(--border-default)"
            px="6"
            py="4"
            gap="2"
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
              isDisabled={isLoading}
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
