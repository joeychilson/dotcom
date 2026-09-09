type Building = {
  x: number;
  width: number;
  height: number;
  depth: number;
  roof?: 'steps' | 'spire' | 'gable' | 'antenna';
  material?: 'glass' | 'stone' | 'brick';
};
type Glyph = {
  x: number;
  y: number;
  char: string;
};
type WindowGlyph = Glyph & {
  window: boolean;
  seed: number;
  edge?: boolean;
};
type Tower = {
  silhouette: Path2D;
  facade: Path2D;
  shadow: Path2D;
  material: NonNullable<Building['material']>;
  glyphs: WindowGlyph[];
  side: Glyph[];
  roof: Glyph[];
};

const WIDTH = 540;
const HEIGHT = 400;
const STREET = 310;
const LAYER_OPACITY = [0.46, 0.91, 1];
const MATERIAL_INK = {
  light: { brick: '117,86,74', glass: '54,92,119', stone: '73,86,109' },
  dark: { brick: '159,173,197', glass: '139,173,204', stone: '159,173,197' },
};
const noise = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

// Glass towers, stepped stone crowns, and brick storefronts make a small city.
const blocks: Building[][] = [
  [
    { x: 49, width: 30, height: 67, depth: 7 },
    { x: 85, width: 31, height: 103, depth: 8, roof: 'antenna' },
    { x: 122, width: 38, height: 128, depth: 9, roof: 'steps' },
    { x: 171, width: 28, height: 92, depth: 7 },
    { x: 269, width: 37, height: 157, depth: 8, roof: 'steps' },
    { x: 364, width: 27, height: 129, depth: 8, roof: 'gable' },
    { x: 414, width: 34, height: 106, depth: 8 },
    { x: 458, width: 26, height: 69, depth: 7 },
  ],
  [
    { x: 65, width: 35, height: 91, depth: 12, material: 'brick' },
    {
      x: 113,
      width: 44,
      height: 151,
      depth: 14,
      roof: 'steps',
      material: 'stone',
    },
    {
      x: 173,
      width: 34,
      height: 119,
      depth: 13,
      roof: 'antenna',
      material: 'glass',
    },
    {
      x: 218,
      width: 48,
      height: 202,
      depth: 15,
      roof: 'spire',
      material: 'stone',
    },
    { x: 283, width: 32, height: 92, depth: 12, material: 'brick' },
    {
      x: 330,
      width: 42,
      height: 168,
      depth: 16,
      roof: 'gable',
      material: 'glass',
    },
    {
      x: 393,
      width: 33,
      height: 125,
      depth: 12,
      roof: 'steps',
      material: 'stone',
    },
    { x: 443, width: 27, height: 76, depth: 10, material: 'glass' },
  ],
  [
    { x: 89, width: 44, height: 38, depth: 10, material: 'brick' },
    { x: 155, width: 41, height: 57, depth: 11, material: 'stone' },
    { x: 213, width: 37, height: 35, depth: 10, material: 'brick' },
    { x: 279, width: 43, height: 50, depth: 11, material: 'brick' },
    { x: 343, width: 37, height: 38, depth: 10, material: 'stone' },
    { x: 400, width: 44, height: 45, depth: 10, material: 'brick' },
  ],
];

