import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { vendors, upcomingBills, expenseCategories } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Plus, Upload, Camera, Car } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";

export const Route = createFileRoute("/expenses")({
  head: () => ({ meta: [{ title: "Expenses — Ethiopian Economic Association" }] }),
  component: Expenses,
});

function Expenses() {
  return (
    <AppShell>
      <PageHeader
        title="Expenses"
        description="Vendors, bills, purchase orders and receipts."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Camera className="h-4 w-4" />Scan receipt</Button>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New bill</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { l: "Unpaid bills", v: fmtUSD(135000), s: "4 bills" },
          { l: "Due this week", v: fmtUSD(92000), s: "2 bills" },
          { l: "Paid (30d)", v: fmtUSD(142500), s: "6 bills" },
          { l: "Vendors", v: "5", s: "5 active" },
        ].map((k) => (
          <Card key={k.l} className="p-4 gap-1">
            <div className="text-xs text-muted-foreground">{k.l}</div>
            <div className="text-xl font-semibold tabular-nums">{k.v}</div>
            <div className="text-xs text-muted-foreground">{k.s}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bills">
        <TabsList>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="po">Purchase orders</TabsTrigger>
          <TabsTrigger value="mileage">Mileage</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-0 overflow-hidden lg:col-span-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                    <th className="text-left font-medium px-5 py-2">Bill</th>
                    <th className="text-left font-medium px-3 py-2">Vendor</th>
                    <th className="text-left font-medium px-3 py-2">Due</th>
                    <th className="text-left font-medium px-3 py-2">Status</th>
                    <th className="text-right font-medium px-5 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBills.map((b) => (
                    <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-mono text-xs text-primary">{b.id}</td>
                      <td className="px-3 py-3 font-medium">{b.vendor}</td>
                      <td className="px-3 py-3 text-muted-foreground tabular-nums">{b.due}</td>
                      <td className="px-3 py-3"><Badge variant="outline" className="text-[10px]">{b.status}</Badge></td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold">{fmtUSD(b.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card className="p-5 gap-3">
              <h3 className="text-sm font-semibold">Spend by category</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseCategories} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {expenseCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-1.5">
                {expenseCategories.map((c) => (
                  <li key={c.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.name}</span>
                    <span className="tabular-nums font-medium">{fmtUSD(c.value)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Vendor</th>
                  <th className="text-left font-medium px-3 py-2">Category</th>
                  <th className="text-left font-medium px-3 py-2">Terms</th>
                  <th className="text-right font-medium px-3 py-2">YTD spend</th>
                  <th className="text-right font-medium px-5 py-2">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{v.name}</td>
                    <td className="px-3 py-3"><Badge variant="outline" className="text-[10px]">{v.category}</Badge></td>
                    <td className="px-3 py-3 text-muted-foreground">{v.terms}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtUSD(v.ytd)}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">{v.outstanding > 0 ? fmtUSD(v.outstanding) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="po" className="mt-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Purchase orders</h3>
              <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New PO</Button>
            </div>
            <ul className="divide-y">
              {[
                { id: "PO-0042", vendor: "Widget Supply Co.", total: 4820, status: "Open" },
                { id: "PO-0041", vendor: "Office Depot", total: 1240, status: "Received" },
                { id: "PO-0040", vendor: "Anthropic", total: 12000, status: "Approved" },
              ].map((p) => (
                <li key={p.id} className="py-3 grid grid-cols-4 text-sm">
                  <div className="font-mono text-xs text-primary">{p.id}</div>
                  <div className="col-span-2 font-medium">{p.vendor}</div>
                  <div className="text-right tabular-nums font-semibold">{fmtUSD(p.total)}</div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="mileage" className="mt-4">
          <Card className="p-5 gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Mileage tracker</h3>
                <p className="text-xs text-muted-foreground">IRS rate: $0.67/mi · 1,240 mi YTD</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5"><Car className="h-4 w-4" />Log trip</Button>
            </div>
            <ul className="divide-y">
              {[
                { date: "Jun 4", from: "Office", to: "Field Office", miles: 28, deduct: 18.76 },
                { date: "Jun 2", from: "Office", to: "SFO", miles: 22, deduct: 14.74 },
                { date: "May 28", from: "Home", to: "Conference center", miles: 41, deduct: 27.47 },
              ].map((m, i) => (
                <li key={i} className="py-3 grid grid-cols-5 text-sm">
                  <div className="text-muted-foreground">{m.date}</div>
                  <div className="col-span-2">{m.from} → {m.to}</div>
                  <div className="text-right tabular-nums">{m.miles} mi</div>
                  <div className="text-right tabular-nums font-semibold">{fmtUSD(m.deduct)}</div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="mt-4">
          <Card className="p-12 text-center gap-3">
            <Upload className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <div>
              <div className="font-medium">Drop receipts here</div>
              <div className="text-sm text-muted-foreground">Or email them to receipts@acme.ledgerly.app — we'll auto-match.</div>
            </div>
            <Button size="sm" className="mx-auto gap-1.5"><Upload className="h-4 w-4" />Upload</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
