import { CusImagePreview } from "@/components/ui/image/CusImagePreview";

export interface TaskCardPhoto {
  id: string;
  url: string;
}

interface TaskPhotoGridProps {
  photos: TaskCardPhoto[];
}

const BOX_SIZE = 48;

function TaskPhotoGrid({ photos }: TaskPhotoGridProps) {
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
          <CusImagePreview
            src={photo.url}
            gallery={photos.map((p) => p.url)}
            width={BOX_SIZE}
            height={BOX_SIZE}
            borderRadius={8}
          />
        </div>
      ))}
    </div>
  );
}

export default TaskPhotoGrid;
