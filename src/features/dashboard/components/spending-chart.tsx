"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface SpendingChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  currency: string;
}

function ChartTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number } }>;
  currency: string;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{item.name}</p>
      <p className="text-muted-foreground">
        {formatCurrency(item.value, currency)}
      </p>
    </div>
  );
}

export function SpendingChart({ data, currency }: SpendingChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-base">Spending by category</CardTitle>
        <p className="text-sm text-muted-foreground">This month</p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            No expenses recorded this month.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<ChartTooltip currency={currency} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {data.map((item) => {
                const percent =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatCurrency(item.value, currency)} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
