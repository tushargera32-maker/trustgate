import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          System
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Brand, contact, integrations. Sensitive keys live in environment
          variables - never in this UI.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-base">Brand</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Brand name</Label>
              <Input className="mt-1.5" defaultValue="Trust Gate Overseas" />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input className="mt-1.5" defaultValue="Engineered pathways to global residency." />
            </div>
          </div>
          <div className="mt-4">
            <Label>Public description</Label>
            <Textarea
              className="mt-1.5"
              defaultValue="A premium immigration consultancy combining deep regulatory expertise with technology-driven case management."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-base">Contact</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Contact email</Label>
              <Input className="mt-1.5" defaultValue="hello@trustgate.example" />
            </div>
            <div>
              <Label>Contact phone</Label>
              <Input className="mt-1.5" defaultValue="+1 000 000 0000" />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input className="mt-1.5" defaultValue="+10000000000" />
            </div>
            <div>
              <Label>Office address</Label>
              <Input className="mt-1.5" defaultValue="Level 12, Business Bay, Mumbai, India" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-base">Integrations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These integrations are environment-variable driven. Edit{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
              .env.local
            </code>{" "}
            to configure.
          </p>
          <ul className="mt-5 space-y-2">
            {[
              ["Razorpay (Payments)", "Set RAZORPAY_* env vars"],
              ["WhatsApp Business", "Set WHATSAPP_API_* env vars"],
              ["Email (SMTP)", "Set SMTP_* env vars"],
              ["Object Storage (S3)", "Set S3_* env vars"],
              ["Google Analytics", "Set NEXT_PUBLIC_GA_ID"],
              ["Meta Pixel", "Set NEXT_PUBLIC_META_PIXEL_ID"]
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3"
              >
                <span className="text-sm font-medium">{k}</span>
                <span className="text-xs text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save settings</Button>
      </div>
    </div>
  );
}