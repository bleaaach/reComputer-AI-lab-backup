"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { BenchmarkPoint } from "@/lib/types";

const COLORS = ["#76b900", "#8fd11e", "#5a8f00", "#9ccc65"];

interface BenchmarkChartProps {
  data: BenchmarkPoint[];
  /** Optional unit for axis/tooltip when all points share the same unit */
  unit?: string;
}

export default function BenchmarkChart({ data, unit }: BenchmarkChartProps) {
  const chartData = data.map((d) => ({
    name: d.device,
    value: d.value,
    unit: d.unit ?? unit ?? "",
  }));

  const suffix = unit ?? (chartData[0]?.unit ?? "");

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
        >
          <XAxis
            type="number"
            allowDecimals={false}
            tickFormatter={(v) => String(v)}
          />
          <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, _: unknown, props: { payload?: { unit?: string } }) =>
              [`${value} ${props.payload?.unit ?? suffix ?? ""}`.trim(), "Value"]
            }
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: "right" }}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
