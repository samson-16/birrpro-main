import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { customers } from "@/lib/mock-data";
import { fmtUSD } from "@/lib/format";
import { BRAND } from "@/lib/brand";
import { BrandLogo } from "@/components/app/BrandLogo";
import { useBrand } from "@/lib/brand-store";
import { ArrowLeft, Eye, Paperclip, Plus, Save, Send, Trash2, Upload, Printer } from "lucide-react";

export const Route = createFileRoute("/invoices/new")({
  head: () => ({ meta: [{ title: "New invoice — Ethiopian Economic Association" }] }),
  component: NewInvoice,
});

type Line = { id: number; item: string; description: string; qty: number; rate: number; taxable: boolean };

function NewInvoice() {
  const brand = useBrand();
  const [customer, setCustomer] = useState<string>("World Bank Ethiopia");
  const [taxRate, setTaxRate] = useState(8.875);
  const [lines, setLines] = useState<Line[]>([
    { id: 1, item: "Design sprint", description: "2-week product design sprint — discovery & prototyping", qty: 1, rate: 8500, taxable: true },
    { id: 2, item: "Implementation", description: "Frontend implementation (40 hrs @ $150/hr)", qty: 40, rate: 150, taxable: true },
    { id: 3, item: "Hosting setup", description: "Cloud hosting configuration", qty: 1, rate: 500, taxable: false },
  ]);
  const [files, setFiles] = useState<string[]>(["EEA-statement-of-work.pdf"]);
  const [payments] = useState([
    { date: "2026-05-22", method: "ACH", amount: 5000, ref: "PMT-2204" },
  ]);

  const { subtotal, taxableSub, tax, total, balance } = useMemo(() => {
    const sub = lines.reduce((s, l) => s + l.qty * l.rate, 0);
    const taxSub = lines.filter(l => l.taxable).reduce((s, l) => s + l.qty * l.rate, 0);
    const t = taxSub * (taxRate / 100);
    const tot = sub + t;
    const paid = payments.reduce((s, p) => s + p.amount, 0);
    return { subtotal: sub, taxableSub: taxSub, tax: t, total: tot, balance: tot - paid };
  }, [lines, taxRate, payments]);

  const addLine = () => setLines((ls) => [...ls, { id: Date.now(), item: "", description: "", qty: 1, rate: 0, taxable: true }]);
  const updateLine = (id: number, patch: Partial<Line>) => setLines((ls) => ls.map(l => l.id === id ? { ...l, ...patch } : l));
  const removeLine = (id: number) => setLines((ls) => ls.filter(l => l.id !== id));

  return (
    <AppShell>
      <PageHeader
        title="New invoice"
        description="Draft · INV-1032"
        actions={
          <>
            <Button variant="ghost" size="sm" asChild><Link to="/sales"><ArrowLeft className="h-4 w-4" /> Back</Link></Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}><Printer className="h-4 w-4" />Print / PDF</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Eye className="h-4 w-4" />Preview PDF</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Save className="h-4 w-4" />Save draft</Button>
            <Button size="sm" className="gap-1.5"><Send className="h-4 w-4" />Save and send</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4 min-w-0">
          <Card className="p-5 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label>Customer</Label>
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {customers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">billing@{customer.toLowerCase().replace(/[^a-z]/g, "")}.com</p>
              </div>
              <div className="space-y-1.5">
                <Label>Terms</Label>
                <Select defaultValue="net30">
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due">Due on receipt</SelectItem>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Invoice date</Label>
                <Input type="date" defaultValue="2026-06-06" className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label>Due date</Label>
                <Input type="date" defaultValue="2026-07-06" className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label>Invoice #</Label>
                <Input defaultValue="INV-1032" className="h-10" />
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b flex items-center justify-between bg-muted/30">
              <h3 className="text-sm font-semibold">Line items</h3>
              <Button onClick={addLine} variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Add line</Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="text-left font-medium px-3 py-2 w-8">#</th>
                  <th className="text-left font-medium px-3 py-2">Product / Service</th>
                  <th className="text-right font-medium px-3 py-2 w-20">Qty</th>
                  <th className="text-right font-medium px-3 py-2 w-28">Rate</th>
                  <th className="text-center font-medium px-3 py-2 w-16">Tax</th>
                  <th className="text-right font-medium px-3 py-2 w-32">Amount</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={l.id} className="border-b last:border-0 align-top">
                    <td className="px-3 py-2 text-muted-foreground tabular-nums pt-3.5">{i + 1}</td>
                    <td className="px-3 py-2">
                      <Input value={l.item} onChange={(e) => updateLine(l.id, { item: e.target.value })} placeholder="Item" className="h-8 mb-1 border-transparent hover:border-input focus:border-input" />
                      <Textarea value={l.description} onChange={(e) => updateLine(l.id, { description: e.target.value })} placeholder="Description" className="min-h-0 h-7 text-xs resize-none border-transparent hover:border-input focus:border-input" />
                    </td>
                    <td className="px-3 py-2">
                      <Input type="number" value={l.qty} onChange={(e) => updateLine(l.id, { qty: +e.target.value })} className="h-8 text-right tabular-nums" />
                    </td>
                    <td className="px-3 py-2">
                      <Input type="number" value={l.rate} onChange={(e) => updateLine(l.id, { rate: +e.target.value })} className="h-8 text-right tabular-nums" />
                    </td>
                    <td className="px-3 py-2 text-center pt-3.5">
                      <input type="checkbox" checked={l.taxable} onChange={(e) => updateLine(l.id, { taxable: e.target.checked })} className="h-4 w-4 accent-primary" />
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium pt-3.5">{fmtUSD(l.qty * l.rate)}</td>
                    <td className="px-2 py-2 pt-3">
                      <Button onClick={() => removeLine(l.id)} variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5 gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Attachments</h3>
                <Button variant="outline" size="sm" className="gap-1.5"><Upload className="h-4 w-4" />Upload</Button>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
                <Paperclip className="h-5 w-5 mx-auto mb-2" />
                Drag & drop files, or click upload. Max 20MB.
              </div>
              <ul className="space-y-1">
                {files.map((f) => (
                  <li key={f} className="flex items-center justify-between text-sm rounded-lg border px-3 py-2">
                    <span className="inline-flex items-center gap-2"><Paperclip className="h-3.5 w-3.5 text-muted-foreground" />{f}</span>
                    <button onClick={() => setFiles(fs => fs.filter(x => x !== f))} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5 gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Payments</h3>
                <Button variant="outline" size="sm">Receive payment</Button>
              </div>
              <ul className="space-y-2">
                {payments.map((p) => (
                  <li key={p.ref} className="flex items-center justify-between text-sm border-b last:border-0 pb-2">
                    <div>
                      <div className="font-medium">{p.method} · {p.ref}</div>
                      <div className="text-xs text-muted-foreground">{p.date}</div>
                    </div>
                    <span className="tabular-nums font-semibold text-success">{fmtUSD(p.amount)}</span>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Balance due</span>
                <span className="tabular-nums font-semibold">{fmtUSD(balance)}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Right: totals + PDF preview */}
        <div className="space-y-4">
          <Card className="p-5 gap-3">
            <h3 className="text-sm font-semibold">Summary</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{fmtUSD(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Taxable</span><span className="tabular-nums">{fmtUSD(taxableSub)}</span></div>
              <div className="flex items-center justify-between gap-2">
                <Label className="text-muted-foreground text-sm font-normal">Tax rate</Label>
                <div className="flex items-center gap-1">
                  <Input type="number" value={taxRate} onChange={(e) => setTaxRate(+e.target.value)} step="0.001" className="h-7 w-20 text-right tabular-nums" />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="tabular-nums">{fmtUSD(tax)}</span></div>
            </div>
            <Separator />
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium">Total</span>
              <span className="text-2xl font-semibold tabular-nums">{fmtUSD(total)}</span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="text-muted-foreground">Balance due</span>
              <span className="tabular-nums font-semibold text-primary">{fmtUSD(balance)}</span>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b flex items-center justify-between bg-muted/30">
              <h3 className="text-sm font-semibold">PDF preview</h3>
              <Badge variant="outline" className="text-[10px]">Live</Badge>
            </div>
            <div className="p-5 bg-muted/40">
              <div className="bg-white rounded-md shadow-sm border p-5 text-[11px] text-foreground space-y-3 aspect-[3/4]">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <BrandLogo size={28} />
                    <div>
                      <div className="font-semibold text-sm">{brand.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {BRAND.address.line1}<br/>
                        {BRAND.address.city}, {BRAND.address.country}<br/>
                        TIN: {BRAND.tin}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-base">INVOICE</div>
                    <div className="text-[10px] text-muted-foreground">INV-1032</div>
                  </div>
                </div>
                <div className="flex justify-between text-[10px]">
                  <div>
                    <div className="text-muted-foreground">Bill to</div>
                    <div className="font-medium">{customer}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground">Due Jul 6, 2026</div>
                    <div className="font-semibold text-primary tabular-nums">{fmtUSD(balance)}</div>
                  </div>
                </div>
                <div className="border-t pt-2 space-y-1">
                  {lines.map((l) => (
                    <div key={l.id} className="flex justify-between gap-2">
                      <span className="truncate">{l.item || "—"}</span>
                      <span className="tabular-nums shrink-0">{fmtUSD(l.qty * l.rate)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 space-y-1 text-[10px]">
                  <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{fmtUSD(subtotal)}</span></div>
                  <div className="flex justify-between"><span>Tax ({taxRate}%)</span><span className="tabular-nums">{fmtUSD(tax)}</span></div>
                  <div className="flex justify-between font-semibold pt-1 border-t"><span>Total</span><span className="tabular-nums">{fmtUSD(total)}</span></div>
                </div>
                <div className="border-t pt-2 text-[9px] text-muted-foreground text-center leading-snug">
                  {brand.name} · {BRAND.website} · TIN {BRAND.tin}<br/>
                  Questions? {BRAND.email} · {BRAND.phone}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
