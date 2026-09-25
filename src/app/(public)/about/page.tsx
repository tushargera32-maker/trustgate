import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Users, Heart, Building2 } from "lucide-react";
import { PageHero } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { RevealStagger, RevealItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us - Trust Gate Overseas",
  description:
    "Trust Gate Overseas is a specialist visitor and tourist visa consultancy serving clients in the United Kingdom and India. We handle short-stay visa applications with professional care."
};

const VALUES = [
  {
    Icon: ShieldCheck,
    t: "Honest immigration guidance",
    d: "Visa outcomes are determined by immigration authorities, not consultants. We provide accurate advice, complete documentation, and accountable case management - no false promises."
  },
  {
    Icon: Award,
    t: "Senior immigration counsellors",
    d: "Your case is handled by an experienced immigration consultant from consultation through to decision. No junior staff, no handoffs."
  },
  {
    Icon: Users,
    t: "Visitor visa specialists",
    d: "We exclusively handle visitor and tourist visa applications. We decline cases outside this scope rather than learn on your application."
  },
  {
    Icon: Heart,
    t: "Government-cited guidance",
    d: "All advice is referenced to official immigration authority sources with verification dates. We do not make unsourced claims."
  }
];

const TEAM = [
  { name: "Senior Immigration Consultant", role: "Director · Visa Services" },
  { name: "Immigration Case Manager", role: "Head of Case Management" },
  { name: "Immigration Content Specialist", role: "Head of Content & Compliance" },
  { name: "Finance Manager", role: "Head of Finance & Operations" }
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Specialist Visitor Visa Consultancy"
        description="Trust Gate Overseas is a professional immigration consultancy specializing exclusively in visitor and tourist visa applications for clients in the United Kingdom and India. We handle one category of immigration work, and we do it with care."
      />

      <section className="container-edge my-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-display text-2xl">Our Immigration Practice</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Trust Gate Overseas was established to address a gap in professional immigration services.
            Short-stay visa applications are often treated as low-priority work by generalist immigration
            firms - submitted with template cover letters, insufficient supporting documentation, and
            inadequate attention to previous refusal grounds.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We operate differently. Our consultancy handles visitor and tourist visa applications
            exclusively. We serve clients applying from two jurisdictions: the United Kingdom and India.
            We work with a defined list of destination countries. Every application is reviewed by a
            senior immigration consultant, and every case status change is documented in a secure client portal.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            This focused approach means we decline work outside our expertise. If your travel does not
            require a visa, we will advise you accordingly. If your visa extension lacks merit under
            current immigration rules, we will not submit it. If you require permanent residence,
            study visa, or work permit services, we will refer you to appropriate specialists.
          </p>
        </div>

        <div className="lg:col-span-5">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-base">
                Our Immigration Services
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  Visitor and tourist visa applications only - no permanent residence, study, work, or sponsorship services
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  All immigration guidance cited to official government sources with verification dates
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  No visa approval guarantees - outcomes depend on immigration authority assessment
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  Transparent case tracking through secure client portal
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  Senior consultant assigned from consultation to decision
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  Comprehensive refusal analysis and reapplication support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-display text-base">
                Office Locations
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                  <div>
                    <div className="font-medium">India Office</div>
                    <div className="text-sm text-muted-foreground">Appointment basis only</div>
                    <div className="mt-1 text-xs text-muted-foreground">Mon - Sat: 9:00 AM - 6:00 PM IST</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                  <div>
                    <div className="font-medium">London Office</div>
                    <div className="text-sm text-muted-foreground">Appointment basis only</div>
                    <div className="mt-1 text-xs text-muted-foreground">Mon - Sat: 9:00 AM - 6:00 PM GMT</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y border-border/40 bg-secondary/30 py-16">
        <div className="container-edge">
          <h2 className="text-center font-display text-2xl">
            Our Immigration Values
          </h2>
          <RevealStagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <RevealItem key={v.t}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10 text-gold-600">
                      <v.Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base">{v.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
                  </CardContent>
                </Card>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="container-edge my-16">
        <h2 className="font-display text-2xl">Immigration Team</h2>
        <RevealStagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((t, idx) => {
            const images = [
              "/team/director.webp",
              "/team/case-manager.webp",
              "/team/content-specialist.webp",
              "/team/finance-manager.webp"
            ];
            return (
              <RevealItem key={t.name}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
                      <Image
                        src={images[idx]}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-base">{t.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.role}</p>
                  </CardContent>
                </Card>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </section>

      <section className="border-t border-border/40 bg-secondary/30 py-16">
        <div className="container-edge text-center">
          <h2 className="font-display text-2xl">Ready to Start Your Visa Application?</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Book a consultation with a senior immigration consultant to discuss your visitor visa requirements.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Book Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/eligibility">Check Eligibility</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
