import { LuPlus } from "react-icons/lu";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";

export interface TaskCardPhoto {
  id: string;
  url: string;
}

interface TaskPhotoGridProps {
  photos: TaskCardPhoto[];
  onAdd?: () => void;
}

const BOX_SIZE = 48;

function TaskPhotoGrid({ photos, onAdd }: TaskPhotoGridProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {photos.map((photo) => (
        <div
          key={photo.id}
          style={{
            width: BOX_SIZE,
            height: BOX_SIZE,
            flexShrink: 0,
            borderRadius: "var(--radius-input, 8px)",
            background: "var(--bg-canvas, #F8FAFC)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <CusImagePreview src={photo.url} width={BOX_SIZE} height={BOX_SIZE} borderRadius={8} />
        </div>
      ))}

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          style={{
            width: BOX_SIZE,
            height: BOX_SIZE,
            flexShrink: 0,
            borderRadius: "var(--radius-input, 8px)",
            border: "1.5px dashed var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--brand-default)",
          }}
        >
          <LuPlus size={18} />
        </button>
      )}
    </div>
  );
}

export default TaskPhotoGrid;
