import { Drawer, CloseButton } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";

type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";
type DrawerPlacement = "start" | "end" | "top" | "bottom";

// MobileLayout'dagi bilan bir xil formula — Telegram (ayniqsa fullscreen
// rejimida) notch/home-indicator maydonini --tg-safe-area-inset-* orqali
// beradi; oddiy mobil brauzerda bu o'zgaruvchi yo'q, shuning uchun standart
// env(safe-area-inset-*)'ga tushamiz (index.html'dagi viewport-fit=cover
// buni yoqadi). Drawer.Content Chakra portal orqali <body>ga chiqadi, ya'ni
// MobileLayout'ning safe-area padding'ini meros qilib olmaydi — shu sabab
// bu yerda alohida qo'yiladi.
const SAFE_TOP =
  "calc(var(--tg-safe-area-inset-top, env(safe-area-inset-top, 0px)) + var(--tg-content-safe-area-inset-top, 0px))";
const SAFE_BOTTOM =
  "calc(var(--tg-safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)) + var(--tg-content-safe-area-inset-bottom, 0px))";

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
  closeOnEscape?: boolean;
  backButton?: boolean;
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
  closeOnEscape = true,
  backButton = false,
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
      closeOnEscape={closeOnEscape}
      lazyMount
      unmountOnExit
    >
      <Drawer.Backdrop
        h="100%"
        bg="var(--overlay-backdrop)"
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
          bg="var(--bg-main)"
          borderColor="var(--border-default)"
          borderWidth="1px"
          boxShadow="var(--shadow-modal)"
          color="var(--text-default)"
          display="flex"
          flexDirection="column"
          h={isHorizontal ? undefined : "100dvh"}
          maxH={isBottom ? "90dvh" : undefined}
          overflow="hidden"
          borderRadius={
            isBottom ? "16px 16px 0 0" : isTop ? "0 0 16px 16px" : undefined
          }
          pt={!isBottom ? SAFE_TOP : undefined}
          pb={!isTop ? SAFE_BOTTOM : undefined}
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
              bg="var(--bg-second)"
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

          {/* Close/back button */}
          <Drawer.CloseTrigger
            asChild
            position="absolute"
            top={!isBottom ? `calc(0.875rem + ${SAFE_TOP})` : "3.5"}
            {...(backButton ? { left: "4" } : { right: "4" })}
          >
            <CloseButton
              size="sm"
              aria-label={backButton ? "Orqaga" : "Yopish"}
              color="var(--text-muted)"
              _hover={{ bg: "var(--bg-hover)", color: "var(--text-default)" }}
            >
              {backButton ? (
                <LuArrowLeft size={16} color="var(--text-muted)" />
              ) : undefined}
            </CloseButton>
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

// ✅ "Yangi sahifa" kabi to'liq ekran, faqat orqaga tugmasi bilan yopiladi
// <CusDrawer
//   open={open}
//   onClose={() => setOpen(false)}
//   placement="end"
//   size="full"
//   closeOnBackdrop={false}
//   closeOnEscape={false}
//   backButton
//   title="Yangi vazifa"
// >
//   <CusInput label="Nomi" />
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
