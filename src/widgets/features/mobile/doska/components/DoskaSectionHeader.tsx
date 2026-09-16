interface DoskaSectionHeaderProps {
  /** Chapdagi tartib raqami — "01". */
  index: string;
  /** Bo'lim nomi — "ЛИЧНОЕ". */
  label: string;
  /** O'ngdagi qo'shimcha matn — "3 организации". */
  meta?: string;
}

export function DoskaSectionHeader({ index, label, meta }: DoskaSectionHeaderProps) {
  return (
    <div className="mb-2 flex items-center justify-between px-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
        {index} · {label}
      </span>
      {meta && (
        <span className="text-[11px] font-medium text-secondary">{meta}</span>
      )}
    </div>
  );
}
