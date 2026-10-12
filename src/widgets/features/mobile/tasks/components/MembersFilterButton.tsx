import { useTranslation } from "react-i18next";
import { LuUsers } from "react-icons/lu";

interface MembersFilterButtonProps {
  selectedCount: number;
  onClick: () => void;
  /** Faqat ikonka (tanlangan soni bilan) — tor qatorga sig'dirish uchun. */
  iconOnly?: boolean;
}

/** FilterSectionTask trigger'i bilan bir xil ko'rinishda — xodimlar drawer'ini ochadi. */
function MembersFilterButton({ selectedCount, onClick, iconOnly = false }: MembersFilterButtonProps) {
  const { t } = useTranslation();
  const isActive = selectedCount > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("tasks.membersFilter.button")}
      className={`flex items-center rounded-[12px] border text-sm font-medium ${
        isActive ? "border-brand bg-brand-subtle text-brand" : "border-default bg-surface text-primary"
      }`}
      style={{
        padding: "var(--space-gap-sm, 8px)",
        gap: "var(--space-gap-xs, 2px)",
      }}
    >
      <LuUsers size={16} />
      {iconOnly
        ? isActive && selectedCount
        : isActive
          ? t("tasks.membersFilter.buttonWithCount", { count: selectedCount })
          : t("tasks.membersFilter.button")}
    </button>
  );
}

export default MembersFilterButton;
