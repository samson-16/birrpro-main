import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aiInsights, upcomingBills, activityFeed } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Sparkles, AlertTriangle, ArrowUpRight, Lightbulb, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const toneClass: Record<string, string> = {
  positive: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  neutral: "border-border bg-muted/30",
};
const iconFor: Record<string, typeof Sparkles> = {
  opportunity: Lightbulb,
  warning: AlertTriangle,
  action: Sparkles,
};

export function AiInsights() {
  return (
    <Card className="p-5 gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI insights</h3>
            <p className="text-xs text-muted-foreground">Generated 1 minute ago</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs">Refresh</Button>
      </div>
      <ul className="space-y-2">
        {aiInsights.map((i) => {
          const Icon = iconFor[i.kind] ?? Sparkles;
          return (
            <li key={i.id} className={cn("rounded-lg border p-3", toneClass[i.tone])}>
              <div className="flex items-start gap-2">
                <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{i.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{i.body}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

const billTone: Record<string, string> = {
  "Due soon": "bg-warning/10 text-warning-foreground border-warning/20",
  Scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Pending: "bg-muted text-muted-foreground border-border",
};

export function UpcomingBills() {
  const total = upcomingBills.reduce((s, b) => s + b.amount, 0);
  return (
    <Card className="p-5 gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">Upcoming bills</h3>
          <p className="text-xs text-muted-foreground">Next 14 days</p>
        </div>
        <Link to="/expenses" className="text-xs text-primary inline-flex items-center gap-0.5">
          Manage <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold tabular-nums">{fmtUSD(total)}</div>
          <div className="text-xs text-muted-foreground">{upcomingBills.length} bills</div>
        </div>
        <CalendarClock className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <ul className="divide-y -mx-1">
        {upcomingBills.map((b) => (
          <li key={b.id} className="flex items-center justify-between py-2 px-1 text-sm">
            <div className="min-w-0">
              <div className="font-medium truncate">{b.vendor}</div>
              <div className="text-xs text-muted-foreground">{b.category} · Due {b.due}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="tabular-nums font-medium">{fmtUSD(b.amount)}</span>
              <Badge variant="outline" className={cn("text-[10px]", billTone[b.status])}>{b.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function ActivityFeed() {
  return (
    <Card className="p-5 gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Activity</h3>
          <p className="text-xs text-muted-foreground">Across your team and integrations</p>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs">View all</Button>
      </div>
      <ul className="space-y-3">
        {activityFeed.map((a) => (
          <li key={a.id} className="flex items-start gap-3 text-sm">
            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-semibold text-muted-foreground">
              {a.who.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="leading-snug">
                <span className="font-medium">{a.who}</span>
                <span className="text-muted-foreground"> {a.action} </span>
                <span className="font-medium">{a.target}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function MiniKpis() {
  const kpis = [
    { l: "Cash on hand", v: "$283,170", d: "+4.2%", tone: "text-success" },
    { l: "A/R", v: "$50,650", d: "5 open", tone: "text-foreground" },
    { l: "A/P", v: "$34,004", d: "4 bills", tone: "text-foreground" },
    { l: "Runway", v: "14.2 mo", d: "+1.1 mo", tone: "text-success" },
    { l: "Burn (mo)", v: "$45,820", d: "-3.4%", tone: "text-foreground" },
    { l: "Gross margin", v: "68.4%", d: "+2.1pp", tone: "text-success" },
  ];
  return (
    <Card className="p-0 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x">
        {kpis.map((k) => (
          <div key={k.l} className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
            <div className={cn("text-lg font-semibold tabular-nums mt-1", k.tone)}>{k.v}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{k.d}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
