"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function TrendChart({
  data,
}: {
  data: { day: string; passed: number; failed: number }[];
}) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
          barSize={22}
        >
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="3 4"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "hsl(var(--fg-subtle))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--fg-subtle))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--surface-2))" }}
            contentStyle={{
              background: "hsl(var(--surface-3))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
              padding: "6px 10px",
            }}
            labelStyle={{ color: "hsl(var(--fg-muted))", fontSize: 11 }}
          />
          <Bar
            dataKey="passed"
            stackId="a"
            radius={[3, 3, 0, 0]}
            fill="hsl(var(--success))"
          />
          <Bar
            dataKey="failed"
            stackId="a"
            radius={[3, 3, 0, 0]}
            fill="hsl(var(--danger))"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
