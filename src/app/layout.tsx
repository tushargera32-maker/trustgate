import type { Metadata } from "next";
import { Inter, Newsreader, IBM_Plex_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { Providers } from "@/components/providers";
import { GlobalJsonLd } from "@/components/seo/json-ld";
import "./globals.css";

/**
 * Three faces, one role each.
 *   Newsreader     — headlines only, never below 24px.
 *   Inter          — body, forms, navigation, tables.
 *   IBM Plex Mono  — references, dates, statuses, eyebrows.
 * See the design direction document, section 02.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
  // Next 14 ships a fixed font-metrics table used to build a size-adjusted
  // local fallback; Newsreader is not in it, which produces the
  // "Failed to find font override values" warning. Opting out of the
  // automatic fallback silences it and lets us pick the stack ourselves.
  // Georgia is the closest widely-installed match in width and colour.
  adjustFontFallback: false,
  fallback: ["Georgia", "Times New Roman", "serif"]
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFDFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1B2D" }
  ],
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "visitor visa consultant",
    "tourist visa",
    "Schengen tourist visa",
    "UK Standard Visitor visa",
    "Australia visitor visa",
    "New Zealand visitor visa",
    "Canada visitor visa",
    "USA visitor visa",
    "Turkey tourist visa",
    "UK visa extension"
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description
  },
  category: "Travel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <GlobalJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
