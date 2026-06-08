import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fmtUSD } from "@/lib/format";
import { FileText, Download, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/taxes")({
  head: () => ({ meta: [{ title: "Taxes — Ethiopian Economic Association" }] }),
  component: Taxes,
});

function Taxes() {
  return (
    <AppShell>
      <PageHeader
        title="Tax center"
        description="Track liabilities, file returns and access tax reports."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" />Export</Button>
            <Button size="sm" className="gap-1.5"><FileText className="h-4 w-4" />File return</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Sales tax payable</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(6840)}</div><div className="text-xs text-muted-foreground">Due Jul 15</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Payroll tax (Q2)</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(14180)}</div><div className="text-xs text-muted-foreground">Due Jul 31</div></Card>
        <Card className="p-4 gap-1"><div className="text-xs text-muted-foreground">Estimated income tax</div><div className="text-xl font-semibold tabular-nums">{fmtUSD(48230)}</div><div className="text-xs text-muted-foreground">Q2 — Jun 15</div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2 gap-3">
          <h3 className="text-sm font-semibold">Upcoming filings</h3>
          <ul className="divide-y">
            {[
              { name: "Q2 estimated income tax (Federal)", agency: "IRS", due: "Jun 15", amount: 48230, progress: 90, status: "Ready" },
              { name: "Q2 sales tax — California", agency: "CDTFA", due: "Jul 15", amount: 6840, progress: 70, status: "In progress" },
              { name: "Form 941 — Q2 payroll", agency: "IRS", due: "Jul 31", amount: 14180, progress: 45, status: "Drafting" },
              { name: "Annual VAT return (UK)", agency: "HMRC", due: "Oct 5", amount: 18420, progress: 10, status: "Not started" },
            ].map((f) => (
              <li key={f.name} className="py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.agency} · Due {f.due}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold tabular-nums">{fmtUSD(f.amount)}</div>
                    <Badge variant="outline" className={cn("text-[10px] mt-1", f.status === "Ready" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground")}>{f.status}</Badge>
                  </div>
                </div>
                <Progress value={f.progress} className="h-1.5" />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 gap-3">
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="text-xs">
              <div className="font-medium">Quarterly estimate due in 9 days</div>
              <div className="text-muted-foreground mt-0.5">File before Jun 15 to avoid penalty.</div>
            </div>
          </div>
          <h4 className="text-sm font-semibold pt-2">Tax reports</h4>
          <ul className="space-y-1.5">
            {["Sales tax liability", "Payroll tax summary", "VAT/GST return", "1099 contractor summary", "Form 1120-S draft"].map((r) => (
              <li key={r}>
                <button className="w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-muted/50 flex items-center justify-between">
                  <span>{r}</span>
                  <Download className="h-3 w-3 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
