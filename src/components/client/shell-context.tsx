"use client";

import * as React from "react";

/**
 * Shared state for the client portal's mobile navigation drawer.
 *
 * Why this exists
 * ───────────────
 * `ClientSidebar` and `ClientTopbar` are siblings — the layout renders the
 * sidebar, then the topbar next to it. Each one previously held its own
 * `useState(false)` for the drawer:
 *
 *   • The topbar rendered the hamburger and called *its own* `setOpen(true)`.
 *     Nothing read that value. It was write-only state.
 *   • The sidebar read *its own* `open` to decide whether to translate into
 *     view. Nothing ever set it to `true`.
 *
 * The result was that on any viewport below `lg`, a signed-in client could
 * not open the portal navigation at all: Documents, Messages, Appointments,
 * Payments and Profile were unreachable, and so was the sidebar's Sign out.
 * The button appeared to work — it had a pressed state — which is why it
 * survived review.
 *
 * The state now lives above both of them. The admin sidebar does not need
 * this because it renders its own trigger, so its state never had to cross a
 * component boundary.
 */

type ClientShellState = {
  navOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
};

const ClientShellContext = React.createContext<ClientShellState | null>(null);

export function ClientShellProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = React.useState(false);

  const openNav = React.useCallback(() => setNavOpen(true), []);
  const closeNav = React.useCallback(() => setNavOpen(false), []);

  /* Escape closes the drawer. Expected of any overlay, and the only exit for
     a keyboard user once focus is inside it. */
  React.useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  /* Stop the page behind the drawer from scrolling. Without this, dragging
     on the overlay scrolls the dashboard underneath — which reads as the
     drawer being broken. */
  React.useEffect(() => {
    if (!navOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [navOpen]);

  const value = React.useMemo(
    () => ({ navOpen, openNav, closeNav }),
    [navOpen, openNav, closeNav]
  );

  return (
    <ClientShellContext.Provider value={value}>
      {children}
    </ClientShellContext.Provider>
  );
}

export function useClientShell(): ClientShellState {
  const ctx = React.useContext(ClientShellContext);
  if (!ctx) {
    throw new Error(
      "useClientShell must be used inside <ClientShellProvider>. The provider lives in src/app/client/(dashboard)/layout.tsx."
    );
  }
  return ctx;
}
