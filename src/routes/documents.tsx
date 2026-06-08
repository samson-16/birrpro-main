import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  documents as seedDocuments,
  outstandingInvoices,
  upcomingBills,
  payments,
  type DocItem,
  type LinkRef,
  type RecordType,
} from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import {
  Upload, Search, FileText, Folder, Tag, X, Paperclip, Link2, Sparkles, Filter,
  Receipt, FileCheck, CreditCard, Plus, Check, Wand2, Download, FileDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { brandHeaderLines, brandFooterLines } from "@/lib/brand";

/** Infer a document Kind from a filename. */
function inferKind(name: string): DocItem["kind"] {
  const n = name.toLowerCase();
  if (n.includes("receipt")) return "Receipt";
  if (n.includes("invoice") || n.startsWith("inv")) return "Invoice";
  if (n.includes("bill")) return "Bill";
  if (n.includes("contract") || n.includes("agreement") || n.includes("mou")) return "Contract";
  if (n.includes("tax") || n.includes("vat")) return "Tax";
  if (n.includes("statement")) return "Statement";
  return "Receipt";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function csvEscape(v: unknown) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents — Ethiopian Economic Association" }] }),
  component: Documents,
});

const kinds = ["All", "Receipt", "Invoice", "Bill", "Contract", "Tax", "Statement"] as const;
type Kind = (typeof kinds)[number];

const kindTone: Record<string, string> = {
  Receipt: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Invoice: "bg-primary/10 text-primary border-primary/20",
  Bill: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Contract: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Tax: "bg-destructive/10 text-destructive border-destructive/20",
  Statement: "bg-muted text-muted-foreground border-border",
};

const linkTone: Record<RecordType, string> = {
  invoice: "bg-primary/10 text-primary border-primary/20",
  bill: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  payment: "bg-success/10 text-success border-success/20",
  expense: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  customer: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  tax: "bg-destructive/10 text-destructive border-destructive/20",
  account: "bg-muted text-muted-foreground border-border",
};

const linkIcon: Record<RecordType, typeof Link2> = {
  invoice: FileCheck,
  bill: Receipt,
  payment: CreditCard,
  expense: Receipt,
  customer: FileText,
  tax: FileText,
  account: FileText,
};

/** Catalog of every record a document can be attached to. */
type Candidate = { type: RecordType; id: string; label: string; amount?: number; sub?: string };

const candidates: Candidate[] = [
  ...outstandingInvoices.map((i): Candidate => ({
    type: "invoice", id: i.number, label: i.number, amount: i.amount, sub: `${i.customer} · due ${i.due}`,
  })),
  ...upcomingBills.map((b): Candidate => ({
    type: "bill", id: b.id, label: b.id, amount: b.amount, sub: `${b.vendor} · due ${b.due}`,
  })),
  ...payments.map((p): Candidate => ({
    type: "payment", id: p.id, label: p.id, amount: p.amount,
    sub: `${"customer" in p ? p.customer : p.vendor} · ${p.method} · ${p.date}`,
  })),
];

function highlight(text: string, q: string) {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase()
      ? <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{p}</mark>
      : <span key={i}>{p}</span>,
  );
}

/** Auto-suggest links by exact amount + vendor/customer name overlap. */
function suggestLinks(doc: DocItem, existing: LinkRef[]): LinkRef[] {
  const have = new Set(existing.map((l) => `${l.type}:${l.id}`));
  const out: LinkRef[] = [];
  for (const c of candidates) {
    if (have.has(`${c.type}:${c.id}`)) continue;
    const amountMatch = doc.amount && c.amount && Math.abs(doc.amount - c.amount) < 0.01;
    const vendorMatch = doc.vendor && c.sub && c.sub.toLowerCase().includes(doc.vendor.toLowerCase().split(" ")[0]);
    if (amountMatch || vendorMatch) {
      out.push({ type: c.type, id: c.id, label: c.label, amount: c.amount, source: "auto" });
    }
  }
  return out.slice(0, 4);
}

