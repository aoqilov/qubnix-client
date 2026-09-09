import { Dialog, CloseButton } from "@chakra-ui/react";
import type { ReactNode } from "react";

type DialogSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

interface CusDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  closeOnBackdrop?: boolean;
}

export function CusDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
}: CusDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open }) => !open && onClose()}
      placement={{ lgDown: "bottom", lg: "center" }}
      size={{ lgDown: "full", lg: size }}
      closeOnInteractOutside={closeOnBackdrop}
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
          borderRadius={{ lgDown: "16px 16px 0 0", lg: "16px" }}
          boxShadow="0 25px 50px rgba(0,0,0,0.4)"
          color="var(--text-default)"
          display="flex"
          flexDirection="column"
          maxH={{ lgDown: "90dvh", lg: "85dvh" }}
          minW={{ lg: "760px" }}
          minH={{ lg: "500px" }}
        >
          {/* Drag handle — faqat tablet- da ko'rinadi */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom: "2px",
            }}
            className="desktop:hidden"
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 9999,
                background: "var(--border-2)",
              }}
            />
          </div>

          {/* Header */}
          {(title || description) && (
            <Dialog.Header
              borderBottomWidth="1px"
              borderColor="var(--border-default)"
              px="6"
              py="4"
            >
              {title && (
                <Dialog.Title
                  fontSize="base"
                  fontWeight="semibold"
                  color="var(--text-default)"
                >
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description
                  fontSize="sm"
                  color="var(--text-muted)"
                  mt="0.5"
                >
                  {description}
                </Dialog.Description>
              )}
            </Dialog.Header>
          )}

          {/* Close button */}
          <Dialog.CloseTrigger asChild position="absolute" top="3.5" right="4">
            <CloseButton
              size="sm"
              color="var(--text-muted)"
              _hover={{ bg: "var(--bg-hover)", color: "var(--text-default)" }}
            />
          </Dialog.CloseTrigger>

          {/* Body */}
          <Dialog.Body
            px="6"
            py="5"
            color="var(--text-2)"
            flex="1"
            overflowY="auto"
          >
            {children}
          </Dialog.Body>

          {/* Footer */}
          {footer && (
            <Dialog.Footer
              borderTopWidth="1px"
              borderColor="var(--border-default)"
              px="6"
              py="4"
              gap="2"
            >
              {footer}
            </Dialog.Footer>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

// ─── Ishlatish misoli ─────────────────────────────────────────────────────────
//
// const [open, setOpen] = useState(false)
//
// <CusDialog
//   open={open}
//   onClose={() => setOpen(false)}
//   title="Xodimni o'chirish"
//   description="Bu amalni ortga qaytarib bo'lmaydi."
//   size="sm"
//   footer={
//     <>
//       <Dialog.ActionTrigger asChild>
//         <CusButton variant="outline">Bekor qilish</CusButton>
//       </Dialog.ActionTrigger>
//       <CusButton colorPalette="red" onClick={handleDelete}>
//         O'chirish
//       </CusButton>
//     </>
//   }
// >
//   <p>Hasan Hasanov uchun ma'lumotlar o'chiriladi.</p>
// </CusDialog>
