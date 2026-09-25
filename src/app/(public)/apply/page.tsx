"use client";

import * as React from "react";
import Link from "next/link";
import { useFormState as useActionState } from "react-dom";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  CheckCircle2,
  ShieldCheck,
  User,
  MapPin,
  FileText
} from "lucide-react";
import { PageHero } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ORIGIN_HUBS, SERVICES } from "@/lib/constants";
import { submitApplyForm } from "@/app/actions/leads";

export default function ApplyPage() {
  const [state, action] = useActionState(submitApplyForm, null);

  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Start your visa application"
        description="Provide your details and a senior immigration consultant will respond within one business day with an initial assessment of your case, eligibility, and recommended visa route."
      />
      <section className="container-edge my-12 grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 sm:p-8">
            {state?.ok ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-teal-600" />
                <h2 className="font-display text-2xl">
                  Application received
                </h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Your application has been received by our immigration team. A senior consultant will review your case and contact you within one business day with an initial assessment.
                </p>
                <Button asChild>
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            ) : (
              <form action={action} className="space-y-8" noValidate>
                <Group icon={<User className="h-4 w-4" />} title="About you">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id="fullName"
                      label="Full name"
                      required
                      autoComplete="name"
                      error={state?.fields?.fullName?.[0]}
                    />
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      error={state?.fields?.email?.[0]}
                    />
                    <Field
                      id="phone"
                      label="Phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                    <Field
                      id="dob"
                      label="Date of birth"
                      type="date"
                      autoComplete="bday"
                    />
                  </div>
                </Group>
                <Group icon={<MapPin className="h-4 w-4" />} title="Your trip">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="hub">Applying from</Label>
                      <select
                        id="hub"
                        name="hub"
                        className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm"
                      >
                        <option value="">Select where you are applying from</option>
                        {ORIGIN_HUBS.map((h) => (
                          <option key={h.slug} value={h.slug}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="service">Visa you are interested in</Label>
                      <select
                        id="service"
                        name="service"
                        className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm"
                      >
                        {/* Must stay first: a select adopts its first option as
                            the default, so any other order silently submits a
                            visa the applicant never chose. */}
                        <option value="">Not sure yet — help me work it out</option>
                        {SERVICES.filter((s) => s.published).map((s) => (
                          <option key={s.slug} value={s.slug}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <Field id="travelDate" label="Intended travel date" type="date" />
                    <div>
                      <Label htmlFor="purpose">Purpose of visit</Label>
                      <select
                        id="purpose"
                        name="purpose"
                        className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm"
                      >
                        <option value="">Select a purpose</option>
                        <option value="Tourism or holiday">Tourism or holiday</option>
                        <option value="Visiting family or friends">Visiting family or friends</option>
                        <option value="Short business visit">Short business visit</option>
                        <option value="Another short visit">Another short visit</option>
                      </select>
                    </div>
                  </div>
                </Group>
                <Group icon={<FileText className="h-4 w-4" />} title="Background">
                  <div>
                    <Label htmlFor="notes">Anything we should know?</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      className="mt-1.5"
                      placeholder="Travel history, who is funding the trip, any previous visa refusals - anything relevant."
                    />
                  </div>
                </Group>
                {state?.ok === false && !state.fields && (
                  <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
                  >
                    {state.error}
                  </p>
                )}
                <div className="flex items-center justify-between border-t border-border/60 pt-6">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-600" />
                    Confidential. Never shared.
                  </p>
                  <SubmitButton pendingLabel="Submitting…">Submit application</SubmitButton>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardContent className="p-6 text-sm leading-relaxed text-muted-foreground">
              <h3 className="font-display text-base text-foreground">
                What happens next?
              </h3>
              <ol className="mt-4 space-y-3">
                {[
                  "Intake review by a counsellor",
                  "Confirmation of which visa applies to you",
                  "An honest view on whether the case is worth making",
                  "Kickoff - case created in your portal"
                ].map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-xs font-semibold text-gold-700">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-xs leading-relaxed text-muted-foreground">
              This form creates an enquiry in our CRM. We advise on visitor and
              tourist visas only. Nothing here assesses your eligibility, and
              visa outcomes remain solely with the relevant immigration
              authority.
            </CardContent>
          </Card>
        </aside>
      </section>
    </>
  );
}

function Group({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 font-display text-lg">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold-500/10 text-gold-700">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  error,
  autoComplete,
  inputMode
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-1.5"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
