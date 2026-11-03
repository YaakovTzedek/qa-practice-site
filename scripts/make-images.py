"""Generates the abstract artwork used by the site (no stock photos, no real people).
Run once: python3 scripts/make-images.py  (needs Pillow)."""
import random
from PIL import Image, ImageDraw, ImageFilter

OUT = 'public/img/'
PALETTES = [
    ['#f4ece1', '#c2593f', '#2f3e46', '#e9b44c', '#84a59d'],
    ['#efe6dd', '#3d5a80', '#ee6c4d', '#98c1d9', '#293241'],
    ['#f7f1e3', '#6d597a', '#e56b6f', '#eaac8b', '#355070'],
    ['#eef0e5', '#606c38', '#bc6c25', '#dda15e', '#283618'],
]

def art(w, h, pal, seed, grain=0):
    rnd = random.Random(seed)
    img = Image.new('RGB', (w, h), pal[0])
    d = ImageDraw.Draw(img)
    for _ in range(9):
        c = rnd.choice(pal[1:])
        x, y = rnd.randint(-w // 4, w), rnd.randint(-h // 4, h)
        r = rnd.randint(min(w, h) // 8, min(w, h) // 2)
        if rnd.random() < 0.5:
            d.ellipse([x - r, y - r, x + r, y + r], fill=c)
        else:
            d.rounded_rectangle([x - r, y - r // 2, x + r, y + r // 2], radius=r // 4, fill=c)
    for _ in range(14):
        c = rnd.choice(pal[1:])
        x, y = rnd.randint(0, w), rnd.randint(0, h)
        d.line([x, y, x + rnd.randint(-w // 3, w // 3), y + rnd.randint(-h // 3, h // 3)], fill=c, width=max(2, w // 300))
    img = img.filter(ImageFilter.GaussianBlur(radius=max(1, w // 900)))
    if grain:
        noise = Image.effect_noise((w, h), grain).convert('RGB')
        img = Image.blend(img, noise, 0.18)
    return img

# Hero: the heavy original (planted bug) and the optimized version (fix).
hero = art(4200, 2700, PALETTES[0], 7, grain=90)
hero.save(OUT + 'hero-studio.jpg', quality=97, subsampling=0)
art(1600, 1028, PALETTES[0], 7).save(OUT + 'hero-studio-1600.webp', quality=74)
art(800, 514, PALETTES[0], 7).save(OUT + 'hero-studio-800.webp', quality=72)

for i, name in enumerate(['product-logo', 'product-branding', 'product-social']):
    art(1200, 900, PALETTES[(i + 1) % 4], 100 + i).save(OUT + name + '.jpg', quality=78)

for i in range(1, 5):
    art(800, 800, PALETTES[i % 4], 200 + i).save(OUT + f'portfolio-{i}.jpg', quality=76)
print('done')
