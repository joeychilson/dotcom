type Point = [number, number, number];
type Face = { points: Point[]; color: string };

function geometry() {
  const faces: Face[] = [];
  const face = (points: Point[], color: string) =>
    faces.push({ points, color });
  const box = (
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    c: string,
  ) => {
    face(
      [
        [x, y, z + d],
        [x + w, y, z + d],
        [x + w, y + h, z + d],
        [x, y + h, z + d],
      ],
      c,
    );
    face(
      [
        [x + w, y, z],
        [x + w, y, z + d],
        [x + w, y + h, z + d],
        [x + w, y + h, z],
      ],
      c,
    );
    face(
      [
        [x, y + h, z],
        [x + w, y + h, z],
        [x + w, y + h, z + d],
        [x, y + h, z + d],
      ],
      c,
    );
  };
  const hull = (length: number, beam: number, height: number, c: string) => {
    const l = length / 2,
      b = beam / 2;
    face(
      [
        [-l, 0, -b],
        [-l, 0, b],
        [-l + 20, -height, b * 0.6],
        [-l + 20, -height, -b * 0.6],
      ],
      c,
    );
    face(
      [
        [-l, 0, b],
        [l - 30, 0, b],
        [l, 0, 0],
        [l - 25, -height, 0],
        [l - 42, -height, b * 0.6],
        [-l + 20, -height, b * 0.6],
      ],
      c,
    );
    face(
      [
        [-l, 0, -b],
        [l - 30, 0, -b],
        [l, 0, 0],
        [l - 30, 0, b],
        [-l, 0, b],
      ],
      '#9daab6',
    );
  };
  hull(200, 48, 24, '#5a6384');
  box(-35, 0, -17, 52, 15, 34, '#9ea5b8');
  box(4, 0, 0, 3, 195, 3, '#5e6485');
  face(
    [
      [0, 187, 0],
      [-100, 22, 2],
      [0, 22, 2],
    ],
    '#979dc5',
  );
  face(
    [
      [13, 170, 0],
      [13, 22, 2],
      [96, 22, 2],
    ],
    '#b6b9d7',
  );
  for (let y = 30; y < 175; y += 16)
    face(
      [
        [0, y, 3],
        [-(187 - y) * 0.6, y, 3],
        [-(187 - y) * 0.6, y + 1, 3],
        [0, y + 1, 3],
      ],
      '#7781ab',
    );
  face(
    [
      [7, 193, 2],
      [32, 187, 2],
      [7, 180, 2],
    ],
    '#64749e',
  );
  return faces;
}

