#!/usr/bin/env python3
"""
Resize and convert /public images to WebP, sized to how each is actually used.

Originals are preserved untouched in public/_originals/ so nothing is lost.
Every asset keeps its path and basename; only the extension changes, e.g.
  public/destinations/uk.png -> public/destinations/uk.webp
"""
import pathlib, shutil
from PIL import Image

PUBLIC = pathlib.Path("public")
BACKUP = PUBLIC / "_originals"

# (glob, longest edge, quality, square-crop?)
#   destinations / hero  -> full-bleed tiles and hero art, need real width
#   office               -> mid-size editorial images
#   team / stories       -> rendered as small round avatars, so crop square
#   logo                 -> nav mark, rendered at ~180x50
RULES = [
    ("destinations/*.png", 1600, 82, False),
    ("hero/*.png",         1600, 82, False),
    ("office/*.png",       1200, 82, False),
    ("team/*.png",          512, 85, True),
    ("stories/*.png",       512, 85, True),
    ("logo.png",            600, 90, False),
]


def square_crop(im):
    """Centre-crop to 1:1 — these are landscape photos used as round avatars."""
    w, h = im.size
    s = min(w, h)
    return im.crop(((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2))


def main():
    BACKUP.mkdir(exist_ok=True)
    before = after = 0
    rows = []

    for pattern, longest, quality, square in RULES:
        for src in sorted(PUBLIC.glob(pattern)):
            if BACKUP in src.parents:
                continue

            orig_size = src.stat().st_size
            before += orig_size

            # keep an untouched copy
            dest_backup = BACKUP / src.relative_to(PUBLIC)
            dest_backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest_backup)

            im = Image.open(src)
            if square:
                im = square_crop(im)
            if max(im.size) > longest:
                ratio = longest / max(im.size)
                im = im.resize(
                    (round(im.width * ratio), round(im.height * ratio)),
                    Image.LANCZOS,
                )

            out = src.with_suffix(".webp")
            im.convert("RGB").save(out, "WEBP", quality=quality, method=6)
            new_size = out.stat().st_size
            after += new_size
            src.unlink()  # original is safe in _originals/

            rows.append(
                (str(out.relative_to(PUBLIC)), im.size,
                 orig_size / 1048576, new_size / 1048576)
            )

    for name, size, mb_in, mb_out in rows:
        print(f"  {name:38} {str(size):14} {mb_in:5.2f} MB -> {mb_out:5.2f} MB")
    print(f"\n  {'TOTAL':38} {'':14} {before/1048576:5.2f} MB -> {after/1048576:5.2f} MB")
    print(f"  saved {(1 - after/before)*100:.1f}%")


if __name__ == "__main__":
    main()
