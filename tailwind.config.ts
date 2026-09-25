import type { Config } from "tailwindcss";

/**
 * Trust Gate Overseas — design system.
 * Semantic tokens (primary/accent/success/...) resolve to CSS variables
 * declared in src/app/globals.css. The raw `ink` / `gold` / `teal` / `ochre`
 * ramps below exist for the few places that need a fixed value regardless
 * of light/dark — hero surfaces, the admin rail, print.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    // Tailwind's smallest default breakpoint is 640px, which leaves the whole
    // 360–639px range — most of this audience's phones — with one set of
    // styles. `xs` gives that range its own step.
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1320px" }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          /* Gold Ink — use for gold *text* under 18px. Seal Gold fails AA there. */
          ink: "hsl(var(--accent-ink))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          tint: "hsl(var(--destructive-tint))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          tint: "hsl(var(--success-tint))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          tint: "hsl(var(--warning-tint))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },

        /* Passport Navy ramp — 900 is the brand ground #0F1B2D */
        ink: {
          50: "#F5F6F8",
          100: "#E8EAEF",
          200: "#CBD1DC",
          300: "#A3ACBF",
          400: "#77839C",
          500: "#5A6780",
          600: "#45516B",
          700: "#33415C",
          800: "#1B2B45",
          900: "#0F1B2D",
          950: "#08111D"
        },
        /* Seal Gold ramp — 500 is the CTA #B98B2E, 600 is Gold Ink #8A6518 */
        gold: {
          50: "#FBF7EE",
          100: "#F4EAD3",
          200: "#E7D2A3",
          300: "#D6B76D",
          400: "#C79E45",
          500: "#B98B2E",
          600: "#8A6518",
          700: "#6A4E13",
          800: "#48350D",
          900: "#291E07"
        },
        /* Stamp Teal — approval ink. Status only, never brand. */
        teal: {
          50: "#EFF6F5",
          100: "#E2EFEC",
          200: "#BFDCD7",
          300: "#8DBFB7",
          400: "#4E9389",
          500: "#1E6B63",
          600: "#18564F",
          700: "#12403B",
          800: "#0C2B27",
          900: "#061514"
        },
        /* Action Ochre — blocked on the client. Status only. */
        ochre: {
          50: "#FDF3EE",
          100: "#FBEBE2",
          200: "#F3CFBB",
          300: "#E5A882",
          400: "#CC6E3A",
          500: "#A8410F",
          600: "#8A360D",
          700: "#67280A",
          800: "#441B06",
          900: "#210D03"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        /* Newsreader — headlines only, never below 24px. */
        display: ["var(--font-display)", "ui-serif", "Georgia"],
        /* IBM Plex Mono — references, dates, statuses, eyebrows. */
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 3px)",
        sm: "calc(var(--radius) - 5px)"
      },
      boxShadow: {
        soft: "0 1px 2px hsl(216 50% 12% / 0.04), 0 4px 16px -6px hsl(216 50% 12% / 0.08)",
        elevated: "0 1px 2px hsl(216 50% 12% / 0.04), 0 16px 40px -28px hsl(216 50% 12% / 0.30)",
        ring: "0 0 0 1px hsl(var(--border))"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        /* The scan: the MRZ strip reads left to right once on load. */
        scan: {
          "0%": { transform: "translateX(-8%)", opacity: "0" },
          "18%": { opacity: "1" },
          "100%": { transform: "translateX(0)", opacity: "1" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
        "fade-in-up": "fade-in-up 0.7s ease-out both",
        scan: "scan 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 40s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
