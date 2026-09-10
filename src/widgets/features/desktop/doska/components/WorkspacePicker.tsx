import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "@/store/workspace.store";

export function WorkspacePicker() {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const selectWorkspace = useWorkspaceStore((s) => s.selectWorkspace);
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="mb-1 font-condensed text-lg tracking-wide">Ish tolini tanlang</h1>
      <p className="mb-4 text-sm text-neutral-500 dark:text-[var(--text-muted)]">
        Davom etish uchun workspace'lardan birini tanlang
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {workspaces.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              selectWorkspace(w.id);
              navigate("/tasks");
            }}
            className="flex flex-col items-start gap-3 border border-neutral-300 bg-white p-4 text-left hover:border-vio dark:border-white/10 dark:bg-[var(--bg-second)]"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ background: w.color }}
            >
              {w.initials}
            </span>
            <span className="font-medium">{w.name}</span>
            <span className="text-xs text-neutral-500 dark:text-[var(--text-muted)]">
              {w.projectsCount} ta loyiha
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
