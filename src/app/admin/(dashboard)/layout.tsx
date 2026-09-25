import { requireStaff } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await requireStaff();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <AdminTopbar
          userName={session.user.name ?? session.user.email ?? "Admin"}
          userEmail={session.user.email ?? ""}
          role={session.user.role}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
