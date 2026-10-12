"""Generate the 1200x630 Open Graph (social share) images in public/og/.

Re-run after changing a page's headline here:  python3 scripts/make-og-images.py
Needs Pillow (pip install pillow) and `npm install` (for the Zilla Slab / Inter font files).
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
FONTS = ROOT / "node_modules" / "@fontsource"
SLAB = FONTS / "zilla-slab" / "files" / "zilla-slab-latin-700-normal.woff"
SLAB_SEMI = FONTS / "zilla-slab" / "files" / "zilla-slab-latin-600-normal.woff"
LOGO = ROOT / "src" / "assets" / "brand" / "logo-stacked.png"

YELLOW, INK, WHITE, PAPER = (242, 194, 48), (17, 17, 17), (255, 255, 255), (248, 246, 241)

# file name -> (headline, sub line)
PAGES = {
    "default": ("Call Your Uncle.", "Roofing in Yardley & Lower Bucks County, PA"),
    "roof-replacement": ("Roof Replacement", "Yardley & Lower Bucks County, PA"),
    "roof-repair": ("Roof Repair", "Yardley & Lower Bucks County, PA"),
    "free-roof-inspection": ("Free Roof Inspection", "Yardley & Lower Bucks County, PA"),
    "solar-ready-roofs": ("Solar-Ready Roofs", "Bucks County, PA"),
    "financing": ("Roof Financing", "Yardley & Lower Bucks County, PA"),
    "our-story": ("Our Story", "The Uncle Joe house"),
    "service-areas": ("Service Areas", "Lower Bucks County, PA"),
    "yardley": ("Roofing in Yardley", "Yardley, PA"),
    "lower-makefield": ("Roofing in Lower Makefield", "Lower Makefield Township, PA"),
    "newtown": ("Roofing in Newtown", "Newtown, PA"),
    "langhorne": ("Roofing in Langhorne", "Langhorne, PA"),
    "middletown-township": ("Roofing in Middletown", "Middletown Township, PA"),
}


def wrap(draw, text, font, width):
    words, lines, line = text.split(), [], ""
    for w in words:
        test = f"{line} {w}".strip()
        if draw.textlength(test, font=font) <= width:
            line = test
        else:
            lines.append(line)
            line = w
    return lines + [line]


def make(name, headline, sub):
    im = Image.new("RGB", (1200, 630), WHITE)
    d = ImageDraw.Draw(im)
    # left panel with logo
    d.rectangle([0, 0, 470, 630], fill=PAPER)
    logo = Image.open(LOGO)
    logo.thumbnail((380, 420), Image.LANCZOS)
    im.paste(logo, ((470 - logo.width) // 2, (560 - logo.height) // 2), logo)
    d.line([(470, 0), (470, 630)], fill=INK, width=4)
    # headline
    x, maxw = 530, 620
    size = 92
    while True:
        font = ImageFont.truetype(str(SLAB), size)
        lines = wrap(d, headline, font, maxw)
        if len(lines) <= 3 or size <= 56:
            break
        size -= 6
    sub_font = ImageFont.truetype(str(SLAB_SEMI), 36)
    line_h = int(size * 1.08)
    block = len(lines) * line_h + 30 + 44
    y = (560 - block) // 2
    for ln in lines:
        d.text((x, y), ln, font=font, fill=INK)
        y += line_h
    d.rectangle([x, y + 8, x + 120, y + 18], fill=YELLOW)
    d.text((x, y + 36), sub, font=sub_font, fill=(61, 61, 61))
    # bottom band
    d.rectangle([0, 560, 1200, 630], fill=YELLOW)
    d.line([(0, 560), (1200, 560)], fill=INK, width=4)
    band = ImageFont.truetype(str(SLAB), 38)
    d.text((40, 573), "Call Your Uncle.", font=band, fill=INK)
    right = "unclejoesroofing.com"
    d.text((1160 - d.textlength(right, font=band), 573), right, font=band, fill=INK)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{name}.png", optimize=True)


for name, (headline, sub) in PAGES.items():
    make(name, headline, sub)
    print("wrote", OUT / f"{name}.png")
