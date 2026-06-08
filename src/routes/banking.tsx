import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { bankAccounts, recentTransactions } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Plus, Search, Building2, CreditCard, RefreshCw, Link2, ShieldCheck, Sparkles, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/banking")({
  head: () => ({ meta: [{ title: "Banking — Ethiopian Economic Association" }] }),
  component: Banking,
});

function Banking() {
  return (
    <AppShell>
      <PageHeader
        title="Banking"
        description="Connect accounts, categorize transactions, and reconcile."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><RefreshCw className="h-4 w-4" />Refresh feeds</Button>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Connect account</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { l: "Total cash", v: fmtUSD(2_450_000), s: "across 3 accounts", icon: Building2 },
          { l: "To categorize", v: "12", s: "transactions", icon: Sparkles },
          { l: "To match", v: "6", s: "receipts pending", icon: Copy },
          { l: "Unreconciled", v: fmtUSD(18_000), s: "Commercial Bank of Ethiopia", icon: ShieldCheck },
        ].map((k) => (
          <Card key={k.l} className="p-4 gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{k.l}</span>
              <k.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xl font-semibold tabular-nums">{k.v}</div>
            <div className="text-xs text-muted-foreground">{k.s}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="accounts">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="feed">Transaction feed</TabsTrigger>
          <TabsTrigger value="rules">Rules engine</TabsTrigger>
          <TabsTrigger value="reconcile">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Account</th>
                  <th className="text-left font-medium px-3 py-2">Type</th>
                  <th className="text-left font-medium px-3 py-2">Last sync</th>
                  <th className="text-left font-medium px-3 py-2">Status</th>
                  <th className="text-right font-medium px-5 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {bankAccounts.map((a, i) => (
                  <tr key={a.name} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                        {i === 2 ? <CreditCard className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-xs text-muted-foreground">····{a.last4}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{i === 2 ? "Credit card" : i === 3 ? "Merchant" : "Checking"}</td>
                    <td className="px-3 py-3 text-muted-foreground">2 min ago</td>
                    <td className="px-3 py-3"><Badge variant="outline" className="bg-success/10 text-success border-success/20"><Link2 className="h-3 w-3 mr-1" />Connected</Badge></td>
                    <td className={cn("px-5 py-3 text-right tabular-nums font-semibold", a.balance < 0 && "text-destructive")}>{fmtUSD(a.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="feed" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions…" className="pl-8 h-9" />
              </div>
              <Button variant="outline" size="sm">All categories</Button>
              <Button variant="outline" size="sm">All accounts</Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Date</th>
                  <th className="text-left font-medium px-3 py-2">Description</th>
                  <th className="text-left font-medium px-3 py-2">Category</th>
                  <th className="text-left font-medium px-3 py-2">Account</th>
                  <th className="text-right font-medium px-5 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{t.date}</td>
                    <td className="px-3 py-3 font-medium">{t.description}</td>
                    <td className="px-3 py-3"><Badge variant="outline" className="font-normal text-[10px]">{t.category}</Badge></td>
                    <td className="px-3 py-3 text-muted-foreground">{t.account}</td>
                    <td className={cn("px-5 py-3 text-right tabular-nums font-semibold", t.type === "credit" ? "text-success" : "")}>
                      {t.type === "credit" ? "+" : ""}{fmtUSD(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Auto-categorization rules</h3>
                <p className="text-xs text-muted-foreground">Apply categories and tags to incoming transactions automatically.</p>
              </div>
              <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New rule</Button>
            </div>
            <ul className="divide-y">
              {[
                { name: "AWS → Software", match: "Description contains 'AWS'", actions: "Category: Software · Tag: Hosting" },
                { name: "Stripe → Income", match: "Description contains 'STRIPE'", actions: "Category: Sales · Mark as deposit" },
                { name: "WeWork → Rent", match: "Description contains 'WEWORK'", actions: "Category: Rent · Vendor: WeWork" },
                { name: "Uber/Lyft → Travel", match: "Description matches 'UBER|LYFT'", actions: "Category: Travel · Billable" },
              ].map((r) => (
                <li key={r.name} className="py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.match} → {r.actions}</div>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">Active</Badge>
                  <Button variant="ghost" size="sm">Edit</Button>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="reconcile" className="mt-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-1">Reconcile Chase Business — May 2026</h3>
            <p className="text-xs text-muted-foreground mb-4">Match your bank statement against booked transactions.</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="rounded-lg border p-4"><div className="text-xs text-muted-foreground">Statement balance</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(184320.55)}</div></div>
              <div className="rounded-lg border p-4"><div className="text-xs text-muted-foreground">Cleared in books</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(182104.20)}</div></div>
              <div className="rounded-lg border p-4"><div className="text-xs text-muted-foreground">Difference</div><div className="text-xl font-semibold tabular-nums text-destructive">{fmtUSD(2216.35)}</div></div>
            </div>
            <Button size="sm">Continue reconciliation</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
