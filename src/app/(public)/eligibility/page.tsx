"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  RotateCcw,
  FileText,
  Info,
  ExternalLink,
  Compass
} from "lucide-react";
import { PageHero } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  STEPS,
  assess,
  OUTCOME_TONE,
  type Answers,
  type AnswerKey,
  type Assessment
} from "@/lib/eligibility";
import { submitEligibilityResult } from "@/app/actions/leads";

export default function EligibilityPage() {
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [result, setResult] = React.useState<Assessment | null>(null);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const total = STEPS.length;
  const current = STEPS[step];
  const canContinue = current ? Boolean(answers[current.id]) : false;
  const pct = Math.round(((result ? total : step) / total) * 100);

  /* The question heading takes focus on each step. Without this a keyboard
     or screen-reader user is left at the top of the document after every
     answer and has to re-traverse the page to find what changed. */
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => {
    headingRef.current?.focus();
  }, [step, result]);

  function set(key: AnswerKey, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  function next() {
    if (step === total - 1) setResult(assess(answers));
    else setStep((s) => s + 1);
  }

  function back() {
    if (result) {
      setResult(null);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setResult(null);
    setSaved(false);
    setSaveError(null);
  }

  /* Arrow keys move between options, which is what a radio group is
     expected to do. Previously these were plain buttons, so a keyboard
     user had to tab through every option on every step. */
  function onOptionKeyDown(e: React.KeyboardEvent, index: number) {
    if (!current) return;
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const forward = e.key === "ArrowDown" || e.key === "ArrowRight";
    const nextIndex =
      (index + (forward ? 1 : -1) + current.options.length) %
      current.options.length;
    set(current.id, current.options[nextIndex].value);
    const group = e.currentTarget.parentElement;
    (group?.children[nextIndex] as HTMLElement | undefined)?.focus();
  }

  async function handleSave() {
    if (!result || !name || !email) return;
    setSaving(true);
    setSaveError(null);
    const res = await submitEligibilityResult({
      name,
      email,
      phone: phone || undefined,
      answers: answers as Record<string, string>,
      outcome: result.outcome,
      flags: result.flags
    });
    setSaving(false);
    if (res.ok) setSaved(true);
    else setSaveError(res.error);
  }

  return (
    <>
      <PageHero
        eyebrow="Eligibility check"
        title="Find the route that fits your trip."
        description="A short, free triage. It tells you whether your case is one we handle, what would strengthen it, and what to do next — it is not a prediction of the decision."
      />

      <section className="container-edge my-12">
        <div className="mx-auto max-w-3xl">
          {/* ---- progress ---- */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-data" aria-live="polite">
                {result ? "Result" : `Step ${step + 1} of ${total}`}
              </span>
              <span className="font-data">{pct}%</span>
            </div>
            <div
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Eligibility check progress"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                animate={{ width: `${pct}%` }}
                transition={{ duration: reduce ? 0 : 0.4 }}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key={current.id}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: reduce ? 0 : 0.25 }}
                  >
                    <h2
                      ref={headingRef}
                      tabIndex={-1}
                      id={`q-${current.id}`}
                      className="font-display text-2xl outline-none"
                    >
                      {current.question}
                    </h2>
                    {current.help && (
                      <p
                        id={`help-${current.id}`}
                        className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground"
                      >
                        {current.help}
                      </p>
                    )}

                    <div className="mt-7">
                      {current.type === "select" ? (
                        <div className="max-w-sm">
                          <Label htmlFor={`sel-${current.id}`} className="sr-only">
                            {current.question}
                          </Label>
                          <select
                            id={`sel-${current.id}`}
                            aria-describedby={
                              current.help ? `help-${current.id}` : undefined
                            }
                            className="flex h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={answers[current.id] ?? ""}
                            onChange={(e) => set(current.id, e.target.value)}
                          >
                            <option value="">Select a destination…</option>
                            {current.options.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                          {answers[current.id] && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              {
                                current.options.find(
                                  (o) => o.value === answers[current.id]
                                )?.hint
                              }
                            </p>
                          )}
                        </div>
                      ) : (
                        <div
                          role="radiogroup"
                          aria-labelledby={`q-${current.id}`}
                          aria-describedby={
                            current.help ? `help-${current.id}` : undefined
                          }
                          className="grid gap-2 sm:grid-cols-2"
                        >
                          {current.options.map((o, i) => {
                            const active = answers[current.id] === o.value;
                            return (
                              <button
                                key={o.value}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                tabIndex={
                                  active || (!answers[current.id] && i === 0)
                                    ? 0
                                    : -1
                                }
                                onKeyDown={(e) => onOptionKeyDown(e, i)}
                                onClick={() => set(current.id, o.value)}
                                className={
                                  "flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all " +
                                  (active
                                    ? "border-gold-500 bg-gold-500/5 ring-1 ring-gold-500/40"
                                    : "border-border bg-card hover:bg-secondary/30")
                                }
                              >
                                <span>
                                  <span className="font-medium">{o.label}</span>
                                  {o.hint && (
                                    <span className="mt-0.5 block text-xs font-normal leading-snug text-muted-foreground">
                                      {o.hint}
                                    </span>
                                  )}
                                </span>
                                {active && (
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-3">
                      <Button
                        variant="ghost"
                        onClick={back}
                        disabled={step === 0}
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button
                        onClick={next}
                        disabled={!canContinue}
                        variant="gold"
                      >
                        {step === total - 1 ? "See my result" : "Next"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <ResultView
                    key="result"
                    result={result}
                    reduce={Boolean(reduce)}
                    headingRef={headingRef}
                    name={name}
                    email={email}
                    phone={phone}
                    saving={saving}
                    saved={saved}
                    saveError={saveError}
                    onName={setName}
                    onEmail={setEmail}
                    onPhone={setPhone}
                    onSave={handleSave}
                    onBack={back}
                    onRestart={restart}
                  />
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

/* ───────────────────────── Result ───────────────────────── */

function ResultView({
  result,
  reduce,
  headingRef,
  name,
  email,
  phone,
  saving,
  saved,
  saveError,
  onName,
  onEmail,
  onPhone,
  onSave,
  onBack,
  onRestart
}: {
  result: Assessment;
  reduce: boolean;
  headingRef: React.RefObject<HTMLHeadingElement>;
  name: string;
  email: string;
  phone: string;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onPhone: (v: string) => void;
  onSave: () => void;
  onBack: () => void;
  onRestart: () => void;
}) {
  const tone = OUTCOME_TONE[result.outcome];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
    >
      {/* ---- verdict ---- */}
      <div className="text-center">
        <Badge
          variant="outline"
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${tone.className}`}
        >
          {tone.label}
        </Badge>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-balance font-display text-3xl outline-none"
        >
          {result.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
          {result.summary}
        </p>
      </div>

      {/* ---- what is working / what needs work ----
          Both columns are shown together deliberately. A list of problems
          with no counterweight reads as a rejection even when it is not
          one, and a list of positives with no counterweight is a sales
          page rather than an assessment. */}
      {(result.strengths.length > 0 || result.watchPoints.length > 0) && (
        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {result.strengths.length > 0 && (
            <FindingList
              title="Working in your favour"
              tone="positive"
              items={result.strengths}
            />
          )}
          {result.watchPoints.length > 0 && (
            <FindingList
              title="What to prepare for"
              tone="attention"
              items={result.watchPoints}
            />
          )}
        </div>
      )}

      {/* ---- next steps ---- */}
      <div className="surface-inset mt-4 p-6 text-left">
        <h3 className="flex items-center gap-2 font-display text-base">
          <Compass className="h-4 w-4 text-accent-ink" />
          Your next step
        </h3>
        <ol className="mt-4 space-y-3">
          {result.nextSteps.map((s, i) => (
            <li key={s} className="flex gap-3 text-sm leading-relaxed">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/10 font-data text-[11px] font-semibold text-gold-700">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ---- the route(s) ---- */}
      {(result.primaryService || result.alternatives.length > 0) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {result.primaryService && (
            <RouteCard
              href={result.primaryService.href}
              name={result.primaryService.name}
              reason="The desk we would run this under."
              primary
            />
          )}
          {result.alternatives.map((alt) => (
            <RouteCard
              key={alt.slug}
              href={alt.href}
              name={alt.name}
              reason={alt.reason ?? "Another route we run."}
            />
          ))}
        </div>
      )}

      {/* ---- documents ---- */}
      {result.documents.length > 0 && (
        <div className="surface mt-4 p-6 text-left">
          <h3 className="flex items-center gap-2 font-display text-base">
            <FileText className="h-4 w-4 text-accent-ink" />
            What you will typically need
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Published for this service. We confirm the exact list on the
            consultation, once we know your circumstances.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {result.documents.map((d) => (
              <li
                key={d}
                className="flex gap-2 text-sm leading-snug text-muted-foreground"
              >
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- service considerations ---- */}
      {result.considerations.length > 0 && (
        <div className="surface-inset mt-4 p-6 text-left">
          <h3 className="flex items-center gap-2 font-display text-base">
            <Info className="h-4 w-4 text-accent-ink" />
            Worth knowing about this route
          </h3>
          <ul className="mt-4 space-y-2.5">
            {result.considerations.map((c) => (
              <li key={c} className="text-sm leading-relaxed text-muted-foreground">
                {c}
              </li>
            ))}
          </ul>
          {result.officialSource && (
            <a
              href={result.officialSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-ink hover:underline"
            >
              {result.officialSource.name}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}

      {/* ---- capture ---- */}
      <Card className="mt-4 text-left">
        <CardContent className="p-6">
          {saved ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-teal-600" />
              <p className="font-display text-base">Result sent</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                A counsellor has your answers and will come back within one
                business day.
              </p>
              <Button asChild variant="gold" className="mt-2">
                <Link href="/contact">Book a consultation now</Link>
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-base">Send this to a counsellor</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                They will have your answers before you speak, so the call
                starts somewhere useful. One business day, no charge.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <Label htmlFor="res-name">Full name</Label>
                  <Input
                    id="res-name"
                    name="name"
                    autoComplete="name"
                    className="mt-1.5"
                    value={name}
                    onChange={(e) => onName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="res-email">Email</Label>
                  <Input
                    id="res-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className="mt-1.5"
                    value={email}
                    onChange={(e) => onEmail(e.target.value)}
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="res-phone">
                    Phone{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="res-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className="mt-1.5"
                    value={phone}
                    onChange={(e) => onPhone(e.target.value)}
                    placeholder="+44 7700 900000"
                  />
                </div>
              </div>
              {saveError && (
                <p
                  role="alert"
                  className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
                >
                  {saveError}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-600" />
                  Confidential. Not shared.
                </p>
                <Button
                  variant="gold"
                  disabled={!email || !name || saving}
                  onClick={onSave}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send my result"
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ---- escape hatches ---- */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Change my last answer
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
          Start again
        </Button>
        <Button asChild variant="ghost">
          <Link href="/countries">Browse destinations</Link>
        </Button>
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
        This is a preliminary triage for general guidance only. It is not
        legal advice, it does not assess your eligibility against any
        immigration rule, and it says nothing about whether an application
        would be granted. Visa decisions are made solely by the relevant
        immigration authority.
      </p>
    </motion.div>
  );
}

/* ───────────────────────── Small parts ───────────────────────── */

function FindingList({
  title,
  tone,
  items
}: {
  title: string;
  tone: "positive" | "attention";
  items: { title: string; detail: string }[];
}) {
  const positive = tone === "positive";
  return (
    <div className="surface p-6 text-left">
      <h3 className="font-display text-base">{title}</h3>
      <ul className="mt-4 space-y-4">
        {items.map((f) => (
          <li key={f.title}>
            <div className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className={
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full " +
                  (positive ? "bg-teal-500" : "bg-gold-500")
                }
              />
              <div>
                <p className="text-sm font-medium leading-snug">{f.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {f.detail}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RouteCard({
  href,
  name,
  reason,
  primary
}: {
  href: string;
  name: string;
  reason: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "surface-interactive group flex flex-col justify-between gap-3 p-5 text-left " +
        (primary ? "border-gold-500/40" : "")
      }
    >
      <div>
        {primary && (
          <span className="label-data text-accent-ink">Recommended route</span>
        )}
        <p className="mt-1 font-display text-base leading-snug">{name}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          {reason}
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-ink">
        See what this involves
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
