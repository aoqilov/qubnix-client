import { LuFile, LuDownload } from "react-icons/lu";

export interface TaskCardFile {
  id: string;
  name: string;
  sizeLabel: string;
}

interface TaskFileItemProps {
  file: TaskCardFile;
  onDownload?: (id: string) => void;
}

function TaskFileItem({ file, onDownload }: TaskFileItemProps) {
  return (
    <div className="flex items-center justify-between rounded-input border border-default bg-surface p-3">
      <div className="flex items-center gap-2">
        <LuFile size={18} className="flex-none text-secondary" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-primary">{file.name}</span>
          <span className="text-xs text-secondary">{file.sizeLabel}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDownload?.(file.id)}
        className="text-secondary transition-colors hover:text-primary"
      >
        <LuDownload size={18} />
      </button>
    </div>
  );
}

export default TaskFileItem;
