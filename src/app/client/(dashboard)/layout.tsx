import { requireSession } from "@/lib/auth";
import { ClientSidebar } from "@/components/client/sidebar";
import { ClientTopbar } from "@/components/client/topbar";
import { ClientShellProvider } from "@/components/client/shell-context";

export default async function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    /* The provider wraps both the sidebar and the topbar because the mobile
       drawer is opened from one and rendered by the other. See
       shell-context.tsx for what was broken before. */
    <ClientShellProvider>
      <div className="flex min-h-screen bg-secondary/20">
        <ClientSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <ClientTopbar
            userName={session.user.name ?? session.user.email ?? "Client"}
            userEmail={session.user.email ?? ""}
          />
          <main id="client-main" className="flex-1 px-4 pb-12 pt-6 sm:px-8">
            {children}
          </main>
        </div>
      </div>
    </ClientShellProvider>
  );
}
