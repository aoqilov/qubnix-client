import type { ReactNode } from "react";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusDialog } from "@/components/ui/dialog/CusDialog";

export type SettingsModalVariant = "drawer" | "dialog";

interface SettingsModalProps {
  /** "drawer" (default) — mobil, o'ngdan to'liq ekran; "dialog" — desktop, markazda. */
  variant?: SettingsModalVariant;
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  /** Faqat drawer'da — CusDialog Esc'ni doim qo'llab-quvvatlaydi. */
  closeOnEscape?: boolean;
  /** Faqat drawer'da. */
  initialFocusEl?: () => HTMLElement | null;
}

/**
 * Settings formalari (taklif, loyiha, routine...) uchun konteyner — forma bir xil,
 * faqat qobig'i platformaga qarab almashadi (MemberPickerDrawer'dagi `variant` bilan bir xil g'oya).
 */
export function SettingsModal({
  variant = "drawer",
  open,
  onClose,
  title,
  footer,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  initialFocusEl,
}: SettingsModalProps) {
  if (variant === "dialog") {
    return (
      <CusDialog
        open={open}
        onClose={onClose}
        title={title}
        size="lg"
        centered
        closeOnBackdrop={closeOnBackdrop}
        footer={footer ? <div className="flex w-full gap-2">{footer}</div> : undefined}
      >
        {children}
      </CusDialog>
    );
  }

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="end"
      size="full"
      title={title}
      footer={footer}
      closeOnBackdrop={closeOnBackdrop}
      closeOnEscape={closeOnEscape}
      initialFocusEl={initialFocusEl}
    >
      {children}
    </CusDrawer>
  );
}
