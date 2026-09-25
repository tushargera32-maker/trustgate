"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters")
});

type FormValues = z.infer<typeof schema>;

function ClientLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/client";
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl
    });
    setSubmitting(false);
    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(res.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <section className="relative isolate flex min-h-[calc(100vh-4rem)] items-center bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold-300/30 blur-3xl" />
      </div>
      <div className="container-edge grid items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <Badge />
          <h1 className="mt-5 font-display text-4xl leading-tight text-balance sm:text-5xl">
            Sign in to your Trust Gate portal.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Track your application timeline, upload requested documents, and
            communicate securely with your assigned counsellor.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Real-time application status",
              "Secure document upload",
              "Encrypted messaging with your counsellor"
            ].map((b) => (
              <li key={b} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/15 text-teal-600">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-elevated mx-auto w-full max-w-md rounded-2xl p-8 sm:p-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-base">
              Client Portal
            </span>
          </div>
          <h2 className="mt-6 font-display text-2xl">
            Welcome back.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with the credentials provided by your counsellor.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-7 space-y-4"
            noValidate
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* No /client/forgot-password route and no reset flow exists
                    yet, so this 404'd for a locked-out client. Route to the
                    channel that can actually help until self-serve reset is
                    built, then restore the link. */}
                <Link
                  href="/contact"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="pl-9"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Not a client yet?{" "}
            <Link
              href="/eligibility"
              className="font-medium text-foreground hover:underline"
            >
              Check your eligibility
            </Link>
            .
          </p>

          <div className="mt-6 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Demo credentials:</span>{" "}
            <code className="rounded bg-card px-1.5 py-0.5">
              client@demo.com / demo1234
            </code>
            <br />
            <code className="rounded bg-card px-1.5 py-0.5">
              admin@demo.com / demo1234
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ClientLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ClientLoginForm />
    </Suspense>
  );
}

function Badge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-gold-50 px-3 py-1 text-xs font-medium text-gold-800">
      <ShieldCheck className="h-3.5 w-3.5" /> Secure login
    </span>
  );
}
