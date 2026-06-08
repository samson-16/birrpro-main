import { useNavigate } from "@tanstack/react-router";
import { Search, Plus, Bell, HelpCircle, Settings2, FileText, Receipt, Users, Wallet, ArrowLeftRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const notifications = [
  { id: 1, title: "Invoice INV-2026-002 is overdue (IFPRI Ethiopia)", time: "2h ago", unread: true },
  { id: 2, title: "Grant received from World Bank Ethiopia — GRANT-001", time: "5h ago", unread: true },
  { id: 3, title: "Bank feed connected: Commercial Bank of Ethiopia", time: "Yesterday", unread: false },
  { id: 4, title: "Q1 VAT return due in 39 days", time: "2 days ago", unread: false },
];

export function TopHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-16 shrink-0 border-b bg-background flex items-center gap-3 px-4 md:px-6">
      <div className="flex-1 max-w-xl relative">
        <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search transactions, customers, invoices…"
          className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:bg-background"
        />
        <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground border rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 h-9">
              <Plus className="h-4 w-4" /> New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Customers</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate({ to: "/invoices/new" })}>
              <FileText className="h-4 w-4" /> Invoice
            </DropdownMenuItem>
            <DropdownMenuItem><Receipt className="h-4 w-4" /> Receive payment</DropdownMenuItem>
            <DropdownMenuItem><Users className="h-4 w-4" /> Customer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Vendors</DropdownMenuLabel>
            <DropdownMenuItem><Receipt className="h-4 w-4" /> Expense</DropdownMenuItem>
            <DropdownMenuItem><Wallet className="h-4 w-4" /> Bill</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Other</DropdownMenuLabel>
            <DropdownMenuItem><ArrowLeftRight className="h-4 w-4" /> Bank transfer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <HelpCircle className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-sm font-semibold">Notifications</div>
              <button className="text-xs text-primary inline-flex items-center gap-1">
                <Check className="h-3 w-3" /> Mark all read
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className="px-4 py-3 border-b last:border-0 hover:bg-muted/40">
                  <div className="flex items-start gap-2">
                    {n.unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                    <div className="min-w-0">
                      <div className="text-sm">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{n.time}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 ml-1 rounded-full pl-1 pr-3 py-1 hover:bg-muted">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">TM</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left leading-tight">
                <div className="text-xs font-medium">Dr. Tewodros M.</div>
                <div className="text-[10px] text-muted-foreground">Executive Director</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">Dr. Tewodros Makonnen</div>
              <div className="text-xs text-muted-foreground font-normal">tewodros@eea.org.et</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Company settings</DropdownMenuItem>
            <DropdownMenuItem>Subscriptions <Badge variant="secondary" className="ml-auto">Plus</Badge></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
