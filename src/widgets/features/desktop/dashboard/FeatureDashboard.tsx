import { SummaryCard } from "./components/SummaryCard";
import { useDashboardData } from "./hooks/useApiDashboard";

export default function FeatureDashboard() {
  const { employeesCount, projectsCount, isLoading } = useDashboardData();

  return (
    <div>
      <h1 className="mb-4 font-condensed text-lg tracking-wide">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard label="Xodimlar" value={isLoading ? "…" : employeesCount} />
        <SummaryCard label="Loyihalar" value={isLoading ? "…" : projectsCount} />
      </div>
    </div>
  );
}
