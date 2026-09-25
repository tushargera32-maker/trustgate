"use client";

import * as React from "react";
import Link from "next/link";
import { useFormState as useActionState } from "react-dom";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { PageHero } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { ORIGIN_HUBS, SERVICES } from "@/lib/constants";
import { submitContactForm } from "@/app/actions/leads";

export default function ContactPage() {
  const [state, action] = useActionState(submitContactForm, null);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Book a consultation. Talk to a senior counsellor."
        description="30 minutes with the person who will actually run your case. Bring your questions - leave with a plan."
      />
      <section className="container-edge my-16 grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 sm:p-8">
            {state?.ok ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/15 text-teal-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="font-display text-2xl">
                  Thank you - we&rsquo;ll be in touch.
                </h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  A senior counsellor will reach out within one business day. If
                  urgent, you can reach us directly on WhatsApp.
                </p>
                <Button asChild>
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            ) : (
              <form action={action} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" required className="mt-1.5" />
                    {state?.fields?.name && (
                      <p className="mt-1 text-xs text-destructive">{state.fields.name[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required className="mt-1.5" />
                    {state?.fields?.email && (
                      <p className="mt-1 text-xs text-destructive">{state.fields.email[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="hub">Applying from</Label>
                    <select
                      id="hub"
                      name="hub"
                      className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm"
                    >
                      {ORIGIN_HUBS.map((h) => (
                        <option key={h.slug} value={h.slug}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="service">Which visa?</Label>
                    <select
                      id="service"
                      name="service"
                      className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm"
                    >
                      {SERVICES.filter((s) => s.published).map((s) => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                      ))}
                      <option value="">Not sure yet</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">How can we help?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Your travel dates, purpose of the trip, and anything unusual in your history."
                    className="mt-1.5"
                  />
                  {state?.fields?.message && (
                    <p className="mt-1 text-xs text-destructive">{state.fields.message[0]}</p>
                  )}
                </div>
                {state?.ok === false && !state.fields && (
                  <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    {state.error}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-600" />
                    Confidential. Never shared.
                  </p>
                  <SubmitButton pendingLabel="Sending…">Request consultation</SubmitButton>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <aside className="space-y-5">
          <Card>
            <CardContent className="space-y-3 p-6 text-sm">
              <Row icon={<Mail className="h-4 w-4" />} label="Email">
                <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                  {siteConfig.email}
                </a>
              </Row>
              <Row icon={<Phone className="h-4 w-4" />} label="Phone">
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:underline">
                  {siteConfig.phone}
                </a>
              </Row>
              <Row icon={<MapPin className="h-4 w-4" />} label="Office">
                {siteConfig.address}
              </Row>
              <Row icon={<Clock className="h-4 w-4" />} label="Hours">
                {siteConfig.hours.weekdays}
                <br />
                {siteConfig.hours.saturday}
                <br />
                {siteConfig.hours.sunday}
              </Row>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-sm">WhatsApp</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Quick questions? Chat with us.
              </p>
              <Button asChild variant="outline" className="mt-3 w-full">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </>
  );
}

function Row({
  icon,
  label,
  children
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gold-600">{icon}</span>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
