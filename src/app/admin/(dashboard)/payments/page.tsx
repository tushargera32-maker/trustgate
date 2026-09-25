import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Demo invoice records.
 *
 * Amounts are deliberately NOT hardcoded. Trust Gate Overseas does not publish
 * prices, and inventing figures here would put fabricated numbers in front of
 * staff. Amounts come from the Payments table once the billing integration is
 * connected - see the completion notes.
 */
const invoices = [
  {
    ref: "INV-2026-0041",
    client: "Priya S.",
    case: "TGO-2026-00482 · Schengen Tourist Visa",
    status: "Paid" as const,
    date: "Mar 18, 2026"
  },
  {
    ref: "INV-2026-0042",
    client: "Ananya K.",
    case: "TGO-2026-00491 · UK Visitor Visa",
    status: "Paid" as const,
    date: "Mar 21, 2026"
  },
  {
    ref: "INV-2026-0043",
    client: "Devansh R.",
    case: "TGO-2026-00544 · Schengen Tourist Visa",
    status: "Pending" as const,
    date: "Due May 02, 2026"
  },
  {
    ref: "INV-2026-0044",
    client: "Maria S.",
    case: "TGO-2026-00533 · Australia Visitor Visa",
    status: "Paid" as const,
    date: "Apr 02, 2026"
  }
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Operations
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl">
          Payments
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoice ledger. Amounts populate from the billing provider once
          connected.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Invoices issued (mo.)", String(invoices.length)],
          ["Paid", String(invoices.filter((i) => i.status === "Paid").length)],
          [
            "Outstanding",
            String(invoices.filter((i) => i.status === "Pending").length)
          ],
          ["Refunds", "0"]
        ].map(([k, v]) => (
          <Card key={k}>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {k}
              </div>
              <div className="mt-1 font-display text-2xl">{v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border/60">
            {invoices.map((inv) => (
              <li
                key={inv.ref}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="font-mono text-xs text-muted-foreground">
                    {inv.ref}
                  </div>
                  <div className="font-medium">{inv.client}</div>
                  <div className="text-xs text-muted-foreground">{inv.case}</div>
                </div>
                <Badge variant={inv.status === "Paid" ? "success" : "warning"}>
                  {inv.status}
                </Badge>
                <div className="text-xs text-muted-foreground">{inv.date}</div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Demo records. No payment provider is connected - invoice amounts,
        settlement status and refunds require the billing integration described
        in the completion notes.
      </p>
    </div>
  );
}
