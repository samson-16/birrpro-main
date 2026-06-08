import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { employees, projects } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Play, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/time-tracking")({
  head: () => ({ meta: [{ title: "Time Tracking — Ethiopian Economic Association" }] }),
  component: TimeTracking,
});

const entries = [
  { who: "Jane Doe", project: "Policy Brief Series", task: "Design review", hours: 3.5, rate: 220, billable: true, date: "Jun 4", approved: true },
  { who: "Diego Alvarez", project: "Globex mobile app v2", task: "API integration", hours: 6.0, rate: 165, billable: true, date: "Jun 4", approved: true },
  { who: "Sara Kim", project: "Hooli onboarding flow", task: "User interviews", hours: 2.0, rate: 120, billable: true, date: "Jun 4", approved: false },
  { who: "Mark Lee", project: "Internal", task: "Sales calls", hours: 4.0, rate: 0, billable: false, date: "Jun 3", approved: true },
  { who: "Diego Alvarez", project: "Globex mobile app v2", task: "Bug fixes", hours: 5.0, rate: 165, billable: true, date: "Jun 3", approved: true },
];

function TimeTracking() {
  const totalHours = entries.reduce((s, e) => s + e.hours, 0);
  const billable = entries.filter((e) => e.billable).reduce((s, e) => s + e.hours * e.rate, 0);
  const pending = entries.filter((e) => !e.approved).length;
  return (
    <AppShell>
      <PageHeader
        title="Time tracking"
        description="Track hours, manage timesheets and bill clients."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Log time</Button>
            <Button size="sm" className="gap-1.5"><Play className="h-4 w-4" />Start timer</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Hours this week</div><div className="text-xl font-semibold tabular-nums">{totalHours.toFixed(1)}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Billable amount</div><div className="text-xl font-semibold tabular-nums text-success">{fmtUSD(billable)}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Pending approval</div><div className="text-xl font-semibold text-warning-foreground">{pending}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Utilization</div><div className="text-xl font-semibold">82%</div></Card>
      </div>

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries">Time entries</TabsTrigger>
          <TabsTrigger value="byperson">By person</TabsTrigger>
          <TabsTrigger value="byproject">By project</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Date</th>
                  <th className="text-left font-medium px-3 py-2">Member</th>
                  <th className="text-left font-medium px-3 py-2">Project</th>
                  <th className="text-left font-medium px-3 py-2">Task</th>
                  <th className="text-right font-medium px-3 py-2">Hours</th>
                  <th className="text-right font-medium px-3 py-2">Amount</th>
                  <th className="text-left font-medium px-5 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 text-muted-foreground tabular-nums">{e.date}</td>
                    <td className="px-3 py-3 font-medium">{e.who}</td>
                    <td className="px-3 py-3">{e.project}</td>
                    <td className="px-3 py-3 text-muted-foreground">{e.task}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{e.hours.toFixed(1)}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium">{e.billable ? fmtUSD(e.hours * e.rate) : "—"}</td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className={cn("text-[10px]", e.approved ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning-foreground border-warning/20")}>
                        {e.approved ? <><Check className="h-3 w-3 mr-1" />Approved</> : "Pending"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="byperson" className="mt-4">
          <Card className="p-5">
            <ul className="divide-y">
              {employees.slice(0, 4).map((e, i) => (
                <li key={e.id} className="py-3 grid grid-cols-4 text-sm">
                  <div className="font-medium">{e.name}</div>
                  <div className="text-muted-foreground tabular-nums">{(30 + i * 4).toFixed(1)} hrs</div>
                  <div className="text-muted-foreground">{80 + i * 3}% billable</div>
                  <div className="text-right tabular-nums font-semibold">{fmtUSD(5000 + i * 1800)}</div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="byproject" className="mt-4">
          <Card className="p-5">
            <ul className="divide-y">
              {projects.map((p, i) => (
                <li key={p.id} className="py-3 grid grid-cols-4 text-sm">
                  <div className="col-span-2 font-medium">{p.name}</div>
                  <div className="text-muted-foreground tabular-nums">{(40 + i * 12)} hrs</div>
                  <div className="text-right tabular-nums font-semibold">{fmtUSD((40 + i * 12) * 180)}</div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
