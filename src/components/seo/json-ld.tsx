import { siteConfig } from "@/lib/site-config";
import { organisationSchema, websiteSchema, jsonLd } from "@/lib/seo";

export function GlobalJsonLd() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={jsonLd(organisationSchema(), websiteSchema())}
    />
  );
}