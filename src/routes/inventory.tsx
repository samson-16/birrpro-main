import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — Ethiopian Economic Association" }] }),
  component: Inventory,
});

const statusTone: Record<string, string> = {
  "In stock": "bg-success/10 text-success border-success/20",
  "Low stock": "bg-warning/10 text-warning-foreground border-warning/20",
  "Out of stock": "bg-destructive/10 text-destructive border-destructive/20",
  Active: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

function Inventory() {
  const totalValue = products.reduce((s, p) => s + (p.value ?? 0), 0);
  const low = products.filter((p) => p.status === "Low stock" || p.status === "Out of stock").length;
  return (
    <AppShell>
      <PageHeader
        title="Products & Inventory"
        description="Items, stock levels, valuations and reorder alerts."
        actions={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New item</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">SKUs</div><div className="text-xl font-semibold">{products.length}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Stock value</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(totalValue)}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Low / out</div><div className="text-xl font-semibold text-warning-foreground flex items-center gap-1"><AlertTriangle className="h-4 w-4" />{low}</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Services</div><div className="text-xl font-semibold">{products.filter(p => p.type === "Service").length}</div></Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
              <th className="text-left font-medium px-5 py-2">SKU</th>
              <th className="text-left font-medium px-3 py-2">Name</th>
              <th className="text-left font-medium px-3 py-2">Type</th>
              <th className="text-right font-medium px-3 py-2">Price</th>
              <th className="text-right font-medium px-3 py-2">Qty</th>
              <th className="text-right font-medium px-3 py-2">Value</th>
              <th className="text-left font-medium px-5 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.sku} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                <td className="px-3 py-3 font-medium">{p.name}</td>
                <td className="px-3 py-3 text-muted-foreground">{p.type}</td>
                <td className="px-3 py-3 text-right tabular-nums">{fmtUSD(p.price)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{p.qty ?? "—"}</td>
                <td className="px-3 py-3 text-right tabular-nums font-medium">{p.value ? fmtUSD(p.value) : "—"}</td>
                <td className="px-5 py-3"><Badge variant="outline" className={cn("text-[10px]", statusTone[p.status])}>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
