import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { outstandingInvoices } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Filter, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [{ title: "Sales — Ethiopian Economic Association" }] }),
  component: Sales,
});

const tone: Record<string, string> = {
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
  Sent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Viewed: "bg-warning/10 text-warning-foreground border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
};

function Sales() {
  const total = outstandingInvoices.reduce((s, i) => s + i.amount, 0);
  return (
    <AppShell>
      <PageHeader
        title="Sales"
        description="Invoices, estimates and customer payments."
        actions={
          <Button asChild size="sm" className="gap-1.5">
            <Link to="/invoices/new"><Plus className="h-4 w-4" />New invoice</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { l: "Unpaid", v: fmtUSD(total), s: "5 invoices", tone: "text-foreground" },
          { l: "Overdue", v: fmtUSD(9800), s: "1 invoice", tone: "text-destructive" },
          { l: "Paid (30d)", v: fmtUSD(48230), s: "12 invoices", tone: "text-success" },
          { l: "Deposits", v: fmtUSD(5000), s: "Pending", tone: "text-foreground" },
        ].map((k) => (
          <Card key={k.l} className="p-4 gap-1">
            <div className="text-xs text-muted-foreground">{k.l}</div>
            <div className={cn("text-xl font-semibold tabular-nums", k.tone)}>{k.v}</div>
            <div className="text-xs text-muted-foreground">{k.s}</div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 flex items-center gap-3 flex-wrap border-b">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices…" className="pl-8 h-9 w-64" />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" />Filter</Button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
              <th className="text-left font-medium px-5 py-2">Invoice</th>
              <th className="text-left font-medium px-3 py-2">Customer</th>
              <th className="text-left font-medium px-3 py-2">Due date</th>
              <th className="text-left font-medium px-3 py-2">Status</th>
              <th className="text-right font-medium px-5 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {outstandingInvoices.map((i) => (
              <tr key={i.number} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 font-medium text-primary">{i.number}</td>
                <td className="px-3 py-3">{i.customer}</td>
                <td className="px-3 py-3 text-muted-foreground tabular-nums">{i.due}</td>
                <td className="px-3 py-3"><Badge variant="outline" className={cn("text-[10px]", tone[i.status])}>{i.status}</Badge></td>
                <td className="px-5 py-3 text-right tabular-nums font-semibold">{fmtUSD(i.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