function Documents() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind>("All");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // User-uploaded documents (live in browser memory only).
  const [uploaded, setUploaded] = useState<DocItem[]>([]);
  // Object URLs keyed by doc id, so Download / Open work for real uploads.
  const fileUrlsRef = useRef<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Combined seed + uploaded docs. Uploads appear first.
  const documents = useMemo<DocItem[]>(() => [...uploaded, ...seedDocuments], [uploaded]);

  // Runtime link state — seeded from each doc's legacy `linked` field.
  const [linksByDoc, setLinksByDoc] = useState<Record<string, LinkRef[]>>(() => {
    const init: Record<string, LinkRef[]> = {};
    for (const d of seedDocuments) {
      const seed: LinkRef = {
        type: d.linkedType as RecordType,
        id: d.linked,
        label: d.linked,
        amount: d.amount,
        source: "manual",
      };
      init[d.id] = [seed];
    }
    return init;
  });
  const [dismissedSugg, setDismissedSugg] = useState<Record<string, string[]>>({});
  const [attachQuery, setAttachQuery] = useState("");
  const [attachTab, setAttachTab] = useState<"invoice" | "bill" | "payment">("invoice");

  // Revoke object URLs on unmount.
  useEffect(() => {
    const urls = fileUrlsRef.current;
    return () => {
      Object.values(urls).forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const docsView = useMemo(
    () => documents.map((d) => ({ ...d, links: linksByDoc[d.id] ?? [] })),
    [documents, linksByDoc],
  );

  const allTags = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of documents) for (const t of d.tags) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [documents]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docsView.filter((d) => {
      if (kind !== "All" && d.kind !== kind) return false;
      if (activeTags.length && !activeTags.every((t) => d.tags.includes(t))) return false;
      if (!q) return true;
      const linkText = (d.links ?? []).map((l) => `${l.type} ${l.id}`).join(" ");
      const hay = [d.name, d.kind, linkText, d.vendor ?? "", d.uploadedBy, d.tags.join(" "), d.text]
        .join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [query, kind, activeTags, docsView]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const d of documents) c[d.kind] = (c[d.kind] ?? 0) + 1;
    return c;
  }, [documents]);

  const folders = [
    { name: "Receipts", count: counts.Receipt ?? 0, kind: "Receipt" as Kind },
    { name: "Invoices", count: counts.Invoice ?? 0, kind: "Invoice" as Kind },
    { name: "Bills", count: counts.Bill ?? 0, kind: "Bill" as Kind },
    { name: "Contracts", count: counts.Contract ?? 0, kind: "Contract" as Kind },
    { name: "Tax", count: counts.Tax ?? 0, kind: "Tax" as Kind },
    { name: "Statements", count: counts.Statement ?? 0, kind: "Statement" as Kind },
  ];

  const toggleTag = (t: string) =>
    setActiveTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const selected = selectedId ? docsView.find((d) => d.id === selectedId) ?? null : null;
  const selectedLinks = selected ? selected.links ?? [] : [];
  const suggestions = useMemo(() => {
    if (!selected) return [];
    const dismissed = dismissedSugg[selected.id] ?? [];
    return suggestLinks(selected, selectedLinks).filter(
      (s) => !dismissed.includes(`${s.type}:${s.id}`),
    );
  }, [selected, selectedLinks, dismissedSugg]);

  const addLink = (docId: string, ref: LinkRef) =>
    setLinksByDoc((cur) => {
      const have = cur[docId] ?? [];
      if (have.some((l) => l.type === ref.type && l.id === ref.id)) return cur;
      return { ...cur, [docId]: [...have, ref] };
    });
  const removeLink = (docId: string, ref: LinkRef) =>
    setLinksByDoc((cur) => ({
      ...cur,
      [docId]: (cur[docId] ?? []).filter((l) => !(l.type === ref.type && l.id === ref.id)),
    }));
  const dismissSuggestion = (docId: string, ref: LinkRef) =>
    setDismissedSugg((cur) => ({ ...cur, [docId]: [...(cur[docId] ?? []), `${ref.type}:${ref.id}`] }));

  const autoLinkAll = () => {
    setLinksByDoc((cur) => {
      const next = { ...cur };
      for (const d of documents) {
        const existing = next[d.id] ?? [];
        const newOnes = suggestLinks(d, existing);
        if (newOnes.length) next[d.id] = [...existing, ...newOnes];
      }
      return next;
    });
  };

  /** Upload one or more files: register an object URL and prepend a DocItem. */
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const newDocs: DocItem[] = [];
    for (const file of Array.from(files)) {
      const id = `U-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      fileUrlsRef.current[id] = URL.createObjectURL(file);
      newDocs.push({
        id,
        name: file.name,
        kind: inferKind(file.name),
        linked: "—",
        linkedType: "expense",
        size: formatSize(file.size),
        date: today,
        uploadedBy: "You",
        tags: ["uploaded"],
        text: `Uploaded ${file.name} (${file.type || "binary"}) on ${today}.`,
      });
    }
    setUploaded((cur) => [...newDocs, ...cur]);
    setLinksByDoc((cur) => {
      const next = { ...cur };
      for (const d of newDocs) next[d.id] = [];
      return next;
    });
  };

  /** Download a document — uses the uploaded file if present, else a text receipt. */
  const downloadDoc = (d: DocItem) => {
    const url = fileUrlsRef.current[d.id];
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = d.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    const lines = [
      `Document: ${d.name}`,
      `Type: ${d.kind}`,
      `Date: ${d.date}`,
      `Uploaded by: ${d.uploadedBy}`,
      d.vendor ? `Vendor: ${d.vendor}` : null,
      d.amount !== undefined ? `Amount: ${fmtUSD(d.amount)}` : null,
      `Tags: ${d.tags.join(", ")}`,
      "",
      "--- Extracted text ---",
      d.text,
    ].filter(Boolean).join("\n");
    triggerDownload(new Blob([lines], { type: "text/plain;charset=utf-8" }), `${d.name}.txt`);
  };

  /** Open a document — uses uploaded file URL if present, else opens text in a new tab. */
  const openDoc = (d: DocItem) => {
    const url = fileUrlsRef.current[d.id];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    const text = `${d.name}\n\n${d.text}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const u = URL.createObjectURL(blob);
    window.open(u, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(u), 30000);
  };

  /** Export the filtered table to CSV with a branded header block. */
  const exportCsv = () => {
    const header = ["ID", "Name", "Kind", "Date", "Uploaded by", "Vendor", "Amount (ETB)", "Tags", "Linked records"];
    const rows = filtered.map((d) => [
      d.id, d.name, d.kind, d.date, d.uploadedBy, d.vendor ?? "",
      d.amount ?? "",
      d.tags.join("|"),
      (d.links ?? []).map((l) => `${l.type}:${l.id}`).join("|"),
    ]);
    const brandBlock = brandHeaderLines("Documents export").map((l) => csvEscape(l)).join("\n");
    const csvBody = [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
    const footerBlock = brandFooterLines().map((l) => csvEscape(l)).join("\n");
    const csv = `${brandBlock}\n${csvBody}\n${footerBlock}\n`;
    const stamp = new Date().toISOString().slice(0, 10);
    triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), `EEA-documents-${stamp}.csv`);
  };


  const filteredCandidates = useMemo(() => {
    const q = attachQuery.trim().toLowerCase();
    return candidates
      .filter((c) => c.type === attachTab)
      .filter((c) => !q || `${c.label} ${c.sub ?? ""}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [attachQuery, attachTab]);

  const totalAutoLinked = Object.values(linksByDoc).flat().filter((l) => l.source === "auto").length;

  return (
    <AppShell>
      <PageHeader
        title="Documents"
        description="Full-text search across receipts, invoices, bills and contracts — auto-matched and linked to records."
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                if (e.target) e.target.value = "";
              }}
            />
            <Button variant="outline" size="sm" className="gap-1.5" onClick={autoLinkAll}>
              <Wand2 className="h-4 w-4" />Auto-link all
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={exportCsv}>
              <FileDown className="h-4 w-4" />Export CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Paperclip className="h-4 w-4" />Import from email</Button>
            <Button size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />Upload
            </Button>
          </>
        }
      />


      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
        {folders.map((f) => (
          <button
            key={f.name}
            onClick={() => setKind(kind === f.kind ? "All" : f.kind)}
            className={cn(
              "text-left rounded-xl border bg-card p-4 transition-colors",
              kind === f.kind ? "border-primary bg-primary/5" : "hover:bg-muted/40",
            )}
          >
            <div className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center mb-2",
              kind === f.kind ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
            )}>
              <Folder className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">{f.name}</div>
            <div className="text-xs text-muted-foreground">{f.count} files</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search names, vendors, amounts, contents…"
                className="pl-8 pr-8 h-9"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              {filtered.length} of {documents.length}
            </div>
            {totalAutoLinked > 0 && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] gap-1">
                <Sparkles className="h-3 w-3" />{totalAutoLinked} auto-linked
              </Badge>
            )}
            {(activeTags.length > 0 || kind !== "All") && (
              <Button
                variant="ghost" size="sm"
                onClick={() => { setActiveTags([]); setKind("All"); }}
                className="ml-auto h-8 text-xs gap-1"
              >
                <X className="h-3.5 w-3.5" />Clear filters
              </Button>
            )}
          </div>

          {activeTags.length > 0 && (
            <div className="px-4 py-2 border-b flex items-center gap-1.5 flex-wrap bg-muted/20">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground mr-1">Tags</span>
              {activeTags.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15"
                >
                  #{t}<X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
              No documents match your search.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground bg-muted/30 border-b">
                  <th className="text-left font-medium px-5 py-2">Name</th>
                  <th className="text-left font-medium px-3 py-2">Type</th>
                  <th className="text-left font-medium px-3 py-2">Linked to</th>
                  <th className="text-left font-medium px-3 py-2">Tags</th>
                  <th className="text-right font-medium px-3 py-2">Amount</th>
                  <th className="text-right font-medium px-5 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const links = d.links ?? [];
                  return (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedId(d.id)}
                      className="border-b last:border-0 hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{highlight(d.name, query)}</div>
                            {query && d.text.toLowerCase().includes(query.toLowerCase()) && (
                              <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                …{highlight(snippet(d.text, query), query)}…
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="outline" className={cn("text-[10px]", kindTone[d.kind])}>{d.kind}</Badge>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {links.slice(0, 2).map((l) => {
                            const Icon = linkIcon[l.type];
                            return (
                              <span
                                key={`${l.type}:${l.id}`}
                                className={cn("inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border", linkTone[l.type])}
                              >
                                <Icon className="h-3 w-3" />{l.id}
                              </span>
                            );
                          })}
                          {links.length > 2 && (
                            <span className="text-[10px] text-muted-foreground self-center">+{links.length - 2}</span>
                          )}
                          {links.length === 0 && (
                            <span className="text-[10px] text-muted-foreground">Unlinked</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {d.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">#{t}</span>
                          ))}
                          {d.tags.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{d.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                        {d.amount ? fmtUSD(d.amount) : "—"}
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">
                        <div className="inline-flex items-center gap-2">
                          <span>{d.date}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadDoc(d); }}
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                            title="Download"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>

        <Card className="p-4 gap-3 h-fit">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Tags</h3>
          </div>
          <p className="text-xs text-muted-foreground -mt-1">Click to filter. Combine for AND.</p>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map(([t, n]) => {
              const active = activeTags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={cn(
                    "text-[11px] px-2 py-1 rounded-full border transition-colors",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted",
                  )}
                >
                  #{t} <span className="opacity-60">{n}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-3 mt-1 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Auto-tagged from OCR & vendor history.
            </div>
          </div>
        </Card>
      </div>

      <Sheet
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) { setSelectedId(null); setAttachQuery(""); }
        }}
      >
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />{selected.name}
                </SheetTitle>
                <SheetDescription>
                  Uploaded {selected.date} by {selected.uploadedBy} · {selected.size}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 space-y-5 mt-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Type</div>
                    <Badge variant="outline" className={cn("text-[10px] mt-1", kindTone[selected.kind])}>{selected.kind}</Badge>
                  </div>
                  {selected.vendor && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Vendor</div>
                      <div className="text-sm mt-1">{selected.vendor}</div>
                    </div>
                  )}
                  {selected.amount !== undefined && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Amount</div>
                      <div className="text-sm mt-1 tabular-nums font-semibold">{fmtUSD(selected.amount)}</div>
                    </div>
                  )}
                </div>

                {/* Linked records */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Linked records · {selectedLinks.length}
                    </div>
                  </div>
                  {selectedLinks.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic">Not linked to any record yet.</div>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedLinks.map((l) => {
                        const Icon = linkIcon[l.type];
                        return (
                          <div
                            key={`${l.type}:${l.id}`}
                            className="flex items-center gap-2 p-2 rounded-lg border bg-muted/20"
                          >
                            <span className={cn("h-7 w-7 rounded-md flex items-center justify-center border", linkTone[l.type])}>
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{l.id}</div>
                              <div className="text-[11px] text-muted-foreground capitalize">
                                {l.type}{l.amount ? ` · ${fmtUSD(l.amount)}` : ""}
                              </div>
                            </div>
                            {l.source === "auto" && (
                              <Badge variant="outline" className="text-[9px] bg-success/10 text-success border-success/20 gap-0.5">
                                <Sparkles className="h-2.5 w-2.5" />auto
                              </Badge>
                            )}
                            <button
                              onClick={() => removeLink(selected.id, l)}
                              className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Unlink"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Auto suggestions */}
                {suggestions.length > 0 && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <div className="text-xs font-semibold text-primary">Suggested matches</div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-2">
                      Matched by amount and vendor. Confirm to attach.
                    </p>
                    <div className="space-y-1.5">
                      {suggestions.map((s) => {
                        const Icon = linkIcon[s.type];
                        return (
                          <div key={`${s.type}:${s.id}`} className="flex items-center gap-2 p-2 rounded-md bg-background border">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{s.id}</div>
                              <div className="text-[11px] text-muted-foreground capitalize">
                                {s.type}{s.amount ? ` · ${fmtUSD(s.amount)}` : ""}
                              </div>
                            </div>
                            <Button
                              size="sm" variant="outline"
                              className="h-7 text-[11px] gap-1"
                              onClick={() => dismissSuggestion(selected.id, s)}
                            >Dismiss</Button>
                            <Button
                              size="sm"
                              className="h-7 text-[11px] gap-1"
                              onClick={() => addLink(selected.id, { ...s, source: "auto" })}
                            >
                              <Check className="h-3 w-3" />Link
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Manual attach */}
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">
                    Attach to a record
                  </div>
                  <div className="flex gap-1 mb-2">
                    {(["invoice", "bill", "payment"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setAttachTab(t)}
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-md border capitalize",
                          attachTab === t
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted",
                        )}
                      >
                        {t}s
                      </button>
                    ))}
                  </div>
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={attachQuery}
                      onChange={(e) => setAttachQuery(e.target.value)}
                      placeholder={`Search ${attachTab}s…`}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                  <div className="rounded-lg border divide-y max-h-56 overflow-y-auto">
                    {filteredCandidates.length === 0 ? (
                      <div className="p-3 text-center text-xs text-muted-foreground">No matches.</div>
                    ) : filteredCandidates.map((c) => {
                      const Icon = linkIcon[c.type];
                      const linked = selectedLinks.some((l) => l.type === c.type && l.id === c.id);
                      return (
                        <button
                          key={`${c.type}:${c.id}`}
                          onClick={() => addLink(selected.id, { type: c.type, id: c.id, label: c.label, amount: c.amount, source: "manual" })}
                          disabled={linked}
                          className="w-full text-left flex items-center gap-2 p-2 hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{c.id}</div>
                            {c.sub && <div className="text-[11px] text-muted-foreground truncate">{c.sub}</div>}
                          </div>
                          {c.amount && <div className="text-xs tabular-nums text-muted-foreground">{fmtUSD(c.amount)}</div>}
                          {linked ? <Check className="h-3.5 w-3.5 text-success" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">
                    Extracted text (OCR)
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed text-foreground/80 max-h-40 overflow-y-auto">
                    {highlight(selected.text, query)}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 pb-4">
                  <Button size="sm" className="flex-1" onClick={() => openDoc(selected)}>Open document</Button>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => downloadDoc(selected)}>
                    <Download className="h-3.5 w-3.5" />Download
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

function snippet(text: string, q: string) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text.slice(0, 80);
  const start = Math.max(0, i - 30);
  return text.slice(start, start + 120);
}
