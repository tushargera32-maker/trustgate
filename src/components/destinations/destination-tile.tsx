import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { destinationImage, destinationAlt } from "@/lib/destination-images";
import { type DestinationCode } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type Destination = {
  code: DestinationCode;
  name: string;
  region: string;
  flag: string;
  stayNote: string;
};

/**
 * DestinationTile — image-led, with the information sitting quietly over the
 * photograph rather than in a card below it.
 *
 * The stay rule is the one fact a traveller is choosing on, so it is always
 * present rather than hidden behind hover: hover-only content is invisible on
 * touch, which is most of this audience. What hover adds is emphasis, not
 * information.
 *
 * Two destinations have no photograph. They get a typographic tile instead of
 * a borrowed stock image, so the grid stays honest about what we have shot.
 */
export function DestinationTile({
  destination,
  size = "default",
  priority = false
}: {
  destination: Destination;
  size?: "default" | "tall";
  priority?: boolean;
}) {
  const src = destinationImage(destination.code);
  const alt = destinationAlt(destination.code);

  return (
    <Link
      href={`/countries/${destination.code.toLowerCase()}`}
      className={cn(
        "group lift relative isolate flex flex-col justify-end overflow-hidden rounded-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        size === "tall" ? "min-h-[420px]" : "min-h-[300px]"
      )}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/* Two stops rather than one: a strong foot so the text always has
              contrast, and a light wash up top so the image still reads. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/55 to-ink-900/5"
          />
        </>
      ) : (
        <FallbackField flag={destination.flag} />
      )}

      <div className="relative p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/60">
          {destination.region}
        </p>

        <h3 className="mt-1.5 flex items-center gap-2 font-display text-2xl font-light leading-tight text-white">
          {destination.name}
          <ArrowUpRight className="h-4 w-4 shrink-0 text-gold-300 opacity-0 transition-opacity group-hover:opacity-100" />
        </h3>

        <p className="mt-2 max-w-[38ch] text-[13px] leading-relaxed text-white/75">
          {destination.stayNote}
        </p>
      </div>
    </Link>
  );
}

/**
 * The no-photograph tile. Navy ground with the perforation texture and an
 * oversized flag glyph — deliberately not a photograph, so it reads as a
 * different kind of entry rather than a broken image.
 */
function FallbackField({ flag }: { flag: string }) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-900" />
      <div
        aria-hidden="true"
        className="dot-field absolute inset-0 opacity-[0.16]"
      />
      <span
        aria-hidden="true"
        className="absolute right-5 top-5 text-5xl opacity-30 transition-opacity duration-500 group-hover:opacity-45"
      >
        {flag}
      </span>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent"
      />
    </>
  );
}
