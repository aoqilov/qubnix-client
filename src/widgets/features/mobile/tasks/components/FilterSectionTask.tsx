import { useTranslation } from "react-i18next";
import { LuFilter } from "react-icons/lu";
import { CusMenuList, type CusMenuListItem } from "@/components/ui/menu-list/CusMenuList";

interface FilterSectionTaskProps {
  /** Chapdagi bo'lim nomi — masalan "ПО СРОКАМ". Berilmasa faqat tugma chiqadi. */
  label?: string;
  /** O'ng tugma matni — default "Фильтр". */
  filterLabel?: string;
  menulist: CusMenuListItem[];
  value?: string;
  onValueChange?: (value: string) => void;
}

function FilterSectionTask({
  label,
  filterLabel,
  menulist,
  value,
  onValueChange,
}: FilterSectionTaskProps) {
  const { t } = useTranslation();
  return (
    <div className={label ? "flex items-center justify-between" : "flex items-center"}>
      {label && (
      <span
        className="uppercase tracking-wide"
        style={{
          color: "var(--text-secondary, #64748B)",
          fontSize: "var(--text-caption, 12px)",
          fontWeight: 500,
          lineHeight: "normal",
        }}
      >
        {label}
      </span>
      )}

      <CusMenuList
        items={menulist}
        value={value}
        onValueChange={onValueChange}
        trigger={
          <button
            type="button"
            className="flex items-center rounded-full border border-default bg-surface text-sm font-medium text-primary"
            style={{
              padding: "var(--space-gap-sm, 8px)",
              gap: "var(--space-gap-xs, 2px)",
            }}
          >
            <LuFilter size={16} />
            {filterLabel ?? t("tasks.page.filter")}
          </button>
        }
      />
    </div>
  );
}

export default FilterSectionTask;

// ─── Ishlatish misoli ────────────────────────────────────────────────────────
//
// const [sort, setSort] = useState("deadline");
//
// <FilterSectionTask
//   label="ПО СРОКАМ"
//   value={sort}
//   onValueChange={setSort}
//   menulist={[
//     { value: "deadline", label: "Muddat bo'yicha" },
//     { value: "priority", label: "Muhimlik bo'yicha" },
//   ]}
// />
