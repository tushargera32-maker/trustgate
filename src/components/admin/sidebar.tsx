"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Folder,
  Calendar,
  CreditCard,
  Globe,
  Award,
  Newspaper,
  BookOpen,
  UserCog,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ImageIcon,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const SECTIONS: {
  title: string;
  items: {
    href: string;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[];
}[] = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }]
  },
  {
    title: "Pipeline",
    items: [
      { href: "/admin/leads", label: "Leads", icon: TrendingUp },
      { href: "/admin/applications", label: "Applications", icon: FileText },
      { href: "/admin/documents", label: "Documents", icon: Folder },
      { href: "/admin/appointments", label: "Appointments", icon: Calendar },
      { href: "/admin/payments", label: "Payments", icon: CreditCard }
    ]
  },
  {
    title: "Content",
    items: [
      { href: "/admin/countries", label: "Countries", icon: Globe },
      { href: "/admin/services", label: "Services", icon: Award },
      { href: "/admin/blog", label: "Blog", icon: BookOpen },
      { href: "/admin/updates", label: "Updates", icon: Newspaper },
      { href: "/admin/stories", label: "Stories", icon: Award }
    ]
  },
  {
    title: "System",
    items: [
      { href: "/admin/users", label: "Users", icon: UserCog },
      { href: "/admin/images", label: "Media", icon: ImageIcon },
      { href: "/admin/settings", label: "Settings", icon: Settings }
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  /* Escape closes the drawer, and the page behind it stops scrolling while
     it is open. Neither was handled before, so the only way out was to hit
     the small X or tap a link. */
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Admin navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <ShieldCheck className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm">Trust Gate</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Admin
              </div>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/client/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile trigger. Hidden while the drawer is open so it does not sit
          on top of the drawer it just opened. */}
      {!open && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-4 z-40 shadow-lg lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={false}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      )}
    </>
  );
}
