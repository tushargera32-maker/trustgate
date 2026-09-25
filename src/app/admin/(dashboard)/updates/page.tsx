import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { DEMO_UPDATES } from "@/lib/content";



export default function UpdatesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Content
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Visa updates
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every update requires a destination, visa category, publication date, last-verified date and an official source URL. Never publish a policy claim you cannot cite.
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Publish update
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border/60">
            {DEMO_UPDATES.map((u) => (
              <li
                key={u.slug}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="font-medium">{u.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {u.destination} · {u.service} · published {u.publishedAt} ·
                    last verified {u.lastVerifiedAt}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    Source: {u.source.name} -{" "}
                    <span className="font-mono">{u.source.url}</span>
                  </div>
                </div>
                <Badge variant={u.status === "PUBLISHED" ? "success" : "warning"}>
                  {u.status === "PUBLISHED" ? "Published" : "Draft"}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost">
                    Preview
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}