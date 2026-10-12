"""Turn the original logo files (white backgrounds) into web-ready assets.

Usage: python3 scripts/prepare-logos.py <folder with originals>
Expects stacked.png, horizontal.png, icon.png, one-color.png in that folder.
Writes transparent PNGs to src/assets/brand/ and favicons to public/.
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

src = Path(sys.argv[1])
root = Path(__file__).resolve().parent.parent
brand = root / "src" / "assets" / "brand"
public = root / "public"
MARKER = (255, 0, 255, 255)


def transparent(path):
    """Flood-fill the near-white background from the image edges, then crop."""
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    edges = [(x, y) for x in range(0, w, 4) for y in (0, h - 1)]
    edges += [(x, y) for y in range(0, h, 4) for x in (0, w - 1)]
    for xy in edges:
        p = im.getpixel(xy)
        if p != MARKER and min(p[:3]) > 235:
            ImageDraw.floodfill(im, xy, MARKER, thresh=40)
    px = im.load()
    for y in range(h):
        for x in range(w):
            if px[x, y] == MARKER:
                px[x, y] = (255, 255, 255, 0)
    return im.crop(im.getbbox())


def fit(im, width):
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


def square(im, size):
    side = max(im.size)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    return sq.resize((size, size), Image.LANCZOS)


brand.mkdir(parents=True, exist_ok=True)
for name, width in [("stacked", 900), ("horizontal", 1000), ("icon", 512), ("one-color", 900)]:
    out = fit(transparent(src / f"{name}.png"), width)
    out.save(brand / f"logo-{name}.png", optimize=True)
    print("wrote", brand / f"logo-{name}.png", out.size)

icon = transparent(src / "icon.png")
square(icon, 32).save(public / "favicon-32.png", optimize=True)
square(icon, 180).save(public / "apple-touch-icon.png", optimize=True)
square(icon, 512).save(public / "icon-512.png", optimize=True)
square(icon, 48).save(public / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("wrote favicons")
