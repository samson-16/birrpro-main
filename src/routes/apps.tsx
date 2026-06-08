import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/app/PlaceholderPage";

export const Route = createFileRoute("/apps")({
  head: () => ({ meta: [{ title: "Apps — Ethiopian Economic Association" }] }),
  component: () => <PlaceholderPage title="Apps" description="Manage your Apps." />,
});
