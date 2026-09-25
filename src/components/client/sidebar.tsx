"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Folder,
  MessageSquare,
  Calendar,
  CreditCard,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useClientShell } from "@/components/client/shell-context";

const NAV = [
  { href: "/client", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/client/application", label: "My Application", icon: FileText },
  { href: "/client/documents", label: "Documents", icon: Folder },
  { href: "/client/messages", label: "Messages", icon: MessageSquare },
  { href: "/client/appointments", label: "Appointments", icon: Calendar },
  { href: "/client/payments", label: "Payments", icon: CreditCard },
  { href: "/client/profile", label: "Profile", icon: User }
];

export function ClientSidebar() {
  const pathname = usePathname();
  const { navOpen, closeNav } = useClientShell();

  return (
    <>
      {navOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeNav}
          className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        aria-label="Client portal navigation"
        /* Hidden from assistive tech while off-screen, or a screen reader
           reads a menu the user cannot see and cannot reach. */
        aria-hidden={navOpen ? undefined : "true"}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/60 bg-card transition-transform duration-300 lg:static lg:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <div className="leading-tight">
              <div className="font-display text-sm">
                Trust Gate
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Client Portal
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={closeNav}
            className="rounded-md p-1.5 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Application
          </div>
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-foreground/80 hover:bg-secondary"
                    )}
                    onClick={closeNav}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border/60 p-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export function ClientMobileMenuTrigger() {
  const { navOpen, openNav, closeNav } = useClientShell();

  return (
    <button
      type="button"
      onClick={navOpen ? closeNav : openNav}
      className="rounded-md border border-border/60 p-2 lg:hidden"
      aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={navOpen}
    >
      <Menu className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}