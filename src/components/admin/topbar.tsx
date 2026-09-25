"use client";

import * as React from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function AdminTopbar({
  userName,
  userEmail,
  role
}: {
  userName: string;
  userEmail: string;
  role?: string;
}) {
  return (
    <header className="glass-panel sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 sm:px-6">
      {/* Search */}
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        {/* TODO(search): not wired to anything yet — no handler, no endpoint.
            Kept because staff know it is coming; do not ship an equivalent
            on the client portal, where a dead control reads as a broken
            product. */}
        <Input
          placeholder="Search anything..."
          aria-label="Search"
          disabled
          title="Search is not available yet"
          className="border-0 bg-muted/50 pl-9 focus-visible:ring-1"
        />
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" aria-hidden="true" />
              {/* The unread dot was hardcoded on, directly above a menu
                  reading "No new notifications". Restore it only when it is
                  driven by a real count from the Notification model. */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 pl-2 pr-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xs font-semibold text-primary-foreground">
                {initials(userName)}
              </div>
              <div className="hidden text-left text-sm leading-tight sm:block">
                <div className="font-medium">{userName}</div>
                <div className="text-xs text-muted-foreground">{role}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/client/login" })}
              className="text-ochre-600"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
