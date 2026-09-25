/**
 * Trust Gate Overseas — eligibility triage engine.
 *
 * ─────────────────────────────────────────────────────────────
 * WHAT THIS IS, AND WHAT IT IS DELIBERATELY NOT
 * ─────────────────────────────────────────────────────────────
 * This module decides ONE thing: whether an enquiry is work Trust Gate
 * can take, and what the client should do next. It is a routing and
 * intake tool.
 *
 * It does NOT assess anyone against an immigration rule, and it must
 * never be extended to do so. Nothing in this file states a financial
 * threshold, a processing time, a refusal cooling-off period, an
 * approval rate, or any other rule-derived figure — those change without
 * notice, they differ by nationality and post, and getting one wrong in
 * a client's favour is how a consultancy ends up in front of a
 * regulator.
 *
 * Every substantive statement produced here comes from one of three
 * places, all of them safe:
 *   1. The firm's own published service catalogue (`src/lib/constants.ts`),
 *      which the business already stands behind on the public site.
 *   2. Process and logistics observations that are true regardless of
 *      the rules (appointment slots are finite; documents take time to
 *      gather; undisclosed refusals cause more damage than disclosed ones).
 *   3. The client's own answers, reflected back.
 *
 * ─────────────────────────────────────────────────────────────
 * DESIGN PRINCIPLE: NO DEAD ENDS
 * ─────────────────────────────────────────────────────────────
 * The previous version returned OUT_OF_SCOPE — a flat "probably not one
 * for us" — in two cases that were both wrong:
 *
 *   a) purpose === "other", even though that option is labelled "Other
 *      short-stay purpose", which is precisely this firm's practice area.
 *   b) any origin/destination pair without a published service, which
 *      rejected every India-based enquiry for Australia, New Zealand,
 *      Canada, the USA and Turkey outright.
 *
 * A visitor-visa enquiry is now never rejected by a form. Where the firm
 * does not run a published desk for a pair, the engine says so honestly
 * and routes to a conversation rather than closing the door. Where the
 * enquiry is genuinely outside visitor and tourist work — study, work,
 * settlement — it refers out plainly, because taking that enquiry would
 * be worse for everyone.
 *
 * Being solution-oriented means finding the client a route. It does not
 * mean telling them what they want to hear.
 */

import {
  SERVICES,
  ORIGIN_HUBS,
  DESTINATIONS,
  type Service
} from "@/lib/constants";

/* ───────────────────────── Questions ───────────────────────── */

export type Step = {
  id: AnswerKey;
  question: string;
  help?: string;
  type: "select" | "radio";
  options: { value: string; label: string; hint?: string }[];
};

export type AnswerKey =
  | "hub"
  | "destination"
  | "purpose"
  | "dates"
  | "funding"
  | "history"
  | "refusal";

export type Answers = Partial<Record<AnswerKey, string>>;

/** Destination options, derived from the published catalogue so the form
 *  can never offer a destination the site does not otherwise mention. */
const DESTINATION_OPTIONS = (() => {
  const seen = new Map<string, { value: string; label: string; hint?: string }>();
  for (const d of DESTINATIONS) {
    seen.set(d.code, {
      value: d.code,
      label: `${d.flag}  ${d.name}`,
      hint: d.stayNote
    });
  }
  return Array.from(seen.values());
})();

