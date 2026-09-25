"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { DESTINATIONS, SERVICES } from "@/lib/constants";

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string; description?: string }[];
};

const NAV: NavItem[] = [
  {
    label: "Destinations",
    children: DESTINATIONS.map((d) => ({
      label: d.name,
      href: `/countries/${d.code.toLowerCase()}`,
      description: d.stayNote
    }))
  },
  {
    label: "Services",
    children: SERVICES.filter((s) => s.published).map((s) => ({
      label: s.name,
      href: `/services/${s.slug}`,
      description: s.accent
    }))
  },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Visa Updates", href: "/immigration-updates" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export function Header() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setActiveMenu(null);
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-shadow duration-300",
        // Solid at rest so it does not fight the navy hero directly beneath;
        // glass once content is scrolling under it, which is the only state
        // where the blur is actually doing something.
        scrolled
          ? "glass-panel border-b border-border shadow-soft"
          : "border-b border-border bg-background"
      )}
    >
      <div className="container-edge flex h-16 items-center gap-6 lg:h-20">
        <Link
          href="/"
          className="group flex items-center"
          aria-label={siteConfig.name}
        >
          <Image
            src="/logo.webp"
            alt="Trust Gate Overseas"
            width={180}
            height={50}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="ml-4 hidden items-center gap-1 lg:flex"
        >
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  type="button"
                  aria-expanded={activeMenu === item.label}
                  aria-haspopup="true"
                  onClick={() =>
                    setActiveMenu((m) => (m === item.label ? null : item.label))
                  }
                  onFocus={() => setActiveMenu(item.label)}
                  className={cn(
                    "flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground",
                    activeMenu === item.label && "text-foreground"
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-300",
                      activeMenu === item.label && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {activeMenu === item.label && (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: 8 }}
                      transition={{ duration: reduce ? 0 : 0.18 }}
                      className="absolute left-0 top-full min-w-[320px] pt-2"
                    >
                      <div className="surface max-h-[70vh] w-[22rem] overflow-y-auto p-1.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="group/item flex items-start justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-secondary"
                          >
                            <div>
                              <div className="text-sm font-medium">
                                {child.label}
                              </div>
                              {child.description && (
                                <div className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">
                                  {child.description}
                                </div>
                              )}
                            </div>
                            <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/item:opacity-100 group-focus-visible/item:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "relative flex h-10 items-center px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  "after:absolute after:inset-x-3 after:bottom-1 after:h-px after:bg-accent after:opacity-0 after:transition-opacity",
                  pathname === item.href && "text-foreground after:opacity-100"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <Link href="/client/login" className="gap-1.5">
              Client login
            </Link>
          </Button>
          <Button size="sm" asChild className="hidden md:inline-flex">
            <Link href="/eligibility">
              Check eligibility
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/60 text-foreground/80 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            id="mobile-nav"
            className="overflow-hidden border-t border-border/60 bg-background lg:hidden"
          >
            <div className="container-edge space-y-1 py-4">
              {NAV.map((item) => (
                <div key={item.label} className="border-b border-border/40 py-2">
                  <div className="label-data">
                    {item.label}
                  </div>
                  {item.children ? (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="rounded-md px-2 py-2 text-sm hover:bg-secondary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className="mt-2 block rounded-md px-2 py-2 text-sm hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/client/login">Client login</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/eligibility">Check eligibility</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}