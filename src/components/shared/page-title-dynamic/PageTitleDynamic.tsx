import type { ReactNode } from "react";

interface PageTitleDynamicProps {
  /** Workspace/loyiha nomi — masalan "Synapse". */
  title: string;
  /** Tayyor formatlangan sana matni — masalan "СРЕДА - 14.09.2026". Boshqa sana tanlanganda badge (yopish tugmasi bilan) ham berilishi mumkin. */
  date: ReactNode;
  /** Berilmasa o'ng tomondagi "0/0 Выполнено" hisoblagichi chiqmaydi (sahifa uni boshqa joyda ko'rsatadi). */
  doneCount?: number;
  totalCount?: number;
  /** Masalan "Выполнено" — holat matni. */
  statusLabel?: string;
  /** O'ng yuqori burchakdagi qo'shimcha element (masalan sana rejimi toggle'i). Hisoblagich bilan birga berilmaydi. */
  action?: ReactNode;
  /** Holat rangi — default muvaffaqiyat (yashil); kechikkan/ogohlantirish holatlari uchun status token'laridan biri beriladi. */
  statusColor?: string;
}

function PageTitleDynamic({
  title,
  date,
  doneCount,
  totalCount,
  statusLabel,
  action,
  statusColor = "var(--status-success-solid, #10B981)",
}: PageTitleDynamicProps) {
  return (
    <div className="flex items-end justify-between">
      <div className="flex flex-col gap-1">
        <h1
          style={{
            color: "var(--text-primary, #334155)",
            fontSize: "var(--text-h2, 28px)",
            fontWeight: 600,
            lineHeight: "normal",
          }}
        >
          {title}
        </h1>
        <span
          style={{
            color: "var(--brand-default, #5D53E3)",
            fontSize: "var(--text-footnote, 14px)",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          {date}
        </span>
      </div>

      {action}
      {doneCount !== undefined && totalCount !== undefined && (
      <div className="flex flex-col items-end gap-1">
        <span
          style={{
            color: "var(--text-primary, #334155)",
            fontSize: "var(--text-body-lg, 18px)",
            fontWeight: 600,
            lineHeight: "normal",
          }}
        >
          {doneCount}/{totalCount}
        </span>
        <span
          style={{
            color: statusColor,
            fontSize: "var(--text-caption, 12px)",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          {statusLabel}
        </span>
      </div>
      )}
    </div>
  );
}

export default PageTitleDynamic;

// ─── Ishlatish misoli ────────────────────────────────────────────────────────
//
// <PageTitleDynamic
//   title="Synapse"
//   date="СРЕДА - 14.09.2026"
//   doneCount={1}
//   totalCount={6}
//   statusLabel="Выполнено"
// />
