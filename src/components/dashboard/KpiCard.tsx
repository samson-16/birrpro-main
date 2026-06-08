import { Card } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtUSD } from "@/lib/format";

export function KpiCard({
  label, value, delta, deltaLabel, icon: Icon, tone = "neutral",
}: {
  label: string; value: number; delta: number; deltaLabel: string; icon: LucideIcon;
  tone?: "positive" | "negative" | "neutral";
}) {
  const positive = delta >= 0;
  const toneClass =
    tone === "positive" ? "text-success" :
    tone === "negative" ? "text-destructive" : "text-foreground";
  return (
    <Card className="p-5 gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
          <Icon className="h-4 w-4 text-accent-foreground" />
        </div>
      </div>
      <div className={cn("text-3xl font-semibold tracking-tight tabular-nums", toneClass)}>
        {fmtUSD(value)}
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span className={cn(
          "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
          positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
        )}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="text-muted-foreground">{deltaLabel}</span>
      </div>
    </Card>
  );
}
