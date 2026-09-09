"""
Script para generar la animación GIF del personaje de Ale:
- Basado en los 9 fotogramas de wavingDude.gif
- Personaje fiel: estilo doodle hecho a mano, trazo de tinta, vibración line-boiling
- Pelo rizado (curly loops) en lugar de espinas rectas
- Sin lentes: ojos limpios, expresivos con cejas sutiles y sonrisa
"""

from PIL import Image, ImageDraw
import math
import random
import os

def generate_curly_waving_dude(
    src_gif="Assets/wavingDudeOriginal.gif",
    output_gif="Assets/wavingDude.gif"
):
    if not os.path.exists(src_gif):
        src_gif = "Assets/wavingDude.gif"
        
    base_im = Image.open(src_gif)
    frames = []
    
    # Extraer fotogramas originales
    for i in range(getattr(base_im, 'n_frames', 9)):
        base_im.seek(i)
        frames.append(base_im.convert('RGBA'))
        
    # Plantilla de bucles para pelo rizado
    base_curls = [
        (245, 230, 22),
        (260, 185, 24),
        (290, 150, 25),
        (330, 120, 26),
        (380, 105, 27),
        (430, 110, 26),
        (475, 130, 25),
        (515, 165, 24),
        (535, 210, 22),
        (270, 145, 25),
        (315, 105, 26),
        (365, 85, 28),
        (405, 85, 28),
        (455, 95, 28),
        (495, 125, 26),
        (340, 75, 24),
        (390, 65, 25),
        (440, 75, 24),
    ]

    centroids = [
        (389.6, 245.6),
        (391.0, 244.9),
        (388.7, 244.1),
        (388.7, 244.1),
        (391.1, 244.9),
        (389.6, 245.6),
        (389.7, 245.6),
        (389.3, 244.8),
        (387.9, 246.4)
    ]

    c0x, c0y = centroids[0]
    stroke_color = (30, 30, 20, 255)
    random.seed(42)
    output_frames = []

    for i, im in enumerate(frames):
        w, h = im.size
        pixels = im.load()
        
        ci_x, ci_y = centroids[i % len(centroids)]
        dx = ci_x - c0x
        dy = ci_y - c0y
        
        scx = 388 + dx
        scy = 262 + dy
        s_rad = 162
        
        left_eye = (309 + dx, 275 + dy)
        right_eye = (481 + dx, 231 + dy)
        
        # Proteger pupilas y sonrisa
        pupils = set()
        for y in range(h):
            for x in range(w):
                if (x - left_eye[0])**2 + (y - left_eye[1])**2 <= 14**2:
                    pupils.add((x, y))
                if (x - right_eye[0])**2 + (y - right_eye[1])**2 <= 14**2:
                    pupils.add((x, y))
                if 385 + dx <= x <= 445 + dx and 295 + dy <= y <= 340 + dy:
                    pupils.add((x, y))
                    
        # Eliminar espinas rectas de pelo y montura de lentes
        for y in range(h):
            for x in range(w):
                dist_skull = math.hypot(x - scx, y - scy)
                # Pelos rectos arriba del cráneo
                if y < 190 + dy and x < 560 and dist_skull > s_rad + 4:
                    pixels[x, y] = (0, 0, 0, 0)
                    
                # Lentes dentro del cráneo (aros, puente y patillas)
                if dist_skull < s_rad - 6 and (x, y) not in pupils:
                    dist_l = math.hypot(x - left_eye[0], y - left_eye[1])
                    dist_r = math.hypot(x - right_eye[0], y - right_eye[1])
                    in_bridge = (335 + dx <= x <= 435 + dx and 165 + dy <= y <= 245 + dy)
                    if dist_l <= 72 or dist_r <= 72 or in_bridge:
                        pixels[x, y] = (0, 0, 0, 0)
                        
        draw = ImageDraw.Draw(im)
        
        # Dibujar rizos con micro-vibración orgánica (line boiling)
        for bx, by, br in base_curls:
            jx = dx + random.uniform(-1.5, 1.5)
            jy = dy + random.uniform(-1.5, 1.5)
            cx, cy, r = bx + jx, by + jy, br + random.uniform(-0.8, 0.8)
            draw.arc([cx - r, cy - r, cx + r, cy + r], start=0, end=360, fill=stroke_color, width=12)
            
        # Ojos definidos y limpios
        draw.ellipse([left_eye[0] - 11, left_eye[1] - 11, left_eye[0] + 11, left_eye[1] + 11], fill=stroke_color)
        draw.ellipse([right_eye[0] - 11, right_eye[1] - 11, right_eye[0] + 11, right_eye[1] + 11], fill=stroke_color)
        
        # Cejas expresivas
        draw.arc([left_eye[0] - 16, left_eye[1] - 38, left_eye[0] + 18, left_eye[1] - 12], start=200, end=340, fill=stroke_color, width=7)
        draw.arc([right_eye[0] - 18, right_eye[1] - 38, right_eye[0] + 16, right_eye[1] - 12], start=200, end=340, fill=stroke_color, width=7)
        
        output_frames.append(im)

    # Convertir a paleta GIF transparente
    p_frames = []
    for frame in output_frames:
        alpha = frame.split()[3]
        rgb = frame.convert('RGB')
        p_frame = rgb.convert('P', palette=Image.ADAPTIVE, colors=255)
        mask = Image.eval(alpha, lambda a: 255 if a <= 128 else 0)
        p_frame.paste(255, mask)
        p_frame.info['transparency'] = 255
        p_frames.append(p_frame)

    p_frames[0].save(
        output_gif,
        save_all=True,
        append_images=p_frames[1:],
        duration=70,
        loop=0,
        disposal=2,
        transparency=255
    )
    print(f"GIF guardado en: {output_gif}")

if __name__ == "__main__":
    generate_curly_waving_dude()
