import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const countries = [
  ["🇨🇦", "Canada", "North America", "9 pathways", "Published"],
  ["🇬🇧", "United Kingdom", "Europe", "7 pathways", "Published"],
  ["🇦🇺", "Australia", "Oceania", "6 pathways", "Published"],
  ["🇺🇸", "United States", "North America", "5 pathways", "Published"],
  ["🇳🇿", "New Zealand", "Oceania", "4 pathways", "Published"],
  ["🇩🇪", "Germany", "Europe", "3 pathways", "Draft"]
];

export default function CountriesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Content
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Countries
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Each country gets a dynamic SEO landing page with its own pathways.
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add country
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <Input placeholder="Search countries" className="max-w-xs" />
          <div className="mt-5 overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="h-11 px-4 text-left font-semibold">Country</th>
                  <th className="h-11 px-4 text-left font-semibold">Region</th>
                  <th className="h-11 px-4 text-left font-semibold">Pathways</th>
                  <th className="h-11 px-4 text-left font-semibold">Status</th>
                  <th className="h-11 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {countries.map((row, i) => (
                  <tr key={i} className="transition-colors hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium">
                      <span className="mr-2">{row[0]}</span>
                      {row[1]}
                    </td>
                    <td className="px-4 py-3">{row[2]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[3]}</td>
                    <td className="px-4 py-3">
                      <Badge variant={row[4] === "Published" ? "success" : "warning"}>
                        {row[4]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost">
                          Preview
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}