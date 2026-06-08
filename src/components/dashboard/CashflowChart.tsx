import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cashflowData } from "@/lib/mock-data";
import { fmtCompact, fmtUSD } from "@/lib/format";

export function CashflowChart() {
  return (
    <Card className="p-5 gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-semibold">Cash flow</h3>
          <p className="text-xs text-muted-foreground">Money in vs money out — last 12 months</p>
        </div>
        <Tabs defaultValue="12m">
          <TabsList className="h-8">
            <TabsTrigger value="30d" className="text-xs h-6">30d</TabsTrigger>
            <TabsTrigger value="3m" className="text-xs h-6">3m</TabsTrigger>
            <TabsTrigger value="12m" className="text-xs h-6">12m</TabsTrigger>
            <TabsTrigger value="ytd" className="text-xs h-6">YTD</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="h-72 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
            <YAxis tickFormatter={(v) => "$" + fmtCompact(v)} axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => fmtUSD(v)}
            />
            <Area type="monotone" dataKey="income" stroke="var(--color-primary)" strokeWidth={2} fill="url(#gIn)" name="Money in" />
            <Area type="monotone" dataKey="expenses" stroke="var(--color-chart-4)" strokeWidth={2} fill="url(#gOut)" name="Money out" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
