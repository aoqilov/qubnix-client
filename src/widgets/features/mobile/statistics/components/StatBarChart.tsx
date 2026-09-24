import { useTranslation } from "react-i18next";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { StatBarChartItem } from "../types";

interface StatBarChartProps {
  data: StatBarChartItem[];
  height?: number;
}

const MIN_LABEL_HEIGHT = 14;

function SegmentLabel(props: any) {
  const { x, y, width, height, value } = props;
  if (!value || height < MIN_LABEL_HEIGHT) return null;

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
      fill="var(--text-on-brand)"
    >
      {value}
    </text>
  );
}

function StatBarTooltip({ active, payload }: any) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const row: StatBarChartItem = payload[0].payload;

  return (
    <div
      className="rounded-input px-3 py-2 text-xs font-medium text-primary"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-dropdown)",
      }}
    >
      <p className="font-semibold text-secondary">{row.label}</p>
      <p style={{ color: "var(--brand-default)" }}>{t("statistics.chart.tooltipDone", { count: row.done })}</p>
      <p style={{ color: "var(--status-error-solid)" }}>{t("statistics.chart.tooltipNotDone", { count: row.notDone })}</p>
      <p className="text-primary">{t("statistics.chart.tooltipTotal", { count: row.total })}</p>
    </div>
  );
}

/** X o'qi yorlig'i: tepada kunning jami vazifalari, ostida kun nomi. */
function TotalTick({ x, y, payload, data }: any) {
  const row: StatBarChartItem | undefined = data[payload.index];
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        y={10}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill={row && row.total > 0 ? "var(--text-primary)" : "var(--text-disabled)"}
      >
        {row?.total ?? 0}
      </text>
      <text y={28} textAnchor="middle" fontSize={11} fill="var(--text-secondary)">
        {payload.value}
      </text>
    </g>
  );
}

function StatBarLegend() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-1.5 text-xs font-medium text-secondary">
        <span className="size-2 rounded-full bg-brand" />
        {t("statistics.chart.done")}
      </span>
      <span className="flex items-center gap-1.5 text-xs font-medium text-secondary">
        <span className="size-2 rounded-full" style={{ background: "var(--status-error-solid)" }} />
        {t("statistics.chart.notDone")}
      </span>
    </div>
  );
}

export function StatBarChart({ data, height = 190 }: StatBarChartProps) {
  return (
    <div className="flex flex-col gap-3">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barCategoryGap="16%">
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            height={36}
            interval={0}
            tick={<TotalTick data={data} />}
          />
          <Tooltip content={<StatBarTooltip />} cursor={false} />
          <Bar
            dataKey="done"
            stackId="bucket"
            radius={[0, 0, 0, 0]}
            stroke="var(--bg-surface)"
            strokeWidth={2}
            barSize={32}
            background={{ fill: "var(--bg-surface-secondary)", radius: 4 }}
          >
            <LabelList dataKey="done" content={<SegmentLabel />} />
            {data.map((bar) => (
              <Cell
                key={bar.label}
                fill={bar.muted ? "var(--bg-surface-secondary)" : "var(--brand-default)"}
                radius={(bar.notDone === 0 ? [4, 4, 0, 0] : [0, 0, 0, 0]) as unknown as number}
              />
            ))}
          </Bar>
          <Bar dataKey="notDone" stackId="bucket" radius={[4, 4, 0, 0]} stroke="var(--bg-surface)" strokeWidth={2} barSize={32}>
            <LabelList dataKey="notDone" content={<SegmentLabel />} />
            {data.map((bar) => (
              <Cell
                key={bar.label}
                fill={bar.muted ? "var(--border-subtle)" : "var(--status-error-solid)"}
                radius={[4, 4, 0, 0] as unknown as number}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <StatBarLegend />
    </div>
  );
}