export const STEPS: Step[] = [
  {
    id: "hub",
    question: "Where are you applying from?",
    help: "This is where you live and where you would lodge the application — not your nationality.",
    type: "radio",
    options: ORIGIN_HUBS.map((h) => ({
      value: h.slug,
      label: `${h.flag}  ${h.name}`,
      hint: h.blurb
    }))
  },
  {
    id: "destination",
    question: "Where are you travelling to?",
    help: "Pick your main destination. If you are visiting several countries on one trip, choose the one you will spend the most time in.",
    type: "select",
    options: DESTINATION_OPTIONS
  },
  {
    id: "purpose",
    question: "What is the purpose of your trip?",
    help: "We work on visitor and tourist visas. Knowing the purpose tells us straight away whether this is ours to handle.",
    type: "radio",
    options: [
      { value: "tourism", label: "Tourism or a holiday" },
      { value: "family", label: "Visiting family or friends" },
      { value: "business-short", label: "A short business visit" },
      {
        value: "other-short",
        label: "Another short visit",
        hint: "A wedding, a conference, medical treatment, a short course"
      },
      {
        value: "long-stay",
        label: "Studying, working or moving permanently",
        hint: "We will point you to the right kind of firm"
      }
    ]
  },
  {
    id: "dates",
    question: "How firm are your travel dates?",
    help: "Appointment availability is often the real constraint, not the decision itself. The earlier we know, the more room we have.",
    type: "radio",
    options: [
      { value: "booked", label: "Booked, or about to book" },
      { value: "planned", label: "Planned — more than six weeks away" },
      { value: "soon", label: "Travelling within three weeks" },
      { value: "flexible", label: "Flexible — still exploring" }
    ]
  },
  {
    id: "funding",
    question: "Who is paying for the trip?",
    help: "There is no better or worse answer here. It only changes whose documents we need.",
    type: "radio",
    options: [
      { value: "self", label: "Me, from my own funds" },
      { value: "sponsor", label: "A host, family member or friend" },
      { value: "employer", label: "My employer" },
      { value: "unsure", label: "Not settled yet" }
    ]
  },
  {
    id: "history",
    question: "Have you travelled internationally in the last five years?",
    type: "radio",
    options: [
      { value: "yes-similar", label: "Yes — to comparable destinations" },
      { value: "yes-other", label: "Yes — elsewhere" },
      { value: "no", label: "No, this would be my first trip" }
    ]
  },
  {
    id: "refusal",
    question: "Have you ever been refused a visa, or refused entry?",
    help: "A previous refusal is not fatal. Concealing one is far more damaging.",
    type: "radio",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
      { value: "unsure", label: "I am not sure" }
    ]
  }
];

/* ───────────────────────── Result shape ───────────────────────── */

export type OutcomeCode =
  /** Published desk for this pair, and nothing in the answers needs unusual handling. */
  | "ROUTE_MATCHED"
  /** Published desk for this pair, with points that need building properly. */
  | "ROUTE_MATCHED_WITH_CARE"
  /** Visitor work, but no published desk for this exact pair. Honest, not a rejection. */
  | "ROUTE_UNPUBLISHED"
  /** Outside visitor and tourist work entirely. Referred out. */
  | "SCOPE_REFERRAL";

export type Finding = {
  /** Short, scannable. Sentence case, no trailing period. */
  title: string;
  /** One or two sentences. For watch points, this says what to do about it. */
  detail: string;
};

export type ServiceLink = {
  slug: string;
  name: string;
  href: string;
  /** Why this one is being shown — only set for alternatives. */
  reason?: string;
};

export type Assessment = {
  outcome: OutcomeCode;
  /** The one-line verdict. Never a bare rejection. */
  headline: string;
  /** Two or three sentences expanding on the headline. */
  summary: string;
  /** What is already working in this enquiry's favour. */
  strengths: Finding[];
  /** What needs attention — each one carries the fix, not just the flag. */
  watchPoints: Finding[];
  /** Concrete actions, in order. Always at least one. */
  nextSteps: string[];
  /** The service we would run this under, where one exists. */
  primaryService: ServiceLink | null;
  /** Other routes worth showing. Empty when the primary is a clean match. */
  alternatives: ServiceLink[];
  /** Straight from the matched service's published catalogue entry. */
  documents: string[];
  considerations: string[];
  officialSource: { name: string; url: string } | null;
  /** Machine-readable trail, stored on EligibilityResult.matchedRules. */
  flags: string[];
};

/* ───────────────────────── Helpers ───────────────────────── */

const href = (s: Service): ServiceLink => ({
  slug: s.slug,
  name: s.name,
  href: `/services/${s.slug}`
});

function hubName(hub?: string) {
  return ORIGIN_HUBS.find((h) => h.slug === hub)?.name ?? "your location";
}

function destinationName(code?: string) {
  return DESTINATIONS.find((d) => d.code === code)?.name ?? "your destination";
}

/** The published service for an exact origin → destination pair, if any. */
function exactService(hub?: string, destination?: string) {
  return SERVICES.find(
    (s) => s.published && s.hub === hub && s.destinationCode === destination
  );
}

