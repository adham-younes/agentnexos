import os
from PIL import Image, ImageDraw

def render_icon(size, is_dark=True):
    # Render at 4x resolution for anti-aliasing
    scale = 4
    dim = size * scale
    img = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Colors
    if is_dark:
        bg_color = (9, 9, 11, 255) # obsidian black
        border_color = (255, 255, 255, 36)
        fg_pillar = (255, 255, 255, 255)
        fg_diag = (212, 212, 216, 255)
        core_color = (56, 189, 248, 255) # sky-400
        center_dot = (255, 255, 255, 255)
    else:
        bg_color = (0, 0, 0, 255)
        border_color = (255, 255, 255, 20)
        fg_pillar = (255, 255, 255, 255)
        fg_diag = (228, 228, 231, 255)
        core_color = (56, 189, 248, 255)
        center_dot = (255, 255, 255, 255)

    # Squircle background
    radius = int(dim * 0.21)
    draw.rounded_rectangle([0, 0, dim - 1, dim - 1], radius=radius, fill=bg_color, outline=border_color, width=max(1, scale))

    # Glyph dimensions relative to 180 base
    factor = dim / 180.0
    
    # Left Pillar
    x1, y1, x2, y2 = 42 * factor, 44 * factor, 64 * factor, 136 * factor
    draw.rounded_rectangle([x1, y1, x2, y2], radius=int(4 * factor), fill=fg_pillar)

    # Right Pillar
    x1, y1, x2, y2 = 116 * factor, 44 * factor, 138 * factor, 136 * factor
    draw.rounded_rectangle([x1, y1, x2, y2], radius=int(4 * factor), fill=fg_pillar)

    # Diagonal connection
    diag_pts = [
        (42 * factor, 48 * factor),
        (118 * factor, 128 * factor),
        (138 * factor, 128 * factor),
        (62 * factor, 48 * factor)
    ]
    draw.polygon(diag_pts, fill=fg_diag)

    # Central Nexus Node (Sky Blue glow)
    cx, cy = 90 * factor, 90 * factor
    r_outer = 11 * factor
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], fill=core_color)

    # Inner White Point
    r_inner = 4 * factor
    draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=center_dot)

    # Downsample with Lanczos for crisp, anti-aliased icon
    res = img.resize((size, size), Image.Resampling.LANCZOS)
    return res

if __name__ == "__main__":
    # 1. apple-icon.png (180x180)
    icon_180 = render_icon(180, is_dark=True)
    icon_180.save("public/apple-icon.png", "PNG")
    print("Saved public/apple-icon.png")

    # 2. icon-dark-32x32.png (32x32)
    icon_dark_32 = render_icon(32, is_dark=True)
    icon_dark_32.save("public/icon-dark-32x32.png", "PNG")
    print("Saved public/icon-dark-32x32.png")

    # 3. icon-light-32x32.png (32x32)
    icon_light_32 = render_icon(32, is_dark=False)
    icon_light_32.save("public/icon-light-32x32.png", "PNG")
    print("Saved public/icon-light-32x32.png")
