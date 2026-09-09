import { useState } from "react";
import { LuEye } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";

interface CusImagePreviewProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  borderRadius?: number | string;
  preview?: boolean;
}

export function CusImagePreview({
  src,
  alt = "",
  width = "100%",
  height = "100%",
  objectFit = "cover",
  objectPosition = "center",
  borderRadius = 0,
  preview = true,
}: CusImagePreviewProps) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        style={{ position: "relative", width, height, borderRadius, overflow: "hidden", flexShrink: 0 }}
        onMouseEnter={() => preview && setHovered(true)}
        onMouseLeave={() => preview && setHovered(false)}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit, objectPosition, display: "block" }}
        />

        {/* Hover overlay — faqat preview=true bo'lsa */}
        {preview && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              position: "absolute",
              inset: 0,
              border: "none",
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.15s",
            }}
          >
            <LuEye size={20} color="white" />
          </button>
        )}
      </div>

      {preview && (
        <CusDialog open={open} onClose={() => setOpen(false)} size="lg" closeOnBackdrop>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={src}
              alt={alt}
              style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 10, objectFit: "contain" }}
            />
          </div>
        </CusDialog>
      )}
    </>
  );
}

// ─── Ishlatish misoli ─────────────────────────────────────────────────────────
//
// <CusImagePreview
//   src={getFileUrl(attraction.main_file)}
//   width={200}
//   height={140}
//   objectFit="cover"
//   objectPosition="top"
//   borderRadius={10}
// />