/**
 * The catch-all desk for a hub, where the firm runs one.
 *
 * The UK hub publishes a "Worldwide" service, which genuinely does cover
 * destinations without a dedicated desk — that is what it is for. The
 * India hub does not publish one, so no catch-all is invented for it.
 */
function catchAllService(hub?: string) {
  return SERVICES.find(
    (s) => s.published && s.hub === hub && s.destinationCode === "WW"
  );
}

/** The same destination, handled from the firm's other hub. */
function sameDestinationOtherHub(hub?: string, destination?: string) {
  return SERVICES.find(
    (s) => s.published && s.hub !== hub && s.destinationCode === destination
  );
}

/* ───────────────────────── Findings ───────────────────────── */

function collectStrengths(a: Answers): Finding[] {
  const out: Finding[] = [];

  if (a.history === "yes-similar") {
    out.push({
      title: "You have a comparable travel record",
      detail:
        "Previous trips to similar destinations, returned from on time, are among the most useful things a visitor file can show. Bring the old passports."
    });
  } else if (a.history === "yes-other") {
    out.push({
      title: "You have travelled before",
      detail:
        "An existing travel record gives us something to build on. We will work out which of those trips are worth putting in front of the decision maker."
    });
  }

  if (a.refusal === "no") {
    out.push({
      title: "No refusal history to explain",
      detail:
        "That keeps the file simple. We can spend the effort on evidence rather than on addressing a previous decision."
    });
  }

  if (a.dates === "planned" || a.dates === "flexible") {
    out.push({
      title: "You have time on your side",
      detail:
        "Starting before dates are locked is the single biggest advantage a visitor applicant can give themselves. It means appointment availability shapes the plan rather than breaking it."
    });
  }

  if (a.funding === "self") {
    out.push({
      title: "You are funding the trip yourself",
      detail:
        "One set of financial documents, one story. That is the most straightforward funding position to evidence."
    });
  }

  if (a.funding === "employer") {
    out.push({
      title: "Your employer is funding the trip",
      detail:
        "Employer-funded travel usually comes with documentation that is already written and already signed — which is a head start."
    });
  }

  if (a.purpose === "family" || a.purpose === "tourism") {
    out.push({
      title: "A clear, ordinary purpose",
      detail:
        "Tourism and family visits are the core of what this practice does. There is nothing unusual to explain about why you are going."
    });
  }

  return out;
}

function collectWatchPoints(a: Answers): Finding[] {
  const out: Finding[] = [];

  if (a.dates === "soon") {
    out.push({
      title: "The timeline is tight",
      detail:
        "Travelling within three weeks compresses everything. Appointment slots, not the decision, are usually what runs out first. Tell us your dates on the call and we will say honestly whether it is achievable before you spend anything."
    });
  }

  if (a.dates === "booked") {
    out.push({
      title: "Travel is already booked",
      detail:
        "That fixes the deadline, so we work backwards from it. Have your booking references to hand for the consultation."
    });
  }

  if (a.funding === "unsure") {
    out.push({
      title: "Funding is not settled yet",
      detail:
        "This is worth resolving before anything else, because it decides whose bank statements and letters we need. Deciding it early is usually a few days' work, not a problem."
    });
  }

  if (a.funding === "sponsor") {
    out.push({
      title: "A third party is funding the trip",
      detail:
        "Sponsored trips are completely normal and we handle them constantly. Plan for your host's documents as well as your own — their evidence carries as much weight as yours."
    });
  }

  if (a.history === "no") {
    out.push({
      title: "This would be your first international trip",
      detail:
        "Not a weakness, but it does mean the rest of the file carries more of the load. We will focus on evidencing your circumstances at home rather than a travel record you do not have yet."
    });
  }

  if (a.refusal === "yes") {
    out.push({
      title: "There is a previous refusal to address",
      detail:
        "This is workable, and rebuilding refused files is a large part of what this practice does. Bring the refusal notice itself — the wording of it decides how we approach the new application."
    });
  }

  if (a.refusal === "unsure") {
    out.push({
      title: "Refusal history needs checking",
      detail:
        "Before anything is submitted we need certainty here, because an undisclosed refusal does far more damage than a disclosed one. We will help you establish what is on record."
    });
  }

  return out;
}

/* ───────────────────────── The engine ───────────────────────── */

