import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Star } from "lucide-react";
import { DEMO_STORIES } from "@/lib/content";



export default function StoriesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Content
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Success stories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Only publish real client statements given with consent. Never
            fabricate a testimonial or imply a guaranteed outcome.
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add story
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border/60">
            {DEMO_STORIES.map((story, i) => (
              <li
                key={i}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="font-medium">{story.displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {story.route} · {story.service}
                  </div>
                </div>
                {story.featured && (
                  <Badge variant="gold">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                )}
                <Badge
                  variant={story.status === "PUBLISHED" ? "success" : "warning"}
                >
                  {story.status === "PUBLISHED" ? "Published" : "Draft"}
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