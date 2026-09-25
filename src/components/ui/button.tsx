import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Seal Gold is the only call-to-action colour on the site, and it pairs with
 * navy text — never white. That single rule is what keeps it reading as
 * antique gold rather than as a warning amber. No gradients: the flat fill is
 * what makes it look like foil rather than a SaaS button.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* The primary action. Gold on navy text. */
        default: "bg-accent text-accent-foreground hover:bg-gold-400",
        accent: "bg-accent text-accent-foreground hover:bg-gold-400",
        gold: "bg-accent text-accent-foreground hover:bg-gold-400",
        /* The secondary action. Navy fill, for use on light surfaces. */
        navy: "bg-primary text-primary-foreground hover:bg-ink-800",
        outline:
          "border border-border bg-transparent hover:bg-secondary hover:text-secondary-foreground",
        /* For use on the navy hero — a hairline that does not fight the gold. */
        "outline-invert":
          "border border-white/25 bg-transparent text-white hover:bg-white/10",
        secondary: "bg-secondary text-secondary-foreground hover:bg-gold-100",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-accent-ink underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-ochre-600"
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3.5 text-[13px]",
        lg: "h-12 rounded-lg px-7 text-[15px]",
        xl: "h-14 rounded-lg px-8 text-base font-semibold",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };