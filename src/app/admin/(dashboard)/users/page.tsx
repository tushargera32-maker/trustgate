import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, UserCog, Users as UsersIcon, Edit } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";

const roleMeta: Record<string, { Icon: React.FC<{ className?: string }>; tone: "default" | "success" | "warning" | "destructive" }> = {
  SUPER_ADMIN: { Icon: Shield, tone: "destructive" },
  ADMIN: { Icon: Shield, tone: "warning" },
  COUNSELLOR: { Icon: UsersIcon, tone: "success" },
  CASE_MANAGER: { Icon: UserCog, tone: "default" },
  CONTENT_MANAGER: { Icon: UserCog, tone: "default" },
  FINANCE: { Icon: UserCog, tone: "default" },
  CLIENT: { Icon: UsersIcon, tone: "default" }
};

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  COUNSELLOR: "Counsellor",
  CASE_MANAGER: "Case Manager",
  CONTENT_MANAGER: "Content Manager",
  FINANCE: "Finance",
  CLIENT: "Client"
};

export default async function UsersPage() {
  await requireStaff();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  const staffUsers = users.filter(u => u.role !== "CLIENT");
  const clientUsers = users.filter(u => u.role === "CLIENT");

  const roleCount = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            System
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Users & Roles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage staff members, assign roles, and control access permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4" /> Add Staff
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Total Users
            </div>
            <div className="mt-1 font-display text-2xl">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Staff Members
            </div>
            <div className="mt-1 font-display text-2xl">{staffUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Clients
            </div>
            <div className="mt-1 font-display text-2xl">{clientUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Active Users
            </div>
            <div className="mt-1 font-display text-2xl text-teal-600">
              {users.filter(u => u.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Members Table */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base">Staff Members</h2>
            <Badge variant="outline">{staffUsers.length} staff</Badge>
          </div>
          {staffUsers.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center text-center">
              <div>
                <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 font-display text-base">No staff members</p>
                <p className="mt-1 text-sm text-muted-foreground">Add your first staff member to get started.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="h-11 px-4 text-left font-semibold">Name</th>
                    <th className="h-11 px-4 text-left font-semibold">Email</th>
                    <th className="h-11 px-4 text-left font-semibold">Role</th>
                    <th className="h-11 px-4 text-left font-semibold">Status</th>
                    <th className="h-11 px-4 text-left font-semibold">Joined</th>
                    <th className="h-11 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {staffUsers.map((user) => {
                    const meta = roleMeta[user.role];
                    return (
                      <tr key={user.id} className="transition-colors hover:bg-secondary/20">
                        <td className="px-4 py-3 font-medium">{user.name || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={meta?.tone || "default"} className="gap-1">
                            {meta?.Icon && <meta.Icon className="h-3 w-3" />}
                            {roleLabels[user.role]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={user.isActive ? "success" : "destructive"}>
                            {user.isActive ? "Active" : "Disabled"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" /> Edit
                            </Button>
                            {!user.isActive && (
                              <Button size="sm" variant="ghost">
                                Enable
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base">Clients</h2>
            <Badge variant="outline">{clientUsers.length} clients</Badge>
          </div>
          {clientUsers.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center text-center">
              <div>
                <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 font-display text-base">No clients yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Clients appear here when they register.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="h-11 px-4 text-left font-semibold">Name</th>
                    <th className="h-11 px-4 text-left font-semibold">Email</th>
                    <th className="h-11 px-4 text-left font-semibold">Status</th>
                    <th className="h-11 px-4 text-left font-semibold">Joined</th>
                    <th className="h-11 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {clientUsers.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-secondary/20">
                      <td className="px-4 py-3 font-medium">{user.name || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={user.isActive ? "success" : "destructive"}>
                          {user.isActive ? "Active" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
