import { Drawer, CloseButton } from "@chakra-ui/react";
import type { ReactNode } from "react";

type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";
type DrawerPlacement = "start" | "end" | "top" | "bottom";

interface CusDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: DrawerSize;
  placement?: DrawerPlacement;
  closeOnBackdrop?: boolean;
}

export function CusDrawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  placement = "end",
  closeOnBackdrop = true,
}: CusDrawerProps) {
  const isBottom = placement === "bottom";
  const isTop = placement === "top";
  const isHorizontal = isBottom || isTop;

  return (
    <Drawer.Root
      open={open}
      onOpenChange={({ open }) => !open && onClose()}
      placement={placement}
      size={size}
      closeOnInteractOutside={closeOnBackdrop}
      closeOnEscape
      lazyMount
      unmountOnExit
    >
      <Drawer.Backdrop
        h="100%"
        bg="rgba(0,0,0,0.5)"
        backdropFilter="blur(2px)"
        style={{ marginTop: 0 }}
      />

      <Drawer.Positioner
        p="0"
        style={{
          padding: 0,
          marginTop: 0,
          alignItems: isBottom ? "flex-end" : isTop ? "flex-start" : "stretch",
        }}
      >
        <Drawer.Content
          bg="var(--bg-second)"
          borderColor="var(--border-default)"
          borderWidth="1px"
          boxShadow="0 25px 50px rgba(0,0,0,0.4)"
          color="var(--text-default)"
          display="flex"
          flexDirection="column"
          h={isHorizontal ? undefined : "100dvh"}
          maxH={isBottom ? "90dvh" : undefined}
          overflow="hidden"
          borderRadius={
            isBottom ? "16px 16px 0 0" : isTop ? "0 0 16px 16px" : undefined
          }
        >
          {/* Drag handle — faqat bottom placement uchun */}
          {isBottom && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 10,
                paddingBottom: 2,
                flexShrink: 0,
              }}
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
          )}

          {/* Header */}
          {title && (
            <Drawer.Header
              borderBottomWidth="1px"
              borderColor="var(--border-default)"
              px="6"
              py="4"
              flexShrink={0}
            >
              {title && (
                <Drawer.Title
                  fontSize="base"
                  fontWeight="semibold"
                  color="var(--text-default)"
                >
                  {title}
                </Drawer.Title>
              )}
              {description && (
                <Drawer.Description
                  fontSize="sm"
                  color="var(--text-muted)"
                  mt="0.5"
                >
                  {description}
                </Drawer.Description>
              )}
            </Drawer.Header>
          )}

          {/* Close button */}
          <Drawer.CloseTrigger asChild position="absolute" top="3.5" right="4">
            <CloseButton
              size="sm"
              color="var(--text-muted)"
              _hover={{ bg: "var(--bg-hover)", color: "var(--text-default)" }}
            />
          </Drawer.CloseTrigger>

          {/* Body */}
          <Drawer.Body
            px="6"
            py="5"
            color="var(--text-2)"
            flex="1"
            overflowY="auto"
          >
            {children}
          </Drawer.Body>

          {/* Footer */}
          {footer && (
            <Drawer.Footer
              borderTopWidth="1px"
              borderColor="var(--border-default)"
              px="6"
              py="4"
              gap="2"
              flexShrink={0}
            >
              {footer}
            </Drawer.Footer>
          )}
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}

// ─── Ishlatish ────────────────────────────────────────────────────────────────

// ✅ O'ngdan chiqadigan panel (default)
// const [open, setOpen] = useState(false)
// <CusDrawer
//   open={open}
//   onClose={() => setOpen(false)}
//   title="Filter"
//   size="sm"
// >
//   <p>Filter content...</p>
// </CusDrawer>

// ✅ Chapdan chiqadigan navigatsiya panel
// <CusDrawer placement="start" title="Menyu" size="xs" ...>
//   ...
// </CusDrawer>

// ✅ Pastdan chiqadigan (mobile-friendly action sheet)
// <CusDrawer placement="bottom" title="Amallar" size="md" ...>
//   ...
// </CusDrawer>

// ✅ Footer bilan
// <CusDrawer
//   open={open}
//   onClose={() => setOpen(false)}
//   title="Yangi xodim"
//   footer={
//     <>
//       <Drawer.ActionTrigger asChild>
//         <CusButton variant="outline">Bekor qilish</CusButton>
//       </Drawer.ActionTrigger>
//       <CusButton onClick={handleSave}>Saqlash</CusButton>
//     </>
//   }
// >
//   <CusInput label="Ism" />
// </CusDrawer>
