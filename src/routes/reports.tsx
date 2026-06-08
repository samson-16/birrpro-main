import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cashflowData, expenseCategories } from "@/lib/mock-data";
import { fmtCompact, fmtUSD } from "@/lib/format";
import { Calendar, ChevronRight, Download, FileText, Search, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { BrandLogo } from "@/components/app/BrandLogo";
import { useBrand } from "@/lib/brand-store";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Ethiopian Economic Association" }] }),
  component: Reports,
});

const categories = [
  { name: "Favorites", items: ["Profit and Loss", "Balance Sheet", "Cash Flow"] },
  { name: "Business overview", items: ["Profit and Loss", "Balance Sheet", "Statement of Cash Flows", "Audit Log"] },
  { name: "Who owes you", items: ["Accounts Receivable Aging", "Invoice List", "Open Invoices", "Customer Balance Summary"] },
  { name: "Sales and customers", items: ["Sales by Customer", "Sales by Product", "Income by Customer"] },
  { name: "What you owe", items: ["Accounts Payable Aging", "Bill Payment List", "Unpaid Bills"] },
  { name: "Expenses and vendors", items: ["Expenses by Vendor", "Purchases by Product", "Vendor Balance"] },
  { name: "Payroll", items: ["Payroll Summary", "Payroll Details", "Tax Liability"] },
  { name: "Taxes", items: ["Sales Tax Liability", "Tax Summary"] },
];

function Reports() {
  const brand = useBrand();
  const [active, setActive] = useState("Profit and Loss");

  return (
    <AppShell>
      <PageHeader
        title="Reports"
        description="Build, customize and export financial reports."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" />Excel</Button>
            <Button size="sm" className="gap-1.5" onClick={() => window.print()}><FileText className="h-4 w-4" />Export PDF</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <Card className="p-3 gap-1 h-fit">
          <div className="relative px-2 pt-1 pb-2">
            <Search className="h-3.5 w-3.5 absolute left-4 top-3 text-muted-foreground" />
            <Input placeholder="Find a report" className="pl-8 h-8 text-sm" />
          </div>
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{cat.name}</div>
              <ul>
                {cat.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => setActive(item)}
                      className={cn(
                        "w-full text-left text-sm px-3 py-1.5 rounded-md flex items-center gap-2 group",
                        active === item ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted",
                      )}
                    >
                      {cat.name === "Favorites" && <Star className="h-3 w-3 fill-warning text-warning" />}
                      <span className="flex-1 truncate">{item}</span>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-50" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card>

        <div className="space-y-4 min-w-0">
          <Card className="p-4 gap-3">
            <div className="flex items-end justify-between flex-wrap gap-3">
              <div className="flex items-start gap-3">
                <BrandLogo size={40} />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{brand.name}</div>
                  <h2 className="text-xl font-semibold">{active}</h2>
                  <div className="text-xs text-muted-foreground">January 1 – June 6, 2026  ·  TIN {BRAND.tin}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-1">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Report period</label>
                <Select defaultValue="ytd">
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This month</SelectItem>
                    <SelectItem value="quarter">This quarter</SelectItem>
                    <SelectItem value="ytd">Year to date</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">From</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue="2026-01-01" className="h-9 pl-8" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">To</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue="2026-06-06" className="h-9 pl-8" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Compare with</label>
                <Select defaultValue="prev">
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="prev">Previous period</SelectItem>
                    <SelectItem value="year">Previous year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 p-5 gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Income vs Expenses</h3>
                  <p className="text-xs text-muted-foreground">Monthly breakdown</p>
                </div>
                <Tabs defaultValue="bar"><TabsList className="h-8"><TabsTrigger value="bar" className="text-xs h-6">Bar</TabsTrigger><TabsTrigger value="line" className="text-xs h-6">Line</TabsTrigger></TabsList></Tabs>
              </div>
              <div className="h-72 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => "$" + fmtCompact(v)} axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => fmtUSD(v)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="income" fill="var(--color-primary)" radius={[4,4,0,0]} name="Income" />
                    <Bar dataKey="expenses" fill="var(--color-chart-4)" radius={[4,4,0,0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5 gap-3">
              <div>
                <h3 className="text-sm font-semibold">Expenses by category</h3>
                <p className="text-xs text-muted-foreground">Current period</p>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseCategories} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                      {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => fmtUSD(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-1.5">
                {expenseCategories.map((e) => (
                  <li key={e.name} className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                      {e.name}
                    </span>
                    <span className="tabular-nums font-medium">{fmtUSD(e.value)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="p-5 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Profit & Loss summary</h3>
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Up 18.7% vs previous period</p>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y bg-muted/30 text-xs text-muted-foreground">
                  <th className="text-left font-medium px-5 py-2">Account</th>
                  <th className="text-right font-medium px-5 py-2">Jan–Jun 2026</th>
                  <th className="text-right font-medium px-5 py-2">Jan–Jun 2025</th>
                  <th className="text-right font-medium px-5 py-2">% change</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Total income", a: 428540, b: 362180, bold: true },
                  { label: "  Services", a: 312400, b: 261200 },
                  { label: "  Product sales", a: 116140, b: 100980 },
                  { label: "Total expenses", a: -186220, b: -174320, bold: true },
                  { label: "  Payroll", a: -118400, b: -110200 },
                  { label: "  Software & subscriptions", a: -32820, b: -28100 },
                  { label: "  Rent & utilities", a: -22400, b: -22400 },
                  { label: "  Travel", a: -12600, b: -13620 },
                  { label: "Net profit", a: 242320, b: 187860, bold: true, accent: true },
                ].map((r, i) => (
                  <tr key={i} className={cn("border-b last:border-0", r.bold && "bg-muted/20 font-semibold", r.accent && "bg-accent/40 text-accent-foreground")}>
                    <td className="px-5 py-2.5 whitespace-pre">{r.label}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">{fmtUSD(r.a)}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums text-muted-foreground">{fmtUSD(r.b)}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">
                      <span className={cn(r.a - r.b >= 0 ? "text-success" : "text-destructive")}>
                        {(((r.a - r.b) / Math.abs(r.b)) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="text-[11px] text-muted-foreground text-center border-t pt-3 px-4">
            {brand.name} · {BRAND.address.city}, {BRAND.address.country} · TIN {BRAND.tin}
            <br />
            {BRAND.email} · {BRAND.phone} · {BRAND.website}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
