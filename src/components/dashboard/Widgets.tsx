import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { outstandingInvoices, bankAccounts, recentTransactions, tasks } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { ArrowUpRight, Building2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const statusTone: Record<string, string> = {
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
  Sent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Viewed: "bg-warning/10 text-warning-foreground border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
  Paid: "bg-success/10 text-success border-success/20",
};

export function OutstandingInvoices() {
  const total = outstandingInvoices.reduce((s, i) => s + i.amount, 0);
  const overdue = outstandingInvoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const pct = overdue / total * 100;
  return (
    <Card className="p-5 gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">Invoices</h3>
          <p className="text-xs text-muted-foreground">Last 365 days</p>
        </div>
        <Link to="/sales" className="text-xs text-primary inline-flex items-center gap-0.5">
          Manage <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-semibold tabular-nums">{fmtUSD(total)}</div>
            <div className="text-xs text-muted-foreground">Open ({outstandingInvoices.length})</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-destructive tabular-nums">{fmtUSD(overdue)}</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
        </div>
        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-destructive" style={{ width: `${pct}%` }} />
          <div className="absolute inset-y-0 bg-primary" style={{ left: `${pct}%`, right: 0 }} />
        </div>
      </div>
      <ul className="divide-y -mx-1">
        {outstandingInvoices.slice(0, 4).map((inv) => (
          <li key={inv.number} className="flex items-center justify-between py-2 px-1 text-sm">
            <div className="min-w-0">
              <div className="font-medium truncate">{inv.customer}</div>
              <div className="text-xs text-muted-foreground">{inv.number} · Due {inv.due}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="tabular-nums font-medium">{fmtUSD(inv.amount)}</span>
              <Badge variant="outline" className={cn("text-[10px] font-medium", statusTone[inv.status])}>{inv.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function BankBalances() {
  return (
    <Card className="p-5 gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Bank accounts</h3>
          <p className="text-xs text-muted-foreground">Updated 2 minutes ago</p>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs">Reconcile</Button>
      </div>
      <ul className="space-y-3">
        {bankAccounts.map((a) => {
          const diff = a.inBank - a.inBooks;
          return (
            <li key={a.name} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{a.name}</div>
                <div className="text-xs text-muted-foreground">····{a.last4}</div>
              </div>
              <div className="text-right">
                <div className={cn("text-sm font-semibold tabular-nums", a.balance < 0 && "text-destructive")}>
                  {fmtUSD(a.balance)}
                </div>
                {diff !== 0 && (
                  <div className="text-[10px] text-muted-foreground">In books {fmtUSD(a.inBooks)}</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function RecentTransactions() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-3">
        <div>
          <h3 className="text-sm font-semibold">Recent transactions</h3>
          <p className="text-xs text-muted-foreground">From all connected accounts</p>
        </div>
        <Link to="/transactions" className="text-xs text-primary inline-flex items-center gap-0.5">
          View all <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground border-y bg-muted/30">
            <th className="text-left font-medium px-5 py-2">Date</th>
            <th className="text-left font-medium px-3 py-2">Description</th>
            <th className="text-left font-medium px-3 py-2 hidden md:table-cell">Category</th>
            <th className="text-left font-medium px-3 py-2 hidden lg:table-cell">Account</th>
            <th className="text-right font-medium px-5 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {recentTransactions.map((t) => (
            <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-5 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{t.date}</td>
              <td className="px-3 py-3 font-medium">{t.description}</td>
              <td className="px-3 py-3 hidden md:table-cell">
                <Badge variant="outline" className="font-normal text-[10px]">{t.category}</Badge>
              </td>
              <td className="px-3 py-3 text-muted-foreground hidden lg:table-cell">{t.account}</td>
              <td className={cn(
                "px-5 py-3 text-right tabular-nums font-semibold whitespace-nowrap",
                t.type === "credit" ? "text-success" : "text-foreground",
              )}>
                {t.type === "credit" ? "+" : ""}{fmtUSD(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

const priorityTone: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  med: "bg-warning/15 text-warning-foreground",
  low: "bg-muted text-muted-foreground",
};

export function TasksWidget() {
  return (
    <Card className="p-5 gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Tasks</h3>
          <p className="text-xs text-muted-foreground">{tasks.length} to do</p>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs">View all</Button>
      </div>
      <ul className="space-y-1">
        {tasks.map((t, i) => (
          <li key={t.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/40">
            {i === 3 ? <CheckCircle2 className="h-4 w-4 text-success mt-0.5" /> : <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />}
            <div className="flex-1 min-w-0">
              <div className="text-sm">{t.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Due {t.due}</div>
            </div>
            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", priorityTone[t.priority])}>
              {t.priority}
            </span>
          </li>
        ))}
      </ul>
      <div className="pt-2 border-t">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Month progress</span>
          <span>14 / 22 done</span>
        </div>
        <Progress value={64} className="h-1.5" />
      </div>
    </Card>
  );
}