function makeTower(building: Building, layer: number): Tower {
  const { x, width, height, depth, roof, material = 'stone' } = building;
  const base = STREET - (2 - layer) * 5;
  const top = base - height;
  const roofHeight = (u: number) => {
    const edge = Math.min(u, width - u) / width;
    if (roof === 'spire') return edge > 0.34 ? 25 : edge > 0.16 ? 12 : 0;
    if (roof === 'steps') return edge > 0.19 ? 12 : 0;
    if (roof === 'gable') return edge * 48;
    return 0;
  };
  const facade = new Path2D();
  facade.moveTo(x, base);
  for (let u = 0; u <= width; u++) facade.lineTo(x + u, top - roofHeight(u));
  facade.lineTo(x + width, base);
  facade.closePath();
  const shadow = new Path2D();
  shadow.moveTo(x + width, top);
  shadow.lineTo(x + width + depth, top - depth * 0.5);
  shadow.lineTo(x + width + depth, base - depth * 0.5);
  shadow.lineTo(x + width, base);
  shadow.closePath();
  const silhouette = new Path2D(facade);
  silhouette.addPath(shadow);
  const glyphs: WindowGlyph[] = [];
  const side: Glyph[] = [];
  const roofGlyphs: Glyph[] = [];
  for (let u = 2; u < width; u += 4) {
    for (let v = -Math.floor(roofHeight(u) / 6) * 6; v < height - 3; v += 6) {
      const seed = noise(x + u, top + v);
      const row = Math.round((v + 30) / 6);
      const column = Math.floor(u / 4);
      const edge = column === 0 || u > width - 5;
      const window = !edge && column % 3 !== 0 && row % 3 !== 0 && v > 5;
      const char = edge
        ? '|'
        : window
          ? material === 'glass'
            ? '='
            : '#'
          : material === 'glass' && column % 3 === 0
            ? '│'
            : material === 'brick' && row % 3 === 0
              ? '−'
              : '·';
      glyphs.push({
        x: x + u,
        y: top + v + 3,
        char,
        window,
        seed,
        edge,
      });
    }
    roofGlyphs.push({
      x: x + u,
      y: top - roofHeight(u),
      char: '−',
    });
  }
  for (let u = 2; u < depth; u += 4)
    for (let v = 2; v < height; v += 6)
      side.push({
        x: x + width + u,
        y: top + v - u * 0.5,
        char: ':',
      });
  if (roof === 'spire') {
    for (let y = top - 48; y < top - 24; y += 5)
      roofGlyphs.push({
        x: x + width / 2,
        y,
        char: '┆',
      });
  }
  if (roof === 'antenna') {
    for (let y = top - 19; y < top; y += 5)
      roofGlyphs.push({
        x: x + width * 0.7,
        y,
        char: '|',
      });
    roofGlyphs.push({
      x: x + width * 0.7,
      y: top - 14,
      char: '+',
    });
  }
  // Cornices and striped shop awnings give the close buildings a different scale.
  if (layer === 2) {
    for (let u = 2; u < width; u += 4) {
      roofGlyphs.push({
        x: x + u,
        y: top + 5,
        char: '═',
      });
      roofGlyphs.push({
        x: x + u,
        y: base - 10,
        char: u % 8 === 2 ? '/' : '−',
      });
    }
  }
  return {
    silhouette,
    facade,
    shadow,
    material,
    glyphs,
    side,
    roof: roofGlyphs,
  };
}

