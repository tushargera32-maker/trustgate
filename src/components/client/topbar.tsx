"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, ChevronDown, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/utils";
import { ClientMobileMenuTrigger } from "@/components/client/sidebar";

/**
 * Client portal topbar.
 *
 * Three things were fixed here:
 *
 * 1. The hamburger called a `setOpen` that belonged to this component. The
 *    sidebar it was meant to open read a different `useState` entirely, so
 *    the portal navigation was unreachable on mobile. The trigger now reads
 *    the shared shell state — see components/client/shell-context.tsx.
 *
 * 2. The bell carried a permanent unread dot with nothing behind it. An
 *    indicator that always says "you have something" trains people to
 *    ignore it, which is worse than having no indicator. It is now a real
 *    menu, and the dot is gone until there is something to count.
 *
 * 3. The user chip was a `div` with a chevron on it. The chevron promises a
 *    menu, so tapping it and getting nothing reads as a broken control.
 *    It is now an actual menu — which also puts Sign out within reach on a
 *    phone, where it previously lived only in the unreachable sidebar.
 *
 * The search field is deliberately left out. It was a non-functional input
 * promising "Search applications, documents, invoices…" — see the handover
 * note; wiring it needs a search endpoint that does not exist yet, and a box
 * that silently does nothing is worse than no box.
 */
export function ClientTopbar({
  userName,
  userEmail
}: {
  userName: string;
  userEmail: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur-xl sm:px-8">
      <ClientMobileMenuTrigger />

      <Link
        href="/client"
        className="font-display text-sm text-foreground/90 md:hidden"
      >
        Client portal
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nothing new. Updates to your case appear here.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto gap-3 rounded-full border border-border/60 bg-card py-1.5 pl-2 pr-3"
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-xs font-semibold text-ink-900"
              >
                {initials(userName)}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-xs font-medium">{userName}</span>
                <span className="block text-[10px] font-normal text-muted-foreground">
                  {userEmail}
                </span>
              </span>
              <ChevronDown
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="block text-sm font-medium">{userName}</span>
              <span className="mt-0.5 block break-anywhere text-xs font-normal text-muted-foreground">
                {userEmail}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/client/profile">
                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
