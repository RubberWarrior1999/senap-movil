"""Recreate the local illustration and monochrome icons used in the demo."""
from pathlib import Path
from math import sin
from PIL import Image, ImageDraw

assets = Path(__file__).resolve().parents[1] / "assets"
assets.mkdir(exist_ok=True)
strokes = {
    "home": [[(3, 11), (12, 3), (21, 11)], [(5, 10), (5, 21), (10, 21), (10, 15), (14, 15), (14, 21), (19, 21), (19, 10)]],
    "herd": [[(7, 8), (4, 8), (2, 4), (3, 10), (7, 13)], [(17, 8), (20, 8), (22, 4), (21, 10), (17, 13)], [(7, 8), (17, 8), (19, 17), (16, 21), (8, 21), (5, 17), (7, 8)], [(9, 13), (9, 14)], [(15, 13), (15, 14)], [(10, 18), (14, 18)]],
    "health": [[(12, 21), (3, 12), (2, 8), (4, 4), (8, 3), (12, 7), (16, 3), (20, 4), (22, 8), (21, 12), (12, 21)], [(6, 12), (9, 12), (10, 9), (13, 15), (15, 12), (18, 12)]],
    "drop": [[(12, 2), (6, 10), (4, 15), (5, 19), (8, 21), (12, 22), (16, 21), (19, 19), (20, 15), (18, 10), (12, 2)], [(8, 15), (9, 18), (12, 19)]],
    "task": [[(8, 5), (4, 5), (4, 22), (20, 22), (20, 5), (16, 5)], [(8, 3), (16, 3), (16, 7), (8, 7), (8, 3)], [(8, 13), (11, 16), (16, 11)]],
    "arrow": [[(5, 12), (19, 12)], [(13, 6), (19, 12), (13, 18)]],
    "search": [[(15, 15), (21, 21)]],
    "plus": [[(12, 4), (12, 20)], [(4, 12), (20, 12)]],
    "check": [[(4, 12), (9, 17), (20, 6)]],
    "close": [[(6, 6), (18, 18)], [(18, 6), (6, 18)]],
    "leaf": [[(4, 19), (9, 14), (16, 8)], [(7, 16), (6, 11), (9, 6), (14, 4), (21, 3), (20, 10), (16, 16), (11, 18), (7, 16)]],
}
for name, paths in strokes.items():
    image = Image.new("RGBA", (144, 144))
    draw = ImageDraw.Draw(image)
    for path in paths:
        points = [(x * 6, y * 6) for x, y in path]
        draw.line(points, fill="white", width=11, joint="curve")
        for x, y in (points[0], points[-1]):
            draw.ellipse((x - 5, y - 5, x + 5, y + 5), fill="white")
    if name == "search":
        draw.ellipse((17, 17, 101, 101), outline="white", width=11)
    image.resize((96, 96), Image.Resampling.LANCZOS).save(assets / f"{name}.png", optimize=True)

image = Image.new("RGB", (880, 390), "#123E30")
draw = ImageDraw.Draw(image)
draw.ellipse((640, 39, 750, 149), fill="#E3EBA4")
for x, y in [(587, 62), (781, 104), (827, 41)]:
    draw.line((x - 8, y, x + 8, y), fill="#A9CF9D", width=2)
    draw.line((x, y - 8, x, y + 8), fill="#A9CF9D", width=2)
for base, shift, tone in [(218, 40, "#29644D"), (260, 102, "#4A8261"), (302, 190, "#69A071")]:
    points = [(x, int(base + sin((x + shift) / 145) * 44)) for x in range(365, 890, 7)]
    draw.polygon(points + [(890, 390), (365, 390)], fill=tone)
draw.polygon([(600, 390), (746, 257), (787, 254), (692, 390)], fill="#ABCB88")
draw.polygon([(683, 193), (728, 153), (771, 192)], fill="#1A4936")
draw.rectangle((695, 193, 757, 245), fill="#EFF2C8")
draw.rectangle((718, 211, 738, 245), fill="#527C52")
draw.rectangle((700, 201, 709, 212), fill="#91B372")
for x, y in [(645, 270), (812, 248), (838, 252)]:
    draw.rectangle((x, y - 20, x + 4, y + 8), fill="#24533B")
    draw.ellipse((x - 10, y - 36, x + 14, y - 13), fill="#2A6346")
for x in range(365, 618):
    alpha = ((618 - x) / 253) ** 1.4
    for y in range(390):
        rgb = image.getpixel((x, y))
        image.putpixel((x, y), tuple(round(c * (1 - alpha) + d * alpha) for c, d in zip(rgb, (18, 62, 48))))
image.save(assets / "pastures.png", optimize=True)
