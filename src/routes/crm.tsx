import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { leads, customers } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Plus, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM — Ethiopian Economic Association" }] }),
  component: Crm,
});

const stageTone: Record<string, string> = {
  New: "bg-muted text-muted-foreground border-border",
  Qualified: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Proposal: "bg-warning/10 text-warning-foreground border-warning/20",
  Negotiation: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

function Crm() {
  return (
    <AppShell>
      <PageHeader
        title="CRM Lite"
        description="Track customers, leads, contacts and communications."
        actions={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New contact</Button>}
      />

      <Tabs defaultValue="customers">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="comms">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {customers.map((c, i) => (
              <Card key={c} className="p-4 gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {c.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c}</div>
                    <div className="text-xs text-muted-foreground">{["Net 30", "Net 14", "On receipt", "Net 7"][i % 4]} · {i + 3} invoices</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t">
                  <span className="text-muted-foreground">Open balance</span>
                  <span className="font-semibold tabular-nums">{fmtUSD([0, 12500, 9800, 15400, 4200, 0, 32100, 8400][i] ?? 0)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1"><Mail className="h-3 w-3" />Email</Button>
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1"><Phone className="h-3 w-3" />Call</Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Company</th>
                  <th className="text-left font-medium px-3 py-2">Contact</th>
                  <th className="text-left font-medium px-3 py-2">Stage</th>
                  <th className="text-left font-medium px-3 py-2">Owner</th>
                  <th className="text-right font-medium px-5 py-2">Deal value</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{l.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{l.contact}</td>
                    <td className="px-3 py-3"><Badge variant="outline" className={cn("text-[10px]", stageTone[l.stage])}>{l.stage}</Badge></td>
                    <td className="px-3 py-3 text-muted-foreground">{l.owner}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">{fmtUSD(l.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="comms" className="mt-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Recent communications</h3>
            <ul className="divide-y">
              {[
                { who: "Tina Hu", co: "Northwind Traders", subject: "Re: Proposal v3 — pricing", time: "1h ago", kind: "email" },
                { who: "Mark Lee", co: "Stark Industries", subject: "Discovery call — Pepper Potts", time: "Yesterday", kind: "call" },
                { who: "Jane Doe", co: "Umbrella Corp", subject: "Sent contract draft", time: "2d ago", kind: "email" },
              ].map((c, i) => (
                <li key={i} className="py-3 flex items-start gap-3 text-sm">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {c.kind === "call" ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{c.subject}</div>
                    <div className="text-xs text-muted-foreground">{c.who} · {c.co} · {c.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
