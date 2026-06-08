import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { chartOfAccounts as seedCoa } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { Plus, Download, Search, Trash2, ArrowLeft, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { brandHeaderLines, brandFooterLines } from "@/lib/brand";

export const Route = createFileRoute("/accounting")({
  head: () => ({ meta: [{ title: "Accounting — Ethiopian Economic Association" }] }),
  component: Accounting,
});

const typeTone: Record<string, string> = {
  Asset: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Liability: "bg-destructive/10 text-destructive border-destructive/20",
  Equity: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Income: "bg-success/10 text-success border-success/20",
  Expense: "bg-warning/10 text-warning-foreground border-warning/20",
};

type AccountRow = (typeof seedCoa)[number];
type JELine = { accountCode: string; debit: number; credit: number };
type JEStatus = "pending" | "approved" | "rejected";
type JournalEntry = {
  id: string;
  date: string;
  memo: string;
  lines: JELine[];
  status: JEStatus;
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
};

const CURRENT_USER = "Dr. Tewodros M.";

const seedJournal: JournalEntry[] = [
  {
    id: "JE-0420",
    date: "2026-02-28",
    memo: "January staff payroll",
    lines: [
      { accountCode: "5300", debit: 240000, credit: 0 },
      { accountCode: "1010", debit: 0, credit: 240000 },
    ],
    status: "approved",
    submittedBy: "Hanna G.",
    submittedAt: "2026-02-28",
    reviewedBy: "Dr. Tewodros M.",
    reviewedAt: "2026-02-28",
  },
  {
    id: "JE-0419",
    date: "2026-02-15",
    memo: "IFPRI Ethiopia grant received — GRANT-004",
    lines: [
      { accountCode: "1010", debit: 300000, credit: 0 },
      { accountCode: "4010", debit: 0, credit: 300000 },
    ],
    status: "approved",
    submittedBy: "Hanna G.",
    submittedAt: "2026-02-15",
    reviewedBy: "Dr. Tewodros M.",
    reviewedAt: "2026-02-16",
  },
  {
    id: "JE-0418",
    date: "2026-02-05",
    memo: "Research field travel — Addis Transport",
    lines: [
      { accountCode: "5600", debit: 18000, credit: 0 },
      { accountCode: "1020", debit: 0, credit: 18000 },
    ],
    status: "approved",
    submittedBy: "Mekdes A.",
    submittedAt: "2026-02-05",
    reviewedBy: "Dr. Tewodros M.",
    reviewedAt: "2026-02-06",
  },
  {
    id: "JE-0417",
    date: "2026-02-01",
    memo: "Office stationery — Sunshine",
    lines: [
      { accountCode: "5700", debit: 7500, credit: 0 },
      { accountCode: "1000", debit: 0, credit: 7500 },
    ],
    status: "pending",
    submittedBy: "Mekdes A.",
    submittedAt: "2026-02-02",
  },
  {
    id: "JE-0416",
    date: "2026-01-25",
    memo: "Hilton Addis — conference hall",
    lines: [
      { accountCode: "5100", debit: 80000, credit: 0 },
      { accountCode: "1010", debit: 0, credit: 80000 },
    ],
    status: "pending",
    submittedBy: "Hanna G.",
    submittedAt: "2026-01-26",
  },
];

const statusTone: Record<JEStatus, string> = {
  pending: "bg-warning/10 text-warning-foreground border-warning/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

function downloadCsv(filename: string, rows: (string | number)[][], title?: string) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = brandHeaderLines(title ?? filename.replace(/\.csv$/i, "")).map(esc).join("\n");
  const body = rows.map((r) => r.map(esc).join(",")).join("\n");
  const footer = brandFooterLines().map(esc).join("\n");
  const csv = `${header}\n${body}\n${footer}\n`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.startsWith("EEA-") ? filename : `EEA-${filename}`;
  a.click();
  URL.revokeObjectURL(url);
}

function Accounting() {
  const [accounts, setAccounts] = useState<AccountRow[]>(seedCoa);
  const [journal, setJournal] = useState<JournalEntry[]>(seedJournal);
  const [tab, setTab] = useState("coa");
  const [coaSearch, setCoaSearch] = useState("");
  const [ledgerCode, setLedgerCode] = useState<string | null>(null);
  const [jeOpen, setJeOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);

  const filteredCoa = useMemo(() => {
    const q = coaSearch.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter(
      (a) => a.code.includes(q) || a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q),
    );
  }, [accounts, coaSearch]);

  const totals = useMemo(() => {
    const dr = accounts.filter((a) => a.type === "Asset" || a.type === "Expense").reduce((s, a) => s + a.balance, 0);
    const cr = accounts.filter((a) => !(a.type === "Asset" || a.type === "Expense")).reduce((s, a) => s + a.balance, 0);
    return { dr, cr };
  }, [accounts]);

  const accountByCode = (c: string) => accounts.find((a) => a.code === c);

  const ledgerRows = useMemo(() => {
    if (!ledgerCode) return [];
    const rows: { date: string; id: string; memo: string; debit: number; credit: number }[] = [];
    for (const je of journal) {
      for (const ln of je.lines) {
        if (ln.accountCode === ledgerCode) {
          rows.push({ date: je.date, id: je.id, memo: je.memo, debit: ln.debit, credit: ln.credit });
        }
      }
    }
    return rows.sort((a, b) => a.date.localeCompare(b.date));
  }, [ledgerCode, journal]);

  const openLedger = (code: string) => {
    setLedgerCode(code);
    setTab("ledger");
  };

  const exportCoa = () => {
    downloadCsv(
      "chart-of-accounts.csv",
      [["Code", "Account", "Type", "Detail", "Balance (ETB)"], ...filteredCoa.map((a) => [a.code, a.name, a.type, a.detail, a.balance])],
    );
    toast.success("Chart of accounts exported");
  };

  const exportJournal = () => {
    const rows: (string | number)[][] = [["Entry", "Date", "Memo", "Status", "Submitted by", "Reviewed by", "Account code", "Account", "Debit", "Credit"]];
    for (const je of journal) {
      for (const ln of je.lines) {
        const acc = accountByCode(ln.accountCode);
        rows.push([je.id, je.date, je.memo, je.status, je.submittedBy, je.reviewedBy ?? "", ln.accountCode, acc?.name ?? "", ln.debit, ln.credit]);
      }
    }
    downloadCsv("journal-entries.csv", rows);
    toast.success("Journal entries exported");
  };

  const exportTrial = () => {
    const rows: (string | number)[][] = [["Code", "Account", "Type", "Debit", "Credit"]];
    for (const a of accounts) {
      const isDr = a.type === "Asset" || a.type === "Expense";
      rows.push([a.code, a.name, a.type, isDr ? a.balance : 0, !isDr ? a.balance : 0]);
    }
    rows.push(["", "Totals", "", totals.dr, totals.cr]);
    downloadCsv("trial-balance.csv", rows);
    toast.success("Trial balance exported");
  };

  const exportLedger = () => {
    if (!ledgerCode) return;
    const acc = accountByCode(ledgerCode);
    downloadCsv(
      `ledger-${ledgerCode}.csv`,
      [["Date", "Entry", "Memo", "Debit", "Credit"], ...ledgerRows.map((r) => [r.date, r.id, r.memo, r.debit, r.credit])],
    );
    toast.success(`Ledger for ${acc?.name} exported`);
  };

  const handleExport = () => {
    if (tab === "coa") exportCoa();
    else if (tab === "journal") exportJournal();
    else if (tab === "approvals") exportJournal();
    else if (tab === "trial") exportTrial();
    else if (tab === "ledger") exportLedger();
    else toast.message("Nothing to export on this tab");
  };

  /** Apply balance deltas for an approved entry. */
  const applyEntryToBalances = (entry: JournalEntry) => {
    setAccounts((accs) =>
      accs.map((a) => {
        const delta = entry.lines
          .filter((l) => l.accountCode === a.code)
          .reduce((s, l) => {
            const sign = a.type === "Asset" || a.type === "Expense" ? l.debit - l.credit : l.credit - l.debit;
            return s + sign;
          }, 0);
        return delta ? { ...a, balance: a.balance + delta } : a;
      }),
    );
  };

  /** Submit a new entry for approval — does NOT affect balances. */
  const submitJournal = (entry: JournalEntry) => {
    setJournal((j) => [entry, ...j]);
  };

  const approveEntry = (id: string, note?: string) => {
    const entry = journal.find((e) => e.id === id);
    if (!entry || entry.status !== "pending") return;
    applyEntryToBalances(entry);
    setJournal((j) =>
      j.map((e) =>
        e.id === id
          ? { ...e, status: "approved", reviewedBy: CURRENT_USER, reviewedAt: new Date().toISOString().slice(0, 10), reviewNote: note }
          : e,
      ),
    );
    toast.success(`${id} approved and posted to ledger`);
  };

  const rejectEntry = (id: string, note?: string) => {
    setJournal((j) =>
      j.map((e) =>
        e.id === id && e.status === "pending"
          ? { ...e, status: "rejected", reviewedBy: CURRENT_USER, reviewedAt: new Date().toISOString().slice(0, 10), reviewNote: note }
          : e,
      ),
    );
    toast.success(`${id} rejected — balances unchanged`);
  };

  const addAccount = (acc: AccountRow) => {
    setAccounts((a) => [...a, acc].sort((x, y) => x.code.localeCompare(y.code)));
  };

  const pendingCount = journal.filter((e) => e.status === "pending").length;

  return (
    <AppShell>
      <PageHeader
        title="Accounting"
        description="Chart of accounts, journals, ledger and reconciliations."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
              <Download className="h-4 w-4" />Export
            </Button>
            <Dialog open={acctOpen} onOpenChange={setAcctOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New account</Button>
              </DialogTrigger>
              <NewAccountDialog onCreate={(a) => { addAccount(a); setAcctOpen(false); toast.success(`Account ${a.code} added`); }} existingCodes={accounts.map(a => a.code)} />
            </Dialog>
            <Dialog open={jeOpen} onOpenChange={setJeOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New journal entry</Button>
              </DialogTrigger>
              <NewJournalDialog
                accounts={accounts}
                nextId={`JE-${String(421 + journal.length - seedJournal.length).padStart(4, "0")}`}
                currentUser={CURRENT_USER}
                onSubmit={(e) => { submitJournal(e); setJeOpen(false); setTab("approvals"); toast.success(`${e.id} submitted for approval`); }}
              />
            </Dialog>
          </>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="coa">Chart of accounts</TabsTrigger>
          <TabsTrigger value="journal">Journal entries</TabsTrigger>
          <TabsTrigger value="approvals" className="gap-1.5">
            Approvals
            {pendingCount > 0 && (
              <Badge variant="outline" className={cn("text-[10px] h-4 px-1.5", statusTone.pending)}>{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ledger">General ledger</TabsTrigger>
          <TabsTrigger value="trial">Trial balance</TabsTrigger>
          <TabsTrigger value="assets">Fixed assets</TabsTrigger>
        </TabsList>

        <TabsContent value="coa" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <div className="p-3 border-b flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value={coaSearch} onChange={(e) => setCoaSearch(e.target.value)} placeholder="Search code, name or type…" className="pl-8 h-9 w-72" />
              </div>
              <div className="ml-auto text-xs text-muted-foreground">{filteredCoa.length} of {accounts.length} accounts</div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Code</th>
                  <th className="text-left font-medium px-3 py-2">Account</th>
                  <th className="text-left font-medium px-3 py-2">Type</th>
                  <th className="text-right font-medium px-3 py-2">Balance</th>
                  <th className="text-right font-medium px-5 py-2">Ledger</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoa.map((a) => (
                  <tr key={a.code} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 font-mono text-muted-foreground">{a.code}</td>
                    <td className="px-3 py-3 font-medium">{a.name}</td>
                    <td className="px-3 py-3"><Badge variant="outline" className={cn("text-[10px]", typeTone[a.type])}>{a.type}</Badge></td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">{fmtUSD(a.balance)}</td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openLedger(a.code)}>View</Button>
                    </td>
                  </tr>
                ))}
                {filteredCoa.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">No accounts match “{coaSearch}”.</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="mt-4">
          <Card className="p-3 mb-3 text-xs text-muted-foreground flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Only approved entries affect balances. Pending and rejected entries are shown for audit only.
          </Card>
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Date</th>
                  <th className="text-left font-medium px-3 py-2">Entry</th>
                  <th className="text-left font-medium px-3 py-2">Memo</th>
                  <th className="text-left font-medium px-3 py-2">Status</th>
                  <th className="text-left font-medium px-3 py-2">Account</th>
                  <th className="text-right font-medium px-3 py-2">Debit</th>
                  <th className="text-right font-medium px-5 py-2">Credit</th>
                </tr>
              </thead>
              <tbody>
                {journal.flatMap((je) =>
                  je.lines.map((ln, i) => {
                    const acc = accountByCode(ln.accountCode);
                    return (
                      <tr key={`${je.id}-${i}`} className={cn("border-b last:border-0 hover:bg-muted/30", je.status !== "approved" && "opacity-70")}>
                        <td className="px-5 py-2.5 text-muted-foreground tabular-nums whitespace-nowrap">{i === 0 ? je.date : ""}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{i === 0 ? je.id : ""}</td>
                        <td className="px-3 py-2.5">{i === 0 ? je.memo : ""}</td>
                        <td className="px-3 py-2.5">
                          {i === 0 && (
                            <Badge variant="outline" className={cn("text-[10px] capitalize", statusTone[je.status])}>{je.status}</Badge>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <button className="text-left hover:underline" onClick={() => openLedger(ln.accountCode)}>
                            <span className="font-mono text-xs text-muted-foreground mr-2">{ln.accountCode}</span>
                            {acc?.name ?? "—"}
                          </button>
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{ln.debit ? fmtUSD(ln.debit) : "—"}</td>
                        <td className="px-5 py-2.5 text-right tabular-nums">{ln.credit ? fmtUSD(ln.credit) : "—"}</td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <ApprovalsPanel
            journal={journal}
            accounts={accounts}
            currentUser={CURRENT_USER}
            onApprove={approveEntry}
            onReject={rejectEntry}
          />
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          {!ledgerCode ? (
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Select an account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {accounts.map((a) => (
                  <button key={a.code} onClick={() => setLedgerCode(a.code)} className="text-left p-3 rounded-md border hover:bg-muted/40 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">{a.code}</div>
                      <div className="font-medium text-sm">{a.name}</div>
                    </div>
                    <div className="text-right tabular-nums text-sm font-semibold">{fmtUSD(a.balance)}</div>
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b flex items-center gap-3">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setLedgerCode(null)}>
                  <ArrowLeft className="h-4 w-4" />Back
                </Button>
                <div>
                  <div className="text-xs text-muted-foreground font-mono">{ledgerCode}</div>
                  <div className="font-semibold text-sm">{accountByCode(ledgerCode)?.name}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-muted-foreground">Current balance</div>
                  <div className="font-semibold tabular-nums">{fmtUSD(accountByCode(ledgerCode)?.balance ?? 0)}</div>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                    <th className="text-left font-medium px-5 py-2">Date</th>
                    <th className="text-left font-medium px-3 py-2">Entry</th>
                    <th className="text-left font-medium px-3 py-2">Memo</th>
                    <th className="text-right font-medium px-3 py-2">Debit</th>
                    <th className="text-right font-medium px-5 py-2">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerRows.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">No journal lines posted to this account yet.</td></tr>
                  ) : ledgerRows.map((r, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-2.5 text-muted-foreground tabular-nums">{r.date}</td>
                      <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{r.id}</td>
                      <td className="px-3 py-2.5">{r.memo}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{r.debit ? fmtUSD(r.debit) : "—"}</td>
                      <td className="px-5 py-2.5 text-right tabular-nums">{r.credit ? fmtUSD(r.credit) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trial" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Account</th>
                  <th className="text-right font-medium px-3 py-2">Debit</th>
                  <th className="text-right font-medium px-5 py-2">Credit</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => {
                  const isDr = a.type === "Asset" || a.type === "Expense";
                  return (
                    <tr key={a.code} className="border-b last:border-0">
                      <td className="px-5 py-2.5"><span className="font-mono text-xs text-muted-foreground mr-2">{a.code}</span>{a.name}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{isDr ? fmtUSD(a.balance) : "—"}</td>
                      <td className="px-5 py-2.5 text-right tabular-nums">{!isDr ? fmtUSD(a.balance) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className={cn("bg-muted/50 font-semibold", totals.dr !== totals.cr && "text-destructive")}>
                  <td className="px-5 py-3">Totals {totals.dr === totals.cr ? "(balanced)" : "(out of balance)"}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{fmtUSD(totals.dr)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{fmtUSD(totals.cr)}</td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="mt-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Fixed assets</h3>
            <ul className="divide-y">
              {[
                { name: "Office Equipment — Furniture & Fixtures", cost: 180000, dep: 36000, book: 144000 },
                { name: "Laptops & IT Equipment", cost: 95000, dep: 28500, book: 66500 },
                { name: "Conference AV System", cost: 64000, dep: 19200, book: 44800 },
              ].map((a) => (
                <li key={a.name} className="py-3 grid grid-cols-4 text-sm">
                  <div className="col-span-2 font-medium">{a.name}</div>
                  <div className="text-right tabular-nums">{fmtUSD(a.cost)}<div className="text-[10px] text-muted-foreground">Cost</div></div>
                  <div className="text-right tabular-nums">{fmtUSD(a.book)}<div className="text-[10px] text-muted-foreground">Book value</div></div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

/* -------------------------------- Dialogs -------------------------------- */

function NewJournalDialog({
  accounts,
  nextId,
  currentUser,
  onSubmit,
}: {
  accounts: AccountRow[];
  nextId: string;
  currentUser: string;
  onSubmit: (e: JournalEntry) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [memo, setMemo] = useState("");
  const [lines, setLines] = useState<JELine[]>([
    { accountCode: accounts[0]?.code ?? "", debit: 0, credit: 0 },
    { accountCode: accounts[1]?.code ?? "", debit: 0, credit: 0 },
  ]);

  const totalDr = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCr = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const balanced = totalDr === totalCr && totalDr > 0;

  const update = (i: number, patch: Partial<JELine>) =>
    setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const submit = () => {
    if (!balanced) {
      toast.error("Debits and credits must balance");
      return;
    }
    if (!memo.trim()) {
      toast.error("Add a memo for this entry");
      return;
    }
    onSubmit({
      id: nextId,
      date,
      memo: memo.trim(),
      lines: lines.filter((l) => l.debit > 0 || l.credit > 0),
      status: "pending",
      submittedBy: currentUser,
      submittedAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>New journal entry — {nextId}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Memo</Label>
            <Input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Describe the entry…" />
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                <th className="text-left font-medium px-3 py-2">Account</th>
                <th className="text-right font-medium px-3 py-2 w-32">Debit</th>
                <th className="text-right font-medium px-3 py-2 w-32">Credit</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-2 py-1.5">
                    <Select value={l.accountCode} onValueChange={(v) => update(i, { accountCode: v })}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {accounts.map((a) => (
                          <SelectItem key={a.code} value={a.code}>{a.code} — {a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-2 py-1.5">
                    <Input type="number" min={0} className="h-8 text-right tabular-nums" value={l.debit || ""} onChange={(e) => update(i, { debit: Number(e.target.value) || 0, credit: 0 })} />
                  </td>
                  <td className="px-2 py-1.5">
                    <Input type="number" min={0} className="h-8 text-right tabular-nums" value={l.credit || ""} onChange={(e) => update(i, { credit: Number(e.target.value) || 0, debit: 0 })} />
                  </td>
                  <td className="px-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))} disabled={lines.length <= 2}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={cn("bg-muted/40 text-xs font-semibold", !balanced && "text-destructive")}>
                <td className="px-3 py-2 text-right">Totals</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtUSD(totalDr)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtUSD(totalCr)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setLines((ls) => [...ls, { accountCode: accounts[0]?.code ?? "", debit: 0, credit: 0 }])}>
          <Plus className="h-4 w-4" />Add line
        </Button>
      </div>
      <DialogFooter>
        <div className="text-xs text-muted-foreground mr-auto self-center">
          Entry will be queued for approval before it affects balances.
        </div>
        <Button onClick={submit} disabled={!balanced}>Submit for approval</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function NewAccountDialog({ onCreate, existingCodes }: { onCreate: (a: AccountRow) => void; existingCodes: string[] }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountRow["type"]>("Expense");
  const [detail, setDetail] = useState("");
  const [balance, setBalance] = useState(0);

  const submit = () => {
    if (!code.trim() || !name.trim()) { toast.error("Code and name are required"); return; }
    if (existingCodes.includes(code.trim())) { toast.error("Account code already exists"); return; }
    onCreate({ code: code.trim(), name: name.trim(), type, detail: detail.trim() || type, balance: Number(balance) || 0 });
  };

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New account</DialogTitle></DialogHeader>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Code</Label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6000" />
        </div>
        <div>
          <Label className="text-xs">Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as AccountRow["type"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Asset", "Liability", "Equity", "Income", "Expense"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Account name" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Detail type</Label>
          <Input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Optional detail" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Opening balance (ETB)</Label>
          <Input type="number" value={balance || ""} onChange={(e) => setBalance(Number(e.target.value) || 0)} />
        </div>
      </div>
      <DialogFooter><Button onClick={submit}>Create account</Button></DialogFooter>
    </DialogContent>
  );
}

/* ------------------------------ Approvals ------------------------------- */

function ApprovalsPanel({
  journal,
  accounts,
  currentUser,
  onApprove,
  onReject,
}: {
  journal: JournalEntry[];
  accounts: AccountRow[];
  currentUser: string;
  onApprove: (id: string, note?: string) => void;
  onReject: (id: string, note?: string) => void;
}) {
  const [filter, setFilter] = useState<JEStatus>("pending");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const accountByCode = (c: string) => accounts.find((a) => a.code === c);
  const filtered = journal.filter((e) => e.status === filter);
  const counts = {
    pending: journal.filter((e) => e.status === "pending").length,
    approved: journal.filter((e) => e.status === "approved").length,
    rejected: journal.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="space-y-3">
      <Card className="p-3 flex flex-wrap items-center gap-2">
        {(["pending", "approved", "rejected"] as JEStatus[]).map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            className="gap-1.5 capitalize"
            onClick={() => setFilter(s)}
          >
            {s} <Badge variant="outline" className="text-[10px] h-4 px-1.5">{counts[s]}</Badge>
          </Button>
        ))}
        <div className="ml-auto text-xs text-muted-foreground">
          Reviewing as <span className="font-medium text-foreground">{currentUser}</span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No {filter} entries.
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((je) => {
            const total = je.lines.reduce((s, l) => s + l.debit, 0);
            return (
              <Card key={je.id} className="p-4">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{je.id}</span>
                      <Badge variant="outline" className={cn("text-[10px] capitalize", statusTone[je.status])}>{je.status}</Badge>
                      <span className="text-xs text-muted-foreground">{je.date}</span>
                    </div>
                    <div className="font-medium mt-1">{je.memo}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Submitted by {je.submittedBy} on {je.submittedAt}
                      {je.reviewedBy && ` · Reviewed by ${je.reviewedBy} on ${je.reviewedAt}`}
                    </div>
                    {je.reviewNote && (
                      <div className="text-xs italic text-muted-foreground mt-1">Note: {je.reviewNote}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</div>
                    <div className="font-semibold tabular-nums">{fmtUSD(total)}</div>
                  </div>
                </div>

                <div className="mt-3 border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                        <th className="text-left font-medium px-3 py-1.5">Account</th>
                        <th className="text-right font-medium px-3 py-1.5 w-32">Debit</th>
                        <th className="text-right font-medium px-3 py-1.5 w-32">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {je.lines.map((ln, i) => {
                        const acc = accountByCode(ln.accountCode);
                        return (
                          <tr key={i} className="border-b last:border-0">
                            <td className="px-3 py-1.5">
                              <span className="font-mono text-xs text-muted-foreground mr-2">{ln.accountCode}</span>
                              {acc?.name ?? "—"}
                            </td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{ln.debit ? fmtUSD(ln.debit) : "—"}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{ln.credit ? fmtUSD(ln.credit) : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {je.status === "pending" && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <Input
                      placeholder="Optional review note…"
                      value={notes[je.id] ?? ""}
                      onChange={(e) => setNotes((n) => ({ ...n, [je.id]: e.target.value }))}
                      className="h-9 flex-1 min-w-[200px]"
                    />
                    {je.submittedBy === currentUser && (
                      <span className="text-[11px] text-warning-foreground">Self-submitted — second reviewer recommended</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => { onReject(je.id, notes[je.id]); setNotes((n) => { const c = { ...n }; delete c[je.id]; return c; }); }}
                    >
                      <X className="h-4 w-4" />Reject
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => { onApprove(je.id, notes[je.id]); setNotes((n) => { const c = { ...n }; delete c[je.id]; return c; }); }}
                    >
                      <Check className="h-4 w-4" />Approve &amp; post
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
