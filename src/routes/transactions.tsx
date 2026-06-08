import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recentTransactions } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Filter, Search, Download, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Transactions — Ethiopian Economic Association" }] }),
  component: Transactions,
});

function Transactions() {
  return (
    <AppShell>
      <PageHeader
        title="Transactions"
        description="All bank, card and merchant transactions across connected accounts."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Sparkles className="h-4 w-4" />Auto-categorize</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" />Export</Button>
          </>
        }
      />

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3 flex-wrap">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="review">For review</TabsTrigger>
              <TabsTrigger value="categorized">Categorized</TabsTrigger>
              <TabsTrigger value="excluded">Excluded</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-8 h-9 w-64" />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" />Filter</Button>
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
                <td className={cn("px-5 py-3 text-right tabular-nums font-semibold whitespace-nowrap", t.type === "credit" ? "text-success" : "")}>
                  {t.type === "credit" ? "+" : ""}{fmtUSD(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