export function mountSkyline(root: HTMLElement) {
  const el = root.querySelector('canvas')!;
  const ctx = el.getContext('2d');
  if (!ctx) return () => {};
  const layers = blocks.map((buildings, layer) =>
    buildings.map((building) => makeTower(building, layer)),
  );
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const figure = root.querySelector('figure')!;
  const button = root.querySelector<HTMLButtonElement>('[data-pause]')!;
  let dark = document.documentElement.dataset.theme === 'dark';
  let skyStartedAt = -Infinity;
  let elapsed = 0;
  let last = 0;
  let frame = 0;
  let visible = false;
  let paused = false;
  let background = getComputedStyle(document.body).backgroundColor;

  const render = (t: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (el.width !== WIDTH * dpr || el.height !== HEIGHT * dpr) {
      el.width = WIDTH * dpr;
      el.height = HEIGHT * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.font = '500 6.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // The sun and moon trade places in a short orbit when the app theme changes.
    const progress = Math.min(1, Math.max(0, (t - skyStartedAt) / 0.65));
    const eased = 1 - Math.pow(1 - progress, 3);
    const skyAngle = (eased * Math.PI) / 2;
    if (progress < 1)
      background = getComputedStyle(document.body).backgroundColor;

    if (dark) {
      for (let i = 0; i < 24; i++) {
        const x = 64 + noise(i, 1) * 422;
        const y = 57 + noise(i, 2) * 150;
        ctx.fillStyle = `rgba(159,177,205,${0.2 + (Math.sin(t * 0.65 + i) + 1) * 0.16})`;
        ctx.fillText(i % 7 === 0 ? '+' : '·', x, y);
      }
    }

    const drawSky = (night: boolean, dx: number, dy: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(30, 35, 480, STREET - 35);
      ctx.clip();
      ctx.translate(dx, dy);
      ctx.globalAlpha = Math.max(0, Math.min(1, (STREET - 95 - dy) / 40));
      for (let y = -30; y <= 30; y += 5)
        for (let x = -30; x <= 30; x += 3.5) {
          const radius = Math.hypot(x, y);
          if (radius < 21) {
            if (night && Math.hypot(x - 10, y + 7) < 19) continue;
            ctx.fillStyle = night
              ? 'rgba(170,190,216,.9)'
              : 'rgba(187,120,35,.96)';
            ctx.fillText(radius > 17 ? ':' : '+', 422 + x, 96 + y);
          } else if (!night && radius > 26 && radius < 30) {
            const ray = (Math.atan2(y, x) - t * 0.06) / (Math.PI / 4);
            if (Math.abs(ray - Math.round(ray)) < 0.15) {
              ctx.fillStyle = 'rgba(193,130,44,.75)';
              ctx.fillText('·', 422 + x, 96 + y);
            }
          }
        }
      ctx.restore();
    };
    if (progress < 1)
      drawSky(!dark, -230 * Math.sin(skyAngle), 238 * (1 - Math.cos(skyAngle)));
    drawSky(dark, 85 * Math.cos(skyAngle), 238 * (1 - Math.sin(skyAngle)));

    // Clouds drift independently and fade at the edges of the little scene.
    for (let cloud = 0; cloud < 3; cloud++) {
      const center = ((176 + cloud * 191 + t * (2 + cloud * 0.4)) % 690) - 75;
      const cy = 103 + cloud * 26;
      for (let y = -12; y <= 12; y += 6)
        for (let x = -51; x <= 51; x += 4) {
          const shape = (x / 53) ** 2 + (y / 14) ** 2;
          const seed = noise(x + cloud, y);
          if (shape > 1 || seed < 0.28) continue;
          const px = center + x;
          const edge = Math.max(
            0,
            Math.min(1, (px - 30) / 45, (510 - px) / 45),
          );
          ctx.fillStyle = dark
            ? `rgba(125,146,179,${(1 - shape) * edge * 0.28})`
            : `rgba(97,124,157,${(1 - shape) * edge * 0.62})`;
          ctx.fillText(seed > 0.7 ? '−' : '·', px, cy + y);
        }
    }

    if (!dark) {
      ctx.save();
      ctx.font = '9px monospace';
      for (let bird = 0; bird < 3; bird++) {
        const x = 74 + ((t * 3 + bird * 21) % 95);
        const y = 139 - bird * 9 + Math.sin(t * 1.3 + bird) * 2;
        ctx.fillStyle = 'rgba(63,87,118,.65)';
        ctx.fillText('⌁', x, y);
      }
      ctx.restore();
    }

    layers.forEach((towers, layer) => {
      ctx.save();
      ctx.translate(Math.sin(t * 0.12) * (2 - layer) * 1.6, 0);
      const opacity = LAYER_OPACITY[layer];
      for (const tower of towers) {
        const ink = MATERIAL_INK[dark ? 'dark' : 'light'][tower.material];
        // Opaque silhouettes keep distant windows and stars behind the buildings.
        ctx.fillStyle = background;
        ctx.fill(tower.silhouette);
        // A light wash and a darker side keep the architecture legible in daylight.
        ctx.fillStyle = `rgba(${ink},${opacity * (dark ? 0.045 : 0.07)})`;
        ctx.fill(tower.facade);
        ctx.fillStyle = `rgba(${ink},${opacity * (dark ? 0.085 : 0.16)})`;
        ctx.fill(tower.shadow);
        ctx.fillStyle = `rgba(${ink},${opacity * 0.76})`;
        for (const glyph of tower.side)
          ctx.fillText(glyph.char, glyph.x, glyph.y);
        for (const glyph of tower.glyphs) {
          const occupied = glyph.window && glyph.seed > 0.42 && layer > 0;
          if (dark && occupied) {
            const glow = 0.6 + 0.14 * Math.sin(t * 0.3 + glyph.seed * 40);
            ctx.fillStyle = `rgba(224,185,117,${glow})`;
          } else {
            ctx.fillStyle = `rgba(${ink},${opacity * (glyph.edge ? 0.92 : glyph.window ? 0.84 : 0.48)})`;
          }
          ctx.fillText(dark && occupied ? '+' : glyph.char, glyph.x, glyph.y);
        }
        ctx.fillStyle = `rgba(${ink},${opacity})`;
        for (const glyph of tower.roof)
          ctx.fillText(glyph.char, glyph.x, glyph.y);
      }
      ctx.restore();
    });

    // A narrow avenue grounds the scene; sparse paving fades into the page.
    const streetInk = dark ? '143,159,180' : '84,98,117';
    for (let y = STREET + 4; y <= STREET + 28; y += 6) {
      for (let x = 46; x <= 497; x += 4) {
        const edge = Math.max(0, Math.sin(((x - 46) / 451) * Math.PI));
        const curb = y === STREET + 4;
        const lane = y === STREET + 16 && x % 32 < 12;
        if (!curb && !lane && noise(x, y) < 0.78) continue;
        const alpha = (curb ? 0.54 : lane ? 0.31 : 0.12) * edge;
        ctx.fillStyle = `rgba(${streetInk},${alpha})`;
        ctx.fillText(curb || lane ? '−' : '·', x, y);
      }
    }

    for (const [tree, x] of [61, 143, 268, 388, 476].entries()) {
      ctx.fillStyle = dark ? 'rgba(138,156,143,.7)' : 'rgba(88,104,78,.85)';
      ctx.fillText('│', x, STREET - 2);
      ctx.fillText('│', x, STREET - 7);
      const sway = Math.sin(t * 0.85 + tree) * 0.8;
      for (let y = -20; y < -6; y += 4)
        for (let dx = -9; dx <= 9; dx += 3) {
          if ((dx / 10) ** 2 + ((y + 14) / 9) ** 2 > 1) continue;
          const grain = noise(dx + tree, y);
          ctx.fillStyle = dark
            ? `rgba(125,162,143,${0.35 + grain * 0.3})`
            : `rgba(66,111,83,${0.5 + grain * 0.32})`;
          ctx.fillText(grain > 0.5 ? '*' : ':', x + dx + sway, STREET + y);
        }
    }

    for (const x of [82, 203, 325, 454]) {
      ctx.fillStyle = `rgba(${streetInk},.75)`;
      for (let y = STREET - 15; y <= STREET + 3; y += 5)
        ctx.fillText('│', x, y);
      ctx.fillText('┌─', x + 2, STREET - 19);
      ctx.fillStyle = dark ? 'rgba(244,199,123,.95)' : 'rgba(158,111,49,.9)';
      ctx.fillText('o', x + 7, STREET - 18);
    }

    for (let car = 0; car < 3; car++) {
      const distance = (car * 141 + t * (car % 2 ? 12 : 17)) % 406;
      const x = car % 2 ? 478 - distance : 61 + distance;
      const y = STREET + (car % 2 ? 10 : 23);
      const edge = Math.max(0, Math.min(1, (x - 49) / 24, (497 - x) / 24));
      ctx.save();
      ctx.globalAlpha = edge;
      ctx.fillStyle =
        car === 0
          ? dark
            ? '#c3a171'
            : '#a57539'
          : dark
            ? '#8babc4'
            : '#536f8b';
      ctx.fillText('╭─╮', x, y - 4);
      ctx.fillText('o─o', x, y);
      if (dark) {
        ctx.fillStyle = '#e9cc98';
        ctx.fillText('·', x + (car % 2 ? -7 : 7), y - 2);
      }
      ctx.restore();
    }
  };

  const active = () =>
    visible && !paused && !motion.matches && !document.hidden;
  const tick = (now: number) => {
    frame = 0;
    if (!active()) return;
    if (!last || now - last >= 1000 / 24) {
      elapsed += last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      render(elapsed);
    }
    frame = requestAnimationFrame(tick);
  };
  const reset = () => {
    figure.style.setProperty('--drift-x', '0px');
    figure.style.setProperty('--drift-y', '0px');
  };
  const sync = () => {
    if (paused || motion.matches) {
      skyStartedAt = -Infinity;
      reset();
    }
    // A paused scene must still reflect a change to the app's theme.
    background = getComputedStyle(document.documentElement)
      .getPropertyValue('--background')
      .trim();
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
      `${paused ? 'Play' : 'Pause'} skyline animation`,
    );
    sync();
  };
  const move = (event: PointerEvent) => {
    if (paused || motion.matches || event.pointerType === 'touch') return;
    const box = root.getBoundingClientRect();
    figure.style.setProperty(
      '--drift-x',
      `${(event.clientX - box.left - box.width / 2) * 0.025}px`,
    );
    figure.style.setProperty(
      '--drift-y',
      `${(event.clientY - box.top - box.height / 2) * 0.012}px`,
    );
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
    sync();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  observer.observe(root);
  button.addEventListener('click', toggle);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', reset);
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('resize', sync);
  sync();
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
