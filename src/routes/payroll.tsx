import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { employees } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Play, Plus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/payroll")({
  head: () => ({ meta: [{ title: "Payroll — Ethiopian Economic Association" }] }),
  component: Payroll,
});

function Payroll() {
  const totalAnnual = employees.reduce((s, e) => s + e.salary, 0);
  return (
    <AppShell>
      <PageHeader
        title="Payroll"
        description="Run payroll, manage employees, benefits and tax filings."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Add employee</Button>
            <Button size="sm" className="gap-1.5"><Play className="h-4 w-4" />Run payroll</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Next pay run</div><div className="text-xl font-semibold">Jun 15</div><div className="text-xs text-muted-foreground">9 days</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Estimated</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(56720)}</div><div className="text-xs text-muted-foreground">Gross</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Employees</div><div className="text-xl font-semibold">{employees.length}</div><div className="text-xs text-muted-foreground">{employees.filter(e => e.status === "Active").length} active</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Annual payroll</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(totalAnnual)}</div><div className="text-xs text-muted-foreground">Base salaries</div></Card>
      </div>

      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="runs">Pay runs</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Name</th>
                  <th className="text-left font-medium px-3 py-2">Role</th>
                  <th className="text-left font-medium px-3 py-2">Payment</th>
                  <th className="text-left font-medium px-3 py-2">Status</th>
                  <th className="text-right font-medium px-5 py-2">Annual salary</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                        {e.name.split(" ").map((w) => w[0]).join("")}
                      </div>
                      <span className="font-medium">{e.name}</span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{e.role}</td>
                    <td className="px-3 py-3 text-muted-foreground">{e.method}</td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className={cn("text-[10px]", e.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning-foreground border-warning/20")}>
                        {e.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">{fmtUSD(e.salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="runs" className="mt-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Recent pay runs</h3>
            <ul className="divide-y">
              {[
                { date: "May 31, 2026", gross: 56720, tax: 14180, net: 42540, status: "Paid" },
                { date: "Apr 30, 2026", gross: 56720, tax: 14180, net: 42540, status: "Paid" },
                { date: "Mar 31, 2026", gross: 54200, tax: 13550, net: 40650, status: "Paid" },
              ].map((r) => (
                <li key={r.date} className="py-3 grid grid-cols-5 text-sm">
                  <div className="font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{r.date}</div>
                  <div className="text-right tabular-nums">{fmtUSD(r.gross)}<div className="text-[10px] text-muted-foreground">Gross</div></div>
                  <div className="text-right tabular-nums">{fmtUSD(r.tax)}<div className="text-[10px] text-muted-foreground">Tax</div></div>
                  <div className="text-right tabular-nums font-semibold">{fmtUSD(r.net)}<div className="text-[10px] text-muted-foreground">Net</div></div>
                  <div className="text-right"><Badge variant="outline" className="bg-success/10 text-success border-success/20">{r.status}</Badge></div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: "Medical — Blue Shield Gold", enrolled: 5, cost: 8400 },
              { name: "401(k) match", enrolled: 4, cost: 3200 },
              { name: "Commuter benefits", enrolled: 3, cost: 540 },
            ].map((b) => (
              <Card key={b.name} className="p-4 gap-1">
                <div className="font-medium text-sm">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.enrolled} enrolled</div>
                <div className="text-lg font-semibold tabular-nums mt-1">{fmtUSD(b.cost)}/mo</div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leave" className="mt-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Leave balances</h3>
            <ul className="divide-y">
              {employees.map((e) => (
                <li key={e.id} className="py-2 grid grid-cols-4 text-sm">
                  <div className="font-medium">{e.name}</div>
                  <div className="text-muted-foreground">PTO: {18 - (e.id.charCodeAt(2) % 6)} days</div>
                  <div className="text-muted-foreground">Sick: 8 days</div>
                  <div className="text-right text-muted-foreground">{e.status === "On leave" ? "On leave until Jul 1" : "Available"}</div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
