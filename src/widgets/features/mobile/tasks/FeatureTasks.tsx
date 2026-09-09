import { Link } from "react-router-dom";
import { useTasks } from "./hooks/useApiTasks";
import { TaskListItem } from "./components/TaskListItem";

export default function FeatureTasks() {
  const { data, isLoading } = useTasks();

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1 className="font-condensed text-lg tracking-wide">Bugun</h1>
        <Link to="/tasks/create" className="text-sm text-vio">
          + Vazifa
        </Link>
      </div>
      {isLoading && <p className="px-4 text-sm text-neutral-500">Yuklanmoqda…</p>}
      {data?.items.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </div>
  );
}
