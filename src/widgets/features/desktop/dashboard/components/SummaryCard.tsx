interface SummaryCardProps {
  label: string;
  value: number | string;
}

export function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="border border-neutral-300 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
