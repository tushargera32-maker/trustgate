import Link from "next/link";
import Image from "next/image";
import {
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Phone,
  ArrowUpRight,
  Building2
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SERVICES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative isolate mt-24 border-t border-border/60 bg-ink-950 text-ink-100">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]">
        <div aria-hidden="true" className="dot-field absolute inset-0 opacity-[0.10]" />
      </div>

      <div className="container-edge py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.webp"
                alt="Trust Gate Overseas"
                width={180}
                height={50}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-300">
              A specialist visitor and tourist visa consultancy for clients in the United Kingdom and India. We handle Schengen, Australia, New Zealand, Canada, USA, UK visa extensions, and worldwide short-stay visa applications with professional care.
            </p>

            {/* Office Locations */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                <div>
                  <div className="font-medium text-ink-100">India office</div>
                  <div className="text-xs text-ink-300">Appointment basis only</div>
                  <div className="text-xs text-ink-300">{siteConfig.hours.weekdays}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                <div>
                  <div className="font-medium text-ink-100">London office</div>
                  <div className="text-xs text-ink-300">Appointment basis only</div>
                  <div className="text-xs text-ink-300">{siteConfig.hours.weekdays}</div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2.5 text-sm">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 text-ink-200 transition hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-ink-200 transition hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: Linkedin, href: siteConfig.social.linkedin, name: "LinkedIn" },
                { Icon: Instagram, href: siteConfig.social.instagram, name: "Instagram" },
                { Icon: Facebook, href: siteConfig.social.facebook, name: "Facebook" },
                { Icon: Youtube, href: siteConfig.social.youtube, name: "YouTube" }
              ].map(({ Icon, href, name }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-ink-200 transition hover:border-gold-300 hover:text-gold-300"
                  aria-label={`${siteConfig.name} on ${name}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Success Stories", href: "/success-stories" },
              { label: "Immigration Updates", href: "/immigration-updates" },
              { label: "Contact Us", href: "/contact" }
            ]}
          />
          <FooterCol
            title="Visa Services"
            links={SERVICES.filter((s) => s.published)
              .slice(0, 6)
              .map((s) => ({ label: s.shortName, href: `/services/${s.slug}` }))
              .concat([{ label: "All Services", href: "/services" }])}
          />
          <FooterCol
            title="Resources"
            links={[
              { label: "Eligibility Check", href: "/eligibility" },
              { label: "Frequently Asked Questions", href: "/faq" },
              { label: "Book Consultation", href: "/contact" },
              { label: "Client Portal", href: "/client/login" },
              { label: "Apply Now", href: "/apply" }
            ]}
          />
        </div>

        <p className="mt-12 border-t border-ink-800 pt-6 text-xs leading-relaxed text-ink-400">
          Trust Gate Overseas is a specialist immigration consultancy focused exclusively on visitor and tourist visa applications. We do not provide services for permanent residency, skilled migration, work permits, study visas, or family sponsorship. We are a private consultancy and not affiliated with any government immigration authority. We do not guarantee visa outcomes.
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-ink-800 pt-6 text-xs text-ink-400 lg:flex-row lg:items-center lg:justify-between">
          <div>
            © {new Date().getFullYear()} {siteConfig.legal.companyName}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/legal/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/legal/refund" className="hover:text-white">
              Refund Policy
            </Link>
            <Link href="/legal/cookies" className="hover:text-white">
              Cookie Policy
            </Link>
            <Link href="/legal/disclaimer" className="hover:text-white">
              Disclaimer
            </Link>
            <span className="ml-2 rounded-md border border-white/15 px-2 py-0.5 text-[10px]">
              {siteConfig.legal.registration}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="lg:col-span-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-1 text-ink-200 transition hover:text-white"
            >
              {l.label}
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
