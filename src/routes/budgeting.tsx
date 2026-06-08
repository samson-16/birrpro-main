import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { budgetData } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Plus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/budgeting")({
  head: () => ({ meta: [{ title: "Budgeting — Ethiopian Economic Association" }] }),
  component: Budgeting,
});

function Budgeting() {
  const totalBudget = budgetData.reduce((s, b) => s + b.budget, 0);
  const totalActual = budgetData.reduce((s, b) => s + b.actual, 0);
  const variance = totalBudget - totalActual;

  return (
    <AppShell>
      <PageHeader
        title="Budgeting & forecasting"
        description="Plan, track and forecast against your budgets."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Calendar className="h-4 w-4" />FY 2026</Button>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New budget</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Budgeted (mo)</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(totalBudget)}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Actual (mo)</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(totalActual)}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Variance</div><div className={cn("text-xl font-semibold tabular-nums", variance >= 0 ? "text-success" : "text-destructive")}>{fmtUSD(variance)}</div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold">Budget vs Actual — June</h3>
            <p className="text-xs text-muted-foreground">By category</p>
          </div>
          <div className="h-72 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="budget" name="Budget" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 gap-3">
          <h3 className="text-sm font-semibold">Variance by line</h3>
          <ul className="space-y-3">
            {budgetData.map((b) => {
              const pct = Math.min(100, (b.actual / b.budget) * 100);
              const over = b.actual > b.budget;
              return (
                <li key={b.category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{b.category}</span>
                    <span className={cn("tabular-nums text-xs", over ? "text-destructive" : "text-muted-foreground")}>
                      {fmtUSD(b.actual)} / {fmtUSD(b.budget)}
                    </span>
                  </div>
                  <Progress value={pct} className={cn("h-1.5", over && "[&>div]:bg-destructive")} />
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
