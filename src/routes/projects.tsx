import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — Ethiopian Economic Association" }] }),
  component: Projects,
});

const statusTone: Record<string, string> = {
  "On track": "bg-success/10 text-success border-success/20",
  "At risk": "bg-warning/10 text-warning-foreground border-warning/20",
  Complete: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

function Projects() {
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalBilled = projects.reduce((s, p) => s + p.billed, 0);
  return (
    <AppShell>
      <PageHeader
        title="Projects"
        description="Track budgets, time, costs and profitability per project."
        actions={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New project</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Active projects</div><div className="text-xl font-semibold">{projects.filter(p => p.status !== "Complete").length}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Total budget</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(totalBudget)}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Billed YTD</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(totalBilled)}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Avg margin</div><div className="text-xl font-semibold text-success">42%</div></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => {
          const margin = Math.round((p.budget - p.billed * 0.6) / p.budget * 100);
          return (
            <Card key={p.id} className="p-5 gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.client} · {p.id}</div>
                </div>
                <Badge variant="outline" className={cn("text-[10px]", statusTone[p.status])}>{p.status}</Badge>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div><div className="text-[10px] text-muted-foreground">Budget</div><div className="text-sm font-semibold tabular-nums">{fmtUSD(p.budget)}</div></div>
                <div><div className="text-[10px] text-muted-foreground">Billed</div><div className="text-sm font-semibold tabular-nums">{fmtUSD(p.billed)}</div></div>
                <div><div className="text-[10px] text-muted-foreground">Margin</div><div className={cn("text-sm font-semibold", margin > 30 ? "text-success" : "text-warning-foreground")}>{margin}%</div></div>
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
