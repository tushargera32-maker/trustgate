import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/ui/status-pill";

export default async function PaymentsPage() {
  const session = await requireSession();

  const payments = await prisma.payment.findMany({
    where: { client: { userId: session.user.id } },
    orderBy: { createdAt: "desc" }
  });

  const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const paid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const pending = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Payments
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Billing & invoices
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track payments and download receipts.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Total billed
            </div>
            <div className="mt-1 font-display text-2xl">
              £{total.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Paid
            </div>
            <div className="mt-1 font-display text-2xl text-teal-600">
              £{paid.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Pending
            </div>
            <div className="mt-1 font-display text-2xl text-gold-600">
              £{pending.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[40vh] flex-col items-center justify-center p-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 font-display text-lg">
              No payments yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Your counsellor will send a payment request once your engagement
              letter is signed and work is ready to begin.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="h-11 px-4 text-left font-semibold">Description</th>
                    <th className="h-11 px-4 text-left font-semibold">Date</th>
                    <th className="h-11 px-4 text-left font-semibold">Amount</th>
                    <th className="h-11 px-4 text-left font-semibold">Status</th>
                    <th className="h-11 px-4 text-right font-semibold">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {payments.map((payment) => {
                    return (
                      <tr
                        key={payment.id}
                        className="transition-colors hover:bg-secondary/20"
                      >
                        <td className="px-4 py-3 font-medium">
                          {payment.description}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-mono font-medium">
                          £{Number(payment.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill status={payment.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {payment.status === "PAID" && (
                            <Button size="sm" variant="ghost">
                              Download
                            </Button>
                          )}
                          {payment.status === "PENDING" && (
                            <Button size="sm">Pay now</Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