export function assess(answers: Answers): Assessment {
  const { hub, destination, purpose } = answers;

  const flags: string[] = [];
  const strengths = collectStrengths(answers);
  const watchPoints = collectWatchPoints(answers);

  for (const [k, v] of Object.entries(answers)) {
    if (v) flags.push(`${k}:${v}`);
  }

  /* ---- 1. Genuinely outside the practice ------------------------------
     The only honest rejection in the engine. Study, work and settlement
     are not visitor visas, this firm does not do them, and pretending
     otherwise would waste the client's time and money. Even here the
     result is a direction to go in, not a closed door. */
  if (purpose === "long-stay") {
    flags.push("outcome:scope_referral");
    return {
      outcome: "SCOPE_REFERRAL",
      headline: "This one needs a different kind of firm",
      summary:
        "Studying, working or settling permanently are long-stay routes, and this practice handles visitor and tourist visas only. We would rather tell you that now than take the enquiry and work it out later.",
      strengths: [],
      watchPoints: [],
      nextSteps: [
        `Check the official requirements for ${destinationName(destination)} directly with that country's immigration authority, linked from our destination pages.`,
        "Look for a firm regulated to advise on long-stay and settlement routes in your country — the regulator's own register is the safest place to search.",
        "If your plans also include a short visit before the move, come back to us. That part we can help with."
      ],
      primaryService: null,
      alternatives: [],
      documents: [],
      considerations: [],
      officialSource:
        DESTINATIONS.find((d) => d.code === destination)?.source ?? null,
      flags
    };
  }

  const matched = exactService(hub, destination);

  /* ---- 2. No published desk for this exact pair -----------------------
     Previously an automatic rejection, which closed the door on every
     India-based enquiry outside Schengen and the UK. It is still an
     honest "we do not publish this desk" — the catalogue is not extended
     here — but it routes to a conversation instead of ending the flow. */
  if (!matched) {
    const catchAll = catchAllService(hub);
    const otherHub = sameDestinationOtherHub(hub, destination);

    if (catchAll) {
      /* The hub runs a worldwide desk, which is exactly the case this
         service exists for. This is a real match, not a consolation. */
      flags.push("outcome:route_matched", "route:catch_all");
      return buildMatched(
        catchAll,
        answers,
        strengths,
        watchPoints,
        flags,
        `${destinationName(destination)} does not have its own page on our site, but it is covered by our worldwide desk — which is what that service is for. We confirm the current requirements against the destination's official source before you pay for anything.`,
        []
      );
    }

    flags.push("outcome:route_unpublished");

    const alternatives: ServiceLink[] = [];
    if (otherHub) {
      alternatives.push({
        ...href(otherHub),
        reason: `We run this destination from ${hubName(otherHub.hub)}. If you hold status there, this may be your route.`
      });
    }
    for (const s of SERVICES.filter((s) => s.published && s.hub === hub)) {
      if (alternatives.length >= 3) break;
      alternatives.push({
        ...href(s),
        reason: `A published desk from ${hubName(hub)}.`
      });
    }

    /* "Worldwide" is a catch-all rather than a place, so it needs its own
       phrasing — "a dedicated India to Worldwide desk" is not English. */
    const routePhrase =
      destination === "WW"
        ? `a desk in ${hubName(hub)} for destinations outside our core routes`
        : `a dedicated ${hubName(hub)} to ${destinationName(destination)} desk`;

    return {
      outcome: "ROUTE_UNPUBLISHED",
      headline: "We do not publish this exact route — but do not write it off",
      summary: `We do not run ${routePhrase}, so we are not going to pretend on a form that we do. What you are describing is still a short-stay visitor application, which is the only thing this practice does. Whether we can take it is a question for a person, not a questionnaire.`,
      strengths,
      watchPoints,
      nextSteps: [
        "Send us the result below — it takes a minute and it gives the counsellor everything you have already told us.",
        "We will come back within one business day with a straight answer: either we can take it, or we tell you who is better placed to.",
        "Either way you will not be charged for finding out."
      ],
      primaryService: null,
      alternatives,
      documents: [],
      considerations: [],
      officialSource:
        DESTINATIONS.find((d) => d.code === destination)?.source ?? null,
      flags
    };
  }

  /* ---- 3. Published desk for the pair --------------------------------- */
  const alternatives: ServiceLink[] = [];
  const catchAll = catchAllService(hub);
  if (catchAll && catchAll.slug !== matched.slug) {
    alternatives.push({
      ...href(catchAll),
      reason: "If your trip takes in more than one country, this desk covers the rest."
    });
  }

  return buildMatched(matched, answers, strengths, watchPoints, flags, null, alternatives);
}

