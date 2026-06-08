import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { CashflowChart } from "@/components/dashboard/CashflowChart";
import { BankBalances, OutstandingInvoices, RecentTransactions, TasksWidget } from "@/components/dashboard/Widgets";
import { AiInsights, UpcomingBills, ActivityFeed, MiniKpis } from "@/components/dashboard/MoreWidgets";
import { Button } from "@/components/ui/button";
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Ethiopian Economic Association" },
      { name: "description", content: "Your accounting overview: cash flow, invoices, expenses and bank balances." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <PageHeader
        title="Selam, Tewodros"
        description="Here's how the Ethiopian Economics Association is doing today, Saturday, June 6."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Calendar className="h-4 w-4" /> YTD 2026
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" /> Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <KpiCard label="Total income (YTD)" value={2_831_250} delta={38.2} deltaLabel="vs prior quarter" icon={TrendingUp} tone="positive" />
        <KpiCard label="Total expenses (YTD)" value={382_500} delta={6.4} deltaLabel="vs prior quarter" icon={TrendingDown} tone="neutral" />
        <KpiCard label="Change in net assets" value={2_448_750} delta={44.1} deltaLabel="vs prior quarter" icon={DollarSign} tone="positive" />
      </div>

      <div className="mb-4">
        <MiniKpis />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2"><CashflowChart /></div>
        <AiInsights />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <OutstandingInvoices />
        <UpcomingBills />
        <BankBalances />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RecentTransactions /></div>
        <div className="space-y-4">
          <TasksWidget />
          <ActivityFeed />
        </div>
      </div>
    </AppShell>
  );
}
