import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, ArrowLeftRight, ShoppingCart, Receipt, Wallet, Clock,
  FolderKanban, Boxes, BarChart3, Landmark, Grid3x3, Settings,
  Building2, BookOpen, PiggyBank, Users, FolderArchive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/app/BrandLogo";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
type NavGroup = { label?: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Finance",
    items: [
      { to: "/banking", label: "Banking", icon: Building2 },
      { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
      { to: "/accounting", label: "Accounting", icon: BookOpen },
      { to: "/budgeting", label: "Budgeting", icon: PiggyBank },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/sales", label: "Sales", icon: ShoppingCart },
      { to: "/expenses", label: "Expenses", icon: Receipt },
      { to: "/crm", label: "CRM", icon: Users },
      { to: "/projects", label: "Projects", icon: FolderKanban },
      { to: "/inventory", label: "Inventory", icon: Boxes },
    ],
  },
  {
    label: "Workforce",
    items: [
      { to: "/payroll", label: "Payroll", icon: Wallet },
      { to: "/time-tracking", label: "Time Tracking", icon: Clock },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/reports", label: "Reports", icon: BarChart3 },
      { to: "/taxes", label: "Taxes", icon: Landmark },
      { to: "/documents", label: "Documents", icon: FolderArchive },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/apps", label: "Apps", icon: Grid3x3 },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="h-16 px-5 flex items-center gap-2 border-b border-sidebar-border">
        <BrandLogo size={32} />
        <div className="leading-tight">
          <div className="text-sm font-semibold">Ethiopian Economic Association</div>
          <div className="text-[11px] text-sidebar-foreground/60">Finance & Operations</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {groups.map((group, gi) => (
          <div key={gi} className="space-y-0.5">
            {group.label && (
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to as string}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <div className="text-xs font-medium">Trial: 18 days left</div>
          <div className="text-[11px] text-sidebar-foreground/60 mt-0.5">Upgrade to Plus for unlimited users.</div>
        </div>
      </div>
    </aside>
  );
}