/* ───────────────────────── Matched-route builder ───────────────────────── */

function buildMatched(
  service: Service,
  answers: Answers,
  strengths: Finding[],
  watchPoints: Finding[],
  flags: string[],
  summaryOverride: string | null,
  alternatives: ServiceLink[]
): Assessment {
  /* "With care" is a statement about how much preparation the file needs,
     not about how likely it is to succeed. Nothing here predicts an
     outcome, because nothing here is entitled to. */
  const needsCare =
    watchPoints.some((w) =>
      ["There is a previous refusal to address", "Refusal history needs checking", "The timeline is tight"].includes(
        w.title
      )
    ) || watchPoints.length >= 3;

  const outcome: OutcomeCode = needsCare
    ? "ROUTE_MATCHED_WITH_CARE"
    : "ROUTE_MATCHED";

  flags.push(`outcome:${outcome.toLowerCase()}`, `service:${service.slug}`);

  const nextSteps = [
    "Save your result below so the counsellor has your answers before the call.",
    "Book a consultation — we confirm which visa actually applies to you and review what you already have.",
    watchPoints.length
      ? "Bring the documents flagged above. Those are the ones that shape the plan."
      : "Start gathering the documents listed below. Nothing on that list is unusual."
  ];

  return {
    outcome,
    headline: needsCare
      ? "A route we run — with a few things to build properly"
      : "A route we run",
    summary:
      summaryOverride ??
      (needsCare
        ? `${service.name} is a desk we run, and everything you have described is workable. There are points below that need proper preparation rather than a form letter — which is the part we are actually for.`
        : `${service.name} is a desk we run, and nothing in your answers suggests unusual complexity. The next step is a consultation to confirm which visa applies to you and to look at your evidence properly.`),
    strengths,
    watchPoints,
    nextSteps,
    primaryService: href(service),
    alternatives,
    documents: [...service.typicalDocuments],
    considerations: [...service.considerations],
    officialSource: service.source,
    flags
  };
}

/* ───────────────────────── Presentation tokens ─────────────────────────
   Kept beside the engine so an outcome can never be added without its
   styling.

   These use the `teal` / `gold` ramps rather than the semantic
   `success` / `warning` tokens deliberately. The semantic tokens are
   declared as `hsl(var(--success))` with no `<alpha-value>` slot, so
   Tailwind opacity modifiers (`/10`, `/30`) silently do nothing on them.
   The ramps are hex, so they work. The resulting colours are the same
   two the page used before — the visual language is unchanged. */

export const OUTCOME_TONE: Record<
  OutcomeCode,
  { label: string; className: string }
> = {
  ROUTE_MATCHED: {
    label: "Within our practice",
    className: "bg-teal-500/10 text-teal-700 ring-teal-500/30"
  },
  ROUTE_MATCHED_WITH_CARE: {
    label: "Within our practice — needs preparation",
    className: "bg-gold-500/10 text-gold-800 ring-gold-500/30"
  },
  ROUTE_UNPUBLISHED: {
    label: "Worth a conversation",
    className: "bg-secondary text-foreground ring-border"
  },
  SCOPE_REFERRAL: {
    label: "Outside our practice",
    className: "bg-muted text-muted-foreground ring-border"
  }
};

/** Outcome codes accepted by the server action and stored on the record. */
export const OUTCOME_CODES = [
  "ROUTE_MATCHED",
  "ROUTE_MATCHED_WITH_CARE",
  "ROUTE_UNPUBLISHED",
  "SCOPE_REFERRAL"
] as const;

/** Human-readable answer labels, for the CRM note. */
export function describeAnswers(answers: Answers): string {
  return STEPS.map((s) => {
    const v = answers[s.id];
    if (!v) return null;
    const opt = s.options.find((o) => o.value === v);
    const label = (opt?.label ?? v).replace(/^[^\w]*\s+/, "");
    return `${s.question} — ${label}`;
  })
    .filter(Boolean)
    .join("\n");
}

export { hubName, destinationName };
