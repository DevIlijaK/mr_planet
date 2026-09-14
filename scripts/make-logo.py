"""
Cut Mr. Planet's head out of the hero sprite and scale it (nearest-neighbour,
integer factors only) into every logo the site needs:

  public/images/hero/mr-planet-head.png   in-page logo (HUD, article nav, 404)
  src/app/favicon.ico                      16/32/48 tab icon
  src/app/icon.png                         192px PNG icon
  src/app/apple-icon.png                   180px, opaque, on the void colour
  src/app/opengraph-image.png              1200x630 share card

Run: python3 scripts/make-logo.py   (needs Pillow; the OG card also needs a
Pixelify Sans TTF next to the script or at $PIXELIFY_TTF).
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITE = os.path.join(ROOT, "public/images/hero/mr-planet.png")
VOID = (0x0B, 0x0A, 0x1F, 255)
CRUST = (0xE6, 0xE1, 0xF5, 255)
DUST = (0x8B, 0x84, 0xAD, 255)

# The sprite is a 15x23 pixel drawing blown up 10x. The head is the top 15
# rows; the last of those also holds the shoulders, so keep only the five
# middle cells there (the planet's bottom outline).
CELL = 10
HEAD_ROWS = 15
BOTTOM_KEEP = range(5, 10)

sprite = Image.open(SPRITE).convert("RGBA")
cols = sprite.width // CELL
head = Image.new("RGBA", (cols, HEAD_ROWS), (0, 0, 0, 0))
for row in range(HEAD_ROWS):
    for col in range(cols):
        if row == HEAD_ROWS - 1 and col not in BOTTOM_KEEP:
            continue
        head.putpixel((col, row), sprite.getpixel((col * CELL, row * CELL)))
assert head.width == head.height == 15


def scaled(factor):
    return head.resize((head.width * factor, head.height * factor), Image.NEAREST)


def framed(size, factor=None, background=(0, 0, 0, 0)):
    """The head at the biggest integer scale that fits, centred in a square."""
    factor = factor or max(1, size // head.width)
    art = scaled(factor)
    canvas = Image.new("RGBA", (size, size), background)
    offset = (size - art.width) // 2
    canvas.paste(art, (offset, offset), art)
    return canvas


def save(img, rel, **kw):
    path = os.path.join(ROOT, rel)
    img.save(path, **kw)
    print(f"{rel}: {img.width}x{img.height}")


save(scaled(CELL), "public/images/hero/mr-planet-head.png")
save(framed(192, factor=12), "src/app/icon.png")
save(framed(180, factor=10, background=VOID).convert("RGB"), "src/app/apple-icon.png")

ico = framed(48, factor=3)
save(
    ico,
    "src/app/favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=[framed(16, factor=1), framed(32, factor=2)],
)

# --- share card ------------------------------------------------------------
W, H = 1200, 630
card = Image.new("RGBA", (W, H), VOID)
art = scaled(24)  # 360px
margin_x = 110
card.paste(art, (margin_x, (H - art.height) // 2), art)

ttf = os.environ.get("PIXELIFY_TTF") or os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "pixelify.ttf"
)
if os.path.exists(ttf):
    draw = ImageDraw.Draw(card)
    title = ImageFont.truetype(ttf, 96)
    sub = ImageFont.truetype(ttf, 36)
    x = margin_x + art.width + 70
    draw.text((x, 222), "MR. PLANET", font=title, fill=CRUST)
    draw.text((x + 4, 334), "A blog you have to jump to.", font=sub, fill=DUST)
else:
    print(f"no Pixelify Sans at {ttf}; share card gets the head only", file=sys.stderr)
save(card.convert("RGB"), "src/app/opengraph-image.png", optimize=True)