export function mountSea(root: HTMLElement) {
  const el = root.querySelector('canvas')!;
  const ctx = el.getContext('2d');
  if (!ctx) return () => {};
  const buffer = document.createElement('canvas');
  buffer.width = 288;
  buffer.height = 288;
  const paint = buffer.getContext('2d', { willReadFrequently: true });
  if (!paint) return () => {};
  const faces = geometry();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const figure = root.querySelector('figure')!;
  const button = root.querySelector<HTMLButtonElement>('[data-pause]')!;
  let dark = document.documentElement.dataset.theme === 'dark';
  let skyStartedAt = -Infinity;
  let elapsed = 0,
    last = 0,
    frame = 0,
    visible = false,
    paused = false;
  const render = (t: number) => {
    const angle = 0.39 + Math.sin(t * 0.22) * 0.075;
    const bob = Math.sin(t * 0.85) * 2.8;
    const roll = Math.sin(t * 0.65) * 0.019;
    const project = ([x, y, z]: Point): [number, number] => {
      const px = x * Math.cos(angle) - z * Math.sin(angle),
        depth = x * Math.sin(angle) + z * Math.cos(angle);
      return [270 + px, 294 - y + depth * 0.43 + bob + px * roll];
    };
    paint.setTransform(1, 0, 0, 1, 0, 0);
    paint.clearRect(0, 0, 288, 288);
    // Read only the sailboat bounds; water is drawn directly as text.
    paint.translate(-128, -64);
    const ordered = [...faces].sort((a, b) => {
      const depth = (f: Face) =>
        f.points.reduce(
          (n, p) => n + p[0] * Math.sin(angle) + p[2] * Math.cos(angle),
          0,
        ) / f.points.length;
      return depth(a) - depth(b);
    });
    for (const f of ordered) {
      paint.beginPath();
      f.points.forEach((p, i) => {
        const [x, y] = project(p);
        if (i === 0) paint.moveTo(x, y);
        else paint.lineTo(x, y);
      });
      paint.closePath();
      paint.fillStyle = f.color;
      paint.fill();
    }
    const pixels = paint.getImageData(0, 0, 288, 288).data;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (el.width !== 540 * dpr) {
      el.width = 540 * dpr;
      el.height = 480 * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, 540, 480);
    ctx.font = '7px monospace';
    ctx.textAlign = 'center';
    // A quick sunrise/sunset handoff, then both paths stop.
    const progress = Math.min(1, Math.max(0, (t - skyStartedAt) / 0.45));
    const eased = 1 - Math.pow(1 - progress, 3);
    const skyAngle = (eased * Math.PI) / 2;
    const drawSky = (isDark: boolean, offsetX: number, offsetY: number) => {
      const skyY = 106 + offsetY;
      const skyGlyph = (char: string, x: number, y: number) => {
        // The sun and moon pass behind the sail, without shining through its characters.
        const px = Math.floor(x + offsetX),
          py = Math.floor(y + offsetY);
        if (
          px >= 128 &&
          px < 416 &&
          py >= 64 &&
          py < 352 &&
          pixels[((py - 64) * 288 + px - 128) * 4 + 3] > 40
        )
          return;
        ctx.fillText(char, x, y);
      };
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 540, 302);
      ctx.clip();
      ctx.globalAlpha = Math.max(0, Math.min(1, (312 - skyY) / 35));
      ctx.translate(offsetX, offsetY);
      for (let y = 76; y <= 136; y += 6)
        for (let x = 335; x <= 395; x += 4) {
          const dx = x - 365,
            dy = y - 106,
            radius = Math.hypot(dx, dy);
          if (radius <= 21) {
            if (isDark && Math.hypot(dx - 10, dy + 7) < 20) continue;
            ctx.fillStyle = isDark
              ? `rgba(112,132,163,${0.79 + Math.sin(t * 0.7 + dy * 0.06) * 0.06})`
              : 'rgba(185,143,66,.78)';
            skyGlyph(radius > 17 ? ':' : (x + y) % 3 ? '+' : 'o', x, y);
          } else if (!isDark && radius >= 27 && radius <= 31) {
            const ray = (Math.atan2(dy, dx) - t * 0.12) / (Math.PI / 4);
            if (Math.abs(ray - Math.round(ray)) < 0.13) {
              ctx.fillStyle = `rgba(185,143,66,${0.5 + Math.sin(t * 0.8) * 0.1})`;
              skyGlyph('.', x, y);
            }
          }
        }
      ctx.restore();
    };
    if (progress < 1) {
      drawSky(!dark, -225 * Math.sin(skyAngle), 206 * (1 - Math.cos(skyAngle)));
    }
    drawSky(dark, 95 * Math.cos(skyAngle), 206 * (1 - Math.sin(skyAngle)));

    for (let y = 40; y < 451; y += 6)
      for (let x = 15; x < 525; x += 4) {
        const index = ((y - 64) * 288 + x - 128) * 4;
        if (
          x >= 128 &&
          x < 416 &&
          y >= 64 &&
          y < 352 &&
          pixels[index + 3] > 40
        ) {
          const r = pixels[index],
            g = pixels[index + 1],
            b = pixels[index + 2];
          const value = (r + g + b) / 3;
          const grain = (Math.sin(x * 12.9 + y * 7.8) * 43758.5) % 1;
          const ramp = '.:+=ox#';
          const char =
            ramp[
              Math.max(0, Math.min(6, Math.floor((225 - value) / 24 + grain)))
            ];
          ctx.fillStyle = `rgba(${Math.max(0, r - 28)},${Math.max(0, g - 28)},${Math.max(0, b - 20)},.86)`;
          ctx.fillText(char, x, y);
        } else if (y > 296) {
          const z = (y - 296) / 155,
            center = 270 + Math.sin(y * 0.09 + t) * 9;
          const wave =
            Math.sin(x * 0.06 - t * 1.3 + y * 0.14) +
            Math.sin(x * 0.024 + t * 0.7 - y * 0.19);
          const edge = Math.max(0, 1 - Math.pow(Math.abs(x - 270) / 250, 4));
          const reflection = Math.abs(x - center) < 90 * (1 - z * 0.6);
          if (wave > 0.6 || (reflection && wave > -0.25)) {
            const alpha =
              (0.1 + Math.max(0, wave) * 0.13 + (reflection ? 0.045 : 0)) *
              edge *
              (1 - z * 0.85);
            ctx.fillStyle = `rgba(104,127,154,${alpha})`;
            ctx.fillText(
              wave > 1.4 ? '~' : wave > 0.8 ? '=' : wave > 0.1 ? '-' : '.',
              x,
              y,
            );
          }
        }
      }
  };
  const active = () =>
    visible && !paused && !motion.matches && !document.hidden;
  const tick = (now: number) => {
    frame = 0;
    if (!active()) return;
    // Limit redraws while preserving elapsed time across different refresh rates.
    if (!last || now - last >= 1000 / 24) {
      elapsed += last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      render(elapsed);
    }
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    if (paused || motion.matches) skyStartedAt = -Infinity;
    button.hidden = motion.matches;
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    render(elapsed);
    if (active()) frame = requestAnimationFrame(tick);
  };
  const toggle = () => {
    paused = !paused;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute(
      'aria-label',
      `${paused ? 'Play' : 'Pause'} sailboat animation`,
    );

    sync();
  };
  const move = (event: PointerEvent) => {
    if (motion.matches || event.pointerType === 'touch') return;
    const box = root.getBoundingClientRect();
    figure.style.setProperty(
      '--drift-x',
      `${(event.clientX - box.left - box.width / 2) * 0.045}px`,
    );
    figure.style.setProperty(
      '--drift-y',
      `${(event.clientY - box.top - box.height / 2) * 0.03}px`,
    );
  };
  const reset = () => {
    figure.style.setProperty('--drift-x', '0px');
    figure.style.setProperty('--drift-y', '0px');
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  const themeObserver = new MutationObserver(() => {
    const nextDark = document.documentElement.dataset.theme === 'dark';
    if (nextDark === dark) return;
    dark = nextDark;
    skyStartedAt = elapsed;
    // Redraw even when animation is paused or reduced motion is enabled.
    sync();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  observer.observe(root);
  button.hidden = motion.matches;
  button.addEventListener('click', toggle);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', reset);
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('resize', sync);
  render(0);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    themeObserver.disconnect();
    button.removeEventListener('click', toggle);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', reset);
    motion.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('resize', sync);
  };
}
