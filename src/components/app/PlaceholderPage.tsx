import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

export function PlaceholderPage({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <AppShell>
      <PageHeader title={title} description={description} />
      {children ?? (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-4">
            <span className="text-accent-foreground text-xl">✦</span>
          </div>
          <h2 className="text-lg font-semibold">{title} module</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            This area is wired into the design system and ready to be built out. Use the New button in the header to create records.
          </p>
        </Card>
      )}
    </AppShell>
  );
}
