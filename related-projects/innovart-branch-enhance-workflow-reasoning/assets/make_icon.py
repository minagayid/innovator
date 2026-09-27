"""Generate the InnovArt app icon (gradient rounded square with 'IA')."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).parent
SIZE = 256


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make(size=SIZE):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # diagonal cyan -> violet gradient inside a rounded square
    c1, c2 = (34, 211, 238), (167, 139, 250)
    grad = Image.new("RGBA", (size, size))
    gdraw = ImageDraw.Draw(grad)
    for y in range(size):
        for_x = y / size
        gdraw.line([(0, y), (size, y)], fill=lerp(c1, c2, for_x) + (255,))

    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [8, 8, size - 8, size - 8], radius=size // 5, fill=255
    )
    img.paste(grad, (0, 0), mask)

    # "IA" text
    try:
        font = ImageFont.truetype("segoeuib.ttf", int(size * 0.42))
    except OSError:
        font = ImageFont.load_default()
    text = "IA"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw = ImageDraw.Draw(img)
    draw.text(
        ((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1]),
        text, font=font, fill=(6, 18, 26, 255),
    )
    return img


if __name__ == "__main__":
    icon = make()
    icon.save(HERE / "innovart.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"Icon written to {HERE / 'innovart.ico'}")
