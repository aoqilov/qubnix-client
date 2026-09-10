import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "@/store/workspace.store";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusBadge } from "@/components/ui/badge/CusBadge";

export default function FeatureDoska() {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const selectWorkspace = useWorkspaceStore((s) => s.selectWorkspace);
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <CusPageTitle
        title="Qayerda ishlaymiz?"
        description="Davom etish uchun ish maydonlaridan birini tanlang"
      />
      <div className="flex flex-col gap-3">
        {workspaces.map((w) => (
          <CusCardbox
            key={w.id}
            onClick={() => {
              selectWorkspace(w.id);
              navigate("/tasks");
            }}
            className="flex cursor-pointer items-center gap-3 hover:border-vio"
          >
            <span
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ background: w.color }}
            >
              {w.initials}
            </span>
            <span className="flex-1">
              <span className="block font-medium">{w.name}</span>
              <span className="block text-xs text-neutral-500 dark:text-[var(--text-muted)]">
                {w.projectsCount} ta loyiha
              </span>
            </span>
            {w.todayCount > 0 && (
              <CusBadge colorPalette="purple" size="xs">
                {w.todayCount} bugungi
              </CusBadge>
            )}
          </CusCardbox>
        ))}
      </div>
    </div>
  );
}
