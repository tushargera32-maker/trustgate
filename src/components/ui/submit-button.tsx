"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * SubmitButton — reads the real pending state of the enclosing <form>.
 *
 * Why this exists: on React 18, `useFormState` returns a two-element tuple
 * `[state, formAction]`. Both public forms were destructuring a third element
 * as `pending`, which is always `undefined` there, so the button never
 * disabled and never showed progress — leaving double-submits possible.
 * `useFormStatus` is the React 18 way to get that value, and it only works in
 * a component rendered *inside* the form, which is why this is its own file.
 */
export function SubmitButton({
  children,
  pendingLabel,
  ...props
}: ButtonProps & { pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
