import { useState } from "react";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";

export default function FeatureStatistics() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <h1 className="mb-4 font-condensed text-lg tracking-wide">Statistika</h1>

      <CusButton colorPalette="purple" onClick={() => setOpen(true)}>
        Batafsil statistika
      </CusButton>

      <CusDrawer
        open={open}
        onClose={() => setOpen(false)}
        placement="end"
        size="full"
        closeOnBackdrop={false}
        closeOnEscape={false}
        title="Batafsil statistika"
      >
        <p className="text-sm text-neutral-500 dark:text-[var(--text-muted)]">
          {/* TODO: statistika tarkibi */}
        </p>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
        <h1>111111111</h1>
      </CusDrawer>
    </div>
  );
}
