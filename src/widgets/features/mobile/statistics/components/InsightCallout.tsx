import { LuLightbulb } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";

interface InsightCalloutProps {
  text: string;
}

export function InsightCallout({ text }: InsightCalloutProps) {
  return (
    <CusCardbox
      style={{ borderColor: "var(--brand-subtle-bg)" }}
      className="flex items-start gap-2 rounded-card bg-brand-subtle"
    >
      <LuLightbulb size={16} className="mt-0.5 flex-none text-brand" />
      <p className="text-xs font-medium text-secondary">{text}</p>
    </CusCardbox>
  );
}
