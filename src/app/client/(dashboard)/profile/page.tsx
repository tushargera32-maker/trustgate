import { User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
  const session = await requireSession();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Profile
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            My details
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your personal information and contact details.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 font-display text-base">
              <User className="h-4 w-4 text-gold-600" />
              Personal information
            </h2>
            <form className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    defaultValue={user.name || ""}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Contact support to change your email
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue={user.phone || ""}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    defaultValue={client?.nationality || ""}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    defaultValue={
                      client?.dateOfBirth
                        ? new Date(client.dateOfBirth).toISOString().split("T")[0]
                        : ""
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="passport">Passport number</Label>
                  <Input
                    id="passport"
                    defaultValue={client?.passportNumber || ""}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-sm">
                Account created
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-sm">
                Change password
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Update your password to keep your account secure.
              </p>
              <Button variant="outline" className="mt-4 w-full" size="sm">
                Update password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
