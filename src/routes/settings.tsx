import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BrandLogo } from "@/components/app/BrandLogo";
import { useBrand } from "@/lib/brand-store";
import { BRAND, brandAddressLine } from "@/lib/brand";
import { Upload, RotateCcw, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Ethiopian Economic Association" }] }),
  component: Settings,
});

const MAX_LOGO_BYTES = 1024 * 1024; // 1 MB — keeps localStorage well under quota
const ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml";

function Settings() {
  const { name, logoDataUrl, setName, setLogoDataUrl, reset } = useBrand();
  const [draftName, setDraftName] = useState(name);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPickFile = () => fileRef.current?.click();

  const onFile = async (file: File | null) => {
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) {
      toast.error("Unsupported file type. Use PNG, JPEG, WebP or SVG.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error("Logo must be 1 MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onerror = () => reject(r.error);
        r.onload = () => resolve(String(r.result));
        r.readAsDataURL(file);
      });
      setLogoDataUrl(dataUrl);
      toast.success("Logo updated. It now appears on every PDF, preview and export.");
    } catch {
      toast.error("Could not read the file.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSaveName = () => {
    setName(draftName);
    toast.success("Organisation name saved.");
  };

  const onRemoveLogo = () => {
    setLogoDataUrl(null);
    toast.success("Reverted to the default EEA monogram.");
  };

  const onResetAll = () => {
    reset();
    setDraftName(BRAND.name);
    toast.success("Branding reset to defaults.");
  };

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Organisation branding used across the app, PDF previews, downloaded invoices and CSV exports."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4">
          <Card className="p-5 gap-4">
            <div>
              <h3 className="text-sm font-semibold">Logo</h3>
              <p className="text-xs text-muted-foreground">
                Upload a square PNG, JPEG, WebP or SVG (max 1 MB). Stored locally in your browser; replaces the
                default monogram everywhere the brand mark is shown.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl border bg-muted/30 p-4">
                <BrandLogo size={72} />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept={ACCEPT}
                    className="hidden"
                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                  />
                  <Button size="sm" className="gap-1.5" onClick={onPickFile} disabled={uploading}>
                    <Upload className="h-4 w-4" />
                    {logoDataUrl ? "Replace logo" : "Upload logo"}
                  </Button>
                  {logoDataUrl && (
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={onRemoveLogo}>
                      <Trash2 className="h-4 w-4" />Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 512×512 transparent PNG or SVG. The current logo is rendered at the size each
                  surface needs (sidebar 32px, PDF header 28–40px, reports header 40px).
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 gap-4">
            <div>
              <h3 className="text-sm font-semibold">Organisation name</h3>
              <p className="text-xs text-muted-foreground">
                Used in the sidebar, PDF header, report titles and the header block of every CSV export.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-end">
              <div className="space-y-1.5">
                <Label htmlFor="org-name">Display name</Label>
                <Input
                  id="org-name"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder={BRAND.name}
                />
              </div>
              <Button onClick={onSaveName} className="gap-1.5" disabled={draftName.trim() === name}>
                <Check className="h-4 w-4" />Save
              </Button>
            </div>
          </Card>

          <Card className="p-5 gap-3">
            <div>
              <h3 className="text-sm font-semibold">Contact &amp; legal details</h3>
              <p className="text-xs text-muted-foreground">
                Used in PDF headers and CSV footers. Edit these in <code>src/lib/brand.ts</code>.
              </p>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div><dt className="text-xs text-muted-foreground">Address</dt><dd>{brandAddressLine()}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Email</dt><dd>{BRAND.email}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Phone</dt><dd>{BRAND.phone}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Website</dt><dd>{BRAND.website}</dd></div>
              <div><dt className="text-xs text-muted-foreground">TIN</dt><dd>{BRAND.tin}</dd></div>
            </dl>
            <Separator />
            <div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={onResetAll}>
                <RotateCcw className="h-4 w-4" />Reset all branding to defaults
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 gap-3">
            <h3 className="text-sm font-semibold">Live preview</h3>
            <p className="text-xs text-muted-foreground">
              Mirror of the header used on invoice PDFs and reports.
            </p>
            <div className="rounded-md border bg-card p-4">
              <div className="flex items-start gap-3">
                <BrandLogo size={40} />
                <div>
                  <div className="font-semibold text-sm">{name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {BRAND.address.line1}<br />
                    {BRAND.address.city}, {BRAND.address.country}<br />
                    TIN: {BRAND.tin}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
              CSV exports include this name and address as a header block, and a matching footer line.
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
