/**
 * Demo case data for the Admin Dashboard and Client Portal.
 *
 * ⚠️ Development fixtures only. Every record below is invented for layout
 *    purposes and must be replaced by real database queries before launch.
 *    Never present these figures, names or cases as real.
 *
 * All records use the visitor / tourist visa vocabulary defined in
 * `@/lib/constants` - see APPLICATION_STATUSES for the canonical pipeline.
 */

export type DemoApplication = {
  reference: string;
  client: string;
  route: string;
  service: string;
  status: string;
  progress: number;
};

export const DEMO_APPLICATIONS: DemoApplication[] = [
  {
    reference: "TGO-2026-00482",
    client: "Priya S.",
    route: "UK → Schengen",
    service: "Schengen Tourist Visa",
    status: "Biometrics / VAC",
    progress: 70
  },
  {
    reference: "TGO-2026-00491",
    client: "Ananya K.",
    route: "India → UK",
    service: "UK Visitor Visa",
    status: "Documents Verified",
    progress: 50
  },
  {
    reference: "TGO-2026-00512",
    client: "Hassan M.",
    route: "UK → Canada",
    service: "Canada Visitor Visa",
    status: "Documents Requested",
    progress: 25
  },
  {
    reference: "TGO-2026-00533",
    client: "Maria S.",
    route: "UK → Australia",
    service: "Australia Visitor Visa",
    status: "Application Submitted",
    progress: 65
  },
  {
    reference: "TGO-2026-00544",
    client: "Devansh R.",
    route: "India → Schengen",
    service: "Schengen Tourist Visa",
    status: "Decision Pending",
    progress: 85
  },
  {
    reference: "TGO-2026-00556",
    client: "Sophie L.",
    route: "UK → USA",
    service: "USA Visitor Visa",
    status: "Documents Received",
    progress: 30
  },
  {
    reference: "TGO-2026-00561",
    client: "Nikhil T.",
    route: "UK → Turkey",
    service: "Turkey Tourist Visa",
    status: "Additional Information Requested",
    progress: 60
  },
  {
    reference: "TGO-2026-00573",
    client: "Aisha K.",
    route: "UK → New Zealand",
    service: "New Zealand Visitor Visa",
    status: "Decision Received",
    progress: 100
  }
];

export type DemoLead = {
  name: string;
  hub: string;
  interest: string;
  source: string;
  stage: string;
  owner: string;
};

export const DEMO_LEADS: DemoLead[] = [
  {
    name: "Ananya K.",
    hub: "India",
    interest: "UK Visitor Visa",
    source: "Website",
    stage: "Interested",
    owner: "Arjun M."
  },
  {
    name: "Rohan M.",
    hub: "United Kingdom",
    interest: "Schengen Tourist Visa",
    source: "Referral",
    stage: "Consultation Scheduled",
    owner: "Maya K."
  },
  {
    name: "Maria S.",
    hub: "United Kingdom",
    interest: "Australia Visitor Visa",
    source: "Eligibility Form",
    stage: "Documents Pending",
    owner: "Arjun M."
  },
  {
    name: "Hassan M.",
    hub: "United Kingdom",
    interest: "Canada Visitor Visa",
    source: "WhatsApp",
    stage: "New Lead",
    owner: "-"
  },
  {
    name: "Sophie L.",
    hub: "United Kingdom",
    interest: "USA Visitor Visa",
    source: "Website",
    stage: "Contacted",
    owner: "Maya K."
  },
  {
    name: "Devansh R.",
    hub: "India",
    interest: "Schengen Tourist Visa",
    source: "Website",
    stage: "Interested",
    owner: "Riya P."
  },
  {
    name: "Aisha K.",
    hub: "United Kingdom",
    interest: "New Zealand Visitor Visa",
    source: "Referral",
    stage: "Converted",
    owner: "Arjun M."
  },
  {
    name: "Nikhil T.",
    hub: "United Kingdom",
    interest: "UK Visa Extension",
    source: "Eligibility Form",
    stage: "Not Interested",
    owner: "-"
  }
];

/** Route split for the admin overview chart. */
export const DEMO_ROUTE_SPLIT = [
  { label: "UK → Schengen", value: 34 },
  { label: "India → UK", value: 21 },
  { label: "UK → USA", value: 14 },
  { label: "UK → Canada", value: 11 },
  { label: "India → Schengen", value: 10 },
  { label: "Other routes", value: 10 }
];

/** The single demo case shown throughout the Client Portal. */
export const DEMO_CLIENT_CASE = {
  clientName: "Priya Sharma",
  reference: "TGO-2026-00482",
  route: "UK → Schengen",
  service: "Schengen Tourist Visa",
  destination: "Schengen",
  counsellor: "Arjun Mehta",
  progress: 70,
  currentStatus: "Biometrics completed · awaiting decision",
  timeline: [
    {
      status: "Consultation Completed",
      detail: "Route confirmed and travel dates reviewed.",
      date: "Jan 14, 2026",
      done: true
    },
    {
      status: "Documents Requested",
      detail: "Checklist issued for your nationality and travel purpose.",
      date: "Jan 18, 2026",
      done: true
    },
    {
      status: "Documents Received",
      detail: "18 documents uploaded to the portal.",
      date: "Jan 28, 2026",
      done: true
    },
    {
      status: "Documents Verified",
      detail: "All documents reviewed by your counsellor.",
      date: "Feb 02, 2026",
      done: true
    },
    {
      status: "Application Prepared",
      detail: "Application assembled with a covering explanation.",
      date: "Mar 18, 2026",
      done: true
    },
    {
      status: "Application Submitted",
      detail: "Lodged with the consulate of your main destination.",
      date: "Mar 21, 2026",
      done: true
    },
    {
      status: "Biometrics / VAC",
      detail: "Biometrics enrolled at the visa application centre.",
      date: "Apr 09, 2026",
      done: true
    },
    {
      status: "Decision Pending",
      detail: "With the consulate. No action needed from you.",
      date: "Awaiting",
      done: false
    },
    {
      status: "Decision Received",
      detail: "Outcome passed on as soon as it reaches us.",
      date: "-",
      done: false
    }
  ]
};
