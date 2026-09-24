import { LuUsers } from "react-icons/lu";

interface MembersFilterButtonProps {
  selectedCount: number;
  onClick: () => void;
}

/** FilterSectionTask trigger'i bilan bir xil ko'rinishda — xodimlar drawer'ini ochadi. */
function MembersFilterButton({ selectedCount, onClick }: MembersFilterButtonProps) {
  const isActive = selectedCount > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center rounded-full border text-sm font-medium ${
        isActive ? "border-brand bg-brand-subtle text-brand" : "border-default bg-surface text-primary"
      }`}
      style={{
        padding: "var(--space-gap-sm, 8px)",
        gap: "var(--space-gap-xs, 2px)",
      }}
    >
      <LuUsers size={16} />
      {isActive ? `Xodimlar · ${selectedCount}` : "Xodimlar"}
    </button>
  );
}

export default MembersFilterButton;
