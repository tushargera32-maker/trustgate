# Hero image — generation spec

Drop the finished file at `public/hero/hero-cinematic.webp`, then run
`python3 scripts/optimise-images.py`. Nothing else needs changing — the hero
already points at that path.

---

## Why the spec matters

The hero scrim is **measured, not eyeballed**: a flat 30% navy floor plus two
shaped gradients, tuned so the worst pixel behind any text clears roughly 7:1
against white. That tuning assumes certain things about the picture. Break
those assumptions and either the text stops being legible or the photograph
turns to grey mud.

So this is not a mood board. These are constraints.

---

## Technical

| | |
|---|---|
| Aspect | **16:9 or wider** (21:9 is better — the hero is short and wide on desktop) |
| Resolution | **2560×1440 minimum**, 3200×1800 preferred |
| Format to hand over | PNG or JPG at max quality — the script converts to WebP |
| Final delivered size | Script resizes to 1600px longest edge, ~200KB |

---

## Composition — the part that actually matters

The layout is: **text on the LEFT, glass case-tracker card on the RIGHT.**

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   [ TEXT ZONE ]              [ TRACKER CARD ]    │
│   headline, copy,            glass panel,        │
│   buttons, facts             ~38% width          │
│   ~55% width                                     │
│                                                  │
└──────────────────────────────────────────────────┘
     ↑ keep this half QUIET      ↑ can be busier
```

1. **Left 55% must be visually quiet.** Sky, water, wall, blurred depth,
   architecture at distance. No faces, no small detail, no high-frequency
   texture. Anything busy here fights the headline.
2. **Put the subject in the right third**, or centre-right. It will sit behind
   the glass card, which is the correct place for interest.
3. **Nothing important in the bottom 18%** — a running strip of destination
   tiles covers it.
4. **Nothing important in the top 12%** — the sticky header sits there.
5. **Mid-tone to dark overall.** Aim for an average luminance around 35–55%.
   Blown-out bright skies are the failure case: the scrim was tuned against a
   bright skyline and only just held. Golden hour, dusk, blue hour and interior
   light all work. Harsh midday sun does not.
6. **Leave headroom.** The image scales 1.06 → 1.00 on load, so roughly 3% is
   cropped off each edge at the start. Do not put anything critical at the
   extreme edges.

---

## Subject — what to actually generate

The site sells **carefulness to anxious people**, not wanderlust. The strongest
images are about the moment of passage, not the holiday.

**Good directions:**

- An airport departures hall at dusk, one traveller with a passport, seen from
  behind, shallow depth of field, warm terminal light on the right, quiet
  glass and sky on the left. *(This is what the current placeholder shows and
  it is genuinely the right idea.)*
- A boarding gate at blue hour, an aircraft beyond the window, a single figure
  small in frame.
- A hand receiving a stamped passport across a counter, warm light, everything
  else soft.
- A near-empty terminal walkway at dawn, long light, one figure walking away
  from camera.

**Avoid:**

- Landmark montages and flag collages — they read as a cheap agent's flyer
- Stock-smiling people pointing at laptops
- Anything with legible signage naming a specific country (the hero is generic;
  destination pages carry the country imagery)
- Visible text or logos anywhere; the AI-generated garble is a giveaway
- Passports or documents with readable personal data

---

## Colour

Navy `#0F1B2D` and gold `#B98B2E` are the brand. The image should sit inside
that range rather than fight it:

- **Cool blues and teals** in shadow — they blend into the navy scrim
- **Warm amber and gold** in highlights — terminal lighting, sunset, lamps
- **Avoid** dominant green, magenta or purple casts; they clash with the gold
  and cannot be scrim-corrected

A slightly desaturated, filmic grade beats a saturated one. Think of the way
the picture will look under a 30% navy wash, because that is how it will
actually appear.

---

## A prompt you can adapt

> Cinematic wide shot, 21:9, of an international airport departures hall at
> blue hour. A single traveller seen from behind on the right side of frame,
> holding a passport, softly lit by warm amber terminal lighting. The left
> half of the frame is quiet — large windows, cool dusk sky, out-of-focus
> depth. Shallow depth of field, filmic grade, slightly desaturated, cool
> shadows and warm highlights, no text or signage, no logos. Mid-tone
> exposure, nothing blown out.

---

## After you drop it in

1. Save as `public/hero/hero-cinematic.webp`
2. Run `python3 scripts/optimise-images.py`
3. Check contrast actually held — if any text looks soft against the picture,
   raise the flat floor in `src/components/home/hero.tsx` from `bg-ink-900/30`
   toward `/40` and **re-measure** rather than eyeballing it
4. If the subject sits wrong on mobile, adjust `object-[38%_center]` — that
   value biases the portrait crop, and it is per-image
