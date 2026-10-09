import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LuFolderKanban, LuRepeat, LuUsers } from "react-icons/lu";
import type { IconType } from "react-icons";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { useLayoutMode } from "@/hooks/useLayoutMode";
import { CusButton } from "@/components/ui/buttons/CusButton";

export type LimitResource = "projects" | "members" | "routines";

const ICONS: Record<LimitResource, IconType> = {
  projects: LuFolderKanban,
  members: LuUsers,
  routines: LuRepeat,
};

interface LimitReachedDrawerProps {
  open: boolean;
  onClose: () => void;
  resource: LimitResource;
  /** undefined — joriy soni noma'lum (routine'lar). */
  used: number | undefined;
  /** null — cheksiz yoki hali yuklanmagan. */
  max: number | null;
  planName?: string;
  /** Tarifni oshirish shu tashkilot uchun ochiladi. */
  organization?: { id: string; name: string };
  isOwner: boolean;
}

/** Tarif limitiga yetilganda chiqadigan oyna (mobil — pastdan drawer, desktop — markaziy dialog): limit, joriy tarif va "Улучшить тариф". */
export function LimitReachedDrawer({
  open,
  onClose,
  resource,
  used,
  max,
  planName,
  organization,
  isOwner,
}: LimitReachedDrawerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const Icon = ICONS[resource];
  const isDesktop = useLayoutMode() === "desktop";

  function upgrade() {
    if (!organization) return;
    onClose();
    const params = new URLSearchParams({
      tariffs: "1",
      renew: organization.id,
      renewName: organization.name,
    });
    navigate(`/profile?${params}`);
  }

  const title = t(`limits.title.${resource}`);
  const footer = (
    <div className="flex w-full flex-col gap-2">
      {isOwner && (
        <CusButton size="lg" className="w-full" onClick={upgrade}>
          {t("limits.upgrade")}
        </CusButton>
      )}
      <CusButton
        size="lg"
        className="w-full"
        variant="outline"
        colorPalette="gray"
        onClick={onClose}
      >
        {t("common.actions.close")}
      </CusButton>
    </div>
  );
  const body = (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex size-12 items-center justify-center rounded-avatar bg-warning-soft text-warning-strong">
        <Icon size={24} />
      </span>

      {max !== null && (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-3xl font-extrabold text-primary">
            {used === undefined ? max : `${used} / ${max}`}
          </span>
          <span className="text-sm text-secondary">
            {t(`limits.label.${resource}`)}
          </span>
        </div>
      )}

      <p className="text-sm text-secondary">
        {planName && max !== null
          ? t("limits.description", { plan: planName, max })
          : t("limits.descriptionGeneric")}
      </p>
      {!isOwner && (
        <p className="text-sm font-medium text-primary">
          {t("limits.ownerOnly")}
        </p>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <CusDialog
        open={open}
        onClose={onClose}
        title={title}
        footer={footer}
        size="sm"
        centered
      >
        {body}
      </CusDialog>
    );
  }

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      placement="bottom"
      title={title}
      footer={footer}
    >
      {body}
    </CusDrawer>
  );
}
