import { Badge } from "@chakra-ui/react";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeVariant = "solid" | "subtle" | "outline" | "surface" | "plain";
type BadgeSize    = "xs" | "sm" | "md" | "lg";
type ColorPalette =
  | "gray" | "red" | "orange" | "yellow" | "green"
  | "teal" | "blue" | "cyan"  | "purple" | "pink";

export type BadgeStatus = "active" | "inactive" | "fired" | "vacation" | "pending";
export type BadgeRole   = "SUPER_ADMIN" | "OPERATOR_ATTRACTION" | "CASHIER" | "SECURITY" | "CLEANER";

// ─── Maps ─────────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<BadgeStatus, { label: string; color: ColorPalette }> = {
  active:   { label: "Активный",   color: "green"  },
  inactive: { label: "Неактивный", color: "red"   },
  fired:    { label: "Уволен",     color: "gray"    },
  vacation: { label: "В отпуске",  color: "yellow" },
  pending:  { label: "Ожидание",   color: "orange" },
};

const ROLE_MAP: Record<BadgeRole, { label: string; color: ColorPalette }> = {
  SUPER_ADMIN:         { label: "Super Admin", color: "purple" },
  OPERATOR_ATTRACTION: { label: "Operator",    color: "cyan"   },
  CASHIER:             { label: "Kassir",      color: "blue"   },
  SECURITY:            { label: "Security",    color: "orange" },
  CLEANER:             { label: "Cleaner",     color: "gray"   },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface CusBadgeProps {
  children?: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  colorPalette?: ColorPalette;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  dot?: boolean;
  dotColor?: string;
  // preset props — children shart emas, label va rang avtomatik chiqadi
  status?: BadgeStatus;
  role?: BadgeRole;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CusBadge({
  children,
  variant,
  size = "sm",
  colorPalette,
  leftIcon,
  rightIcon,
  dot,
  dotColor,
  status,
  role,
}: CusBadgeProps) {
  // status yoki role berilsa — rang va label avtomatik
  let resolvedColor  = colorPalette ?? "gray";
  let resolvedLabel  = children;
  let resolvedDot    = dot ?? false;
  let resolvedVariant = variant ?? "subtle";

  if (status) {
    const m = STATUS_MAP[status];
    resolvedColor   = m.color;
    resolvedLabel   = resolvedLabel ?? m.label;
    resolvedDot     = dot ?? true;
  } else if (role) {
    const m = ROLE_MAP[role];
    resolvedColor   = m.color;
    resolvedLabel   = resolvedLabel ?? m.label;
    resolvedVariant = variant ?? "surface";
  }

  return (
    <Badge
      variant={resolvedVariant}
      size={size}
      colorPalette={resolvedColor}
      display="inline-flex"
      alignItems="center"
      gap="1"
    >
      {resolvedDot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: dotColor ?? "currentColor",
            flexShrink: 0,
            display: "inline-block",
          }}
        />
      )}
      {leftIcon && !resolvedDot && (
        <span style={{ display: "flex", alignItems: "center" }}>{leftIcon}</span>
      )}
      {resolvedLabel}
      {rightIcon && (
        <span style={{ display: "flex", alignItems: "center" }}>{rightIcon}</span>
      )}
    </Badge>
  );
}
