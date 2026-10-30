const GRAVITY = 1300;
const PUFF = -360;
const MAX_FALL = 520;
const SPEED = 120;
const GAP = 156;
const SPACING = 190;
const SPIKE_WIDTH = 44;
const PLATE_WIDTH = 58;
const PLATE_HEIGHT = 10;
const FLOOR = 26;
const PUP_RADIUS = 16;
const PUP_SCALE = 1.3;
const BALLOON_RADIUS = 11;
const BALLOON_OFFSET = 62;
const RESTART_DELAY = 450;
const BEST_KEY = "balloon-pup-best";
/** On-screen height of a sprite character, roughly matching the drawn pup at PUP_SCALE. */
const SPRITE_HEIGHT = 66;

const suitGreen = "#8fdc4a";
const ink = "#1d2a10";
const dark = "#3b2314";
const heartRed = "#e6395b";
const steelEdge = "#2b3440";
const grassEdge = "#1f4d33";

type Point = [number, number];
type Triangle = [Point, Point, Point];
type GameState = "ready" | "playing" | "over";

interface Spike {
  x: number;
  gapTop: number;
  scored: boolean;
}

interface Cloud {
  x: number;
  y: number;
  size: number;
}

export interface BalloonPupOptions {
  /** Optional character image drawn in place of the built-in pup once it has loaded. */
  sprite?: HTMLImageElement;
  /** Called once each time the pup pops, with the number of spikes passed. */
  onGameOver?: (score: number) => void;
  /** CSS font-family for titles and the score. */
  displayFont?: string;
  /** CSS font-family for the small "best" label. */
  monoFont?: string;
}

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

const saveBest = (value: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be unavailable in private windows; the best score just won't persist.
  }
};

const distanceToSegment = (px: number, py: number, [ax, ay]: Point, [bx, by]: Point) => {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

// Circle-vs-triangle overlap, used for both the pup and its balloon against each spike.
const hitsTriangle = (cx: number, cy: number, r: number, triangle: Triangle) => {
  const [a, b, c] = triangle;
  const side = (p: Point, q: Point) => (q[0] - p[0]) * (cy - p[1]) - (q[1] - p[1]) * (cx - p[0]);
  const signs = [side(a, b), side(b, c), side(c, a)];
  if (signs.every((value) => value >= 0) || signs.every((value) => value <= 0)) return true;
  return ([[a, b], [b, c], [c, a]] as [Point, Point][]).some(([p, q]) => distanceToSegment(cx, cy, p, q) < r);
};

// The little green pup, drawn around its own center at 1x scale.
const drawPupFigure = (
  context: CanvasRenderingContext2D,
  { kick = 0, crashed = false }: { kick?: number; crashed?: boolean } = {},
) => {
  context.lineJoin = "round";
  context.lineCap = "round";

  // A soft drop shadow under the solid shapes gives the figure some depth.
  const withShadow = (paint: () => void) => {
    context.save();
    context.shadowColor = "rgba(20, 40, 10, 0.35)";
    context.shadowBlur = 6;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 3;
    paint();
    context.restore();
  };
  const greenShade = (cx: number, cy: number, r: number) => {
    const shade = context.createRadialGradient(cx, cy, 1, cx + 4, cy + 6, r);
    shade.addColorStop(0, "#d4ff9c");
    shade.addColorStop(0.45, suitGreen);
    shade.addColorStop(1, "#4c8f1f");
    return shade;
  };

  // Floppy black ears.
  context.fillStyle = ink;
  context.beginPath();
  context.moveTo(-11, -14);
  context.quadraticCurveTo(-18, -24, -12, -32);
  context.quadraticCurveTo(-9, -24, -5, -16);
  context.fill();
  context.beginPath();
  context.moveTo(3, -15);
  context.quadraticCurveTo(4, -26, 7, -31);
  context.quadraticCurveTo(11, -24, 9, -14);
  context.fill();

  // Little body with the zipper, and stubby feet.
  context.fillStyle = ink;
  context.beginPath();
  context.ellipse(-6 + kick, 18, 3.5, 2, 0, 0, Math.PI * 2);
  context.ellipse(3 - kick, 18, 3.5, 2, 0, 0, Math.PI * 2);
  context.fill();
  withShadow(() => {
    context.fillStyle = greenShade(-6, 6, 14);
    context.beginPath();
    context.roundRect(-9, 4, 15, 14, 5);
    context.fill();
  });
  context.strokeStyle = ink;
  context.lineWidth = 1.3;
  context.beginPath();
  context.roundRect(-9, 4, 15, 14, 5);
  context.stroke();
  const zipper = context.createLinearGradient(1, 0, 4, 0);
  zipper.addColorStop(0, "#f4f4f4");
  zipper.addColorStop(1, "#9a9a9a");
  context.fillStyle = zipper;
  context.fillRect(1, 7, 3, 9);
  context.strokeStyle = "#5a5a5a";
  context.lineWidth = 0.6;
  for (let zy = 8; zy < 16; zy += 1.6) {
    context.beginPath();
    context.moveTo(1, zy);
    context.lineTo(4, zy);
    context.stroke();
  }

  // Big rounded-square head with a seam stitched down the middle.
  const head = () => {
    context.beginPath();
    context.roundRect(-14, -17, 28, 25, 8);
  };
  withShadow(() => {
    context.fillStyle = greenShade(-8, -12, 26);
    head();
    context.fill();
  });
  context.strokeStyle = ink;
  context.lineWidth = 1.6;
  head();
  context.stroke();
  context.save();
  context.setLineDash([2, 2]);
  context.strokeStyle = "rgba(29, 42, 16, 0.6)";
  context.lineWidth = 0.9;
  context.beginPath();
  context.moveTo(1, -16);
  context.lineTo(1, 7);
  context.stroke();
  context.restore();

  // Huge mismatched eyes.
  const eye = (cx: number, cy: number, r: number, pupilX: number, pupilY: number) => {
    const shine = context.createRadialGradient(cx - r * 0.4, cy - r * 0.4, 0.5, cx, cy, r);
    shine.addColorStop(0, "#ffffff");
    shine.addColorStop(0.7, "#f2f2f2");
    shine.addColorStop(1, "#c9cfd6");
    context.fillStyle = shine;
    context.strokeStyle = ink;
    context.lineWidth = 1.3;
    context.beginPath();
    context.ellipse(cx, cy, r, r * 1.05, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    if (crashed) {
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(pupilX - 1.8, pupilY - 1.8);
      context.lineTo(pupilX + 1.8, pupilY + 1.8);
      context.moveTo(pupilX + 1.8, pupilY - 1.8);
      context.lineTo(pupilX - 1.8, pupilY + 1.8);
      context.stroke();
    } else {
      context.fillStyle = ink;
      context.beginPath();
      context.arc(pupilX, pupilY, 1.3, 0, Math.PI * 2);
      context.fill();
    }
  };
  eye(-6, -6, 6, -4.5, -6);
  eye(8, -5, 7.2, 9.5, -5);

  // Nose and the tongue poking out below the head.
  context.fillStyle = ink;
  context.beginPath();
  context.moveTo(11, 3);
  context.lineTo(14.5, 3);
  context.lineTo(13, 5.5);
  context.closePath();
  context.fill();
  context.fillStyle = "#f07a8c";
  context.strokeStyle = ink;
  context.lineWidth = 1;
  context.beginPath();
  context.roundRect(7.5, 7, 4, 6, [0, 0, 2, 2]);
  context.fill();
  context.stroke();
};

const spriteReady = (sprite?: HTMLImageElement): sprite is HTMLImageElement =>
  !!sprite && sprite.complete && sprite.naturalWidth > 0;

// Draws a sprite image centered on the origin at the given height, keeping its aspect ratio.
const drawSprite = (context: CanvasRenderingContext2D, sprite: HTMLImageElement, height: number) => {
  const width = (height * sprite.naturalWidth) / sprite.naturalHeight;
  context.drawImage(sprite, -width / 2, -height / 2, width, height);
};

// A seamless square tile packed with overlapping pups, so the repeat has no empty space.
export function pupWallpaper(size = 160, sprite?: HTMLImageElement) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const tile = document.createElement("canvas");
  tile.width = size * ratio;
  tile.height = size * ratio;
  const context = tile.getContext("2d");
  if (!context) return "";
  context.scale(ratio, ratio);

  // A fixed seed keeps the pile identical on every load.
  let seed = 11;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const columns = 7;
  const rows = 6;
  const pups: { x: number; y: number; tilt: number; scale: number }[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      pups.push({
        x: ((column + (row % 2) * 0.5) * size) / columns + (random() - 0.5) * 8,
        y: (row * size) / rows + (random() - 0.5) * 8,
        tilt: (random() - 0.5) * 0.9,
        scale: 1.15 + random() * 0.3,
      });
    }
  }
  pups.sort((a, b) => a.y - b.y);

  // Green base so any sliver between shapes still reads as part of the pile.
  context.fillStyle = "#6fbf3a";
  context.fillRect(0, 0, size, size);
  pups.forEach(({ x, y, tilt, scale }) => {
    // Draw each pup in the neighboring tiles too, so shapes crossing an edge wrap around.
    [-size, 0, size].forEach((dx) => {
      [-size, 0, size].forEach((dy) => {
        context.save();
        context.translate(x + dx, y + dy);
        context.rotate(tilt);
        context.scale(scale, scale);
        if (spriteReady(sprite)) drawSprite(context, sprite, SPRITE_HEIGHT / PUP_SCALE);
        else drawPupFigure(context);
        context.restore();
      });
    });
  });
  return tile.toDataURL();
}

/** Mounts the game into `canvas` and returns a function that stops it and removes its listeners. */
export function mountBalloonPup(canvas: HTMLCanvasElement, options: BalloonPupOptions = {}) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const displayFont = options.displayFont ?? '"Faculty Glyphic", Georgia, serif';
  const monoFont = options.monoFont ?? '"IBM Plex Mono", monospace';

  let width = 320;
  let height = 420;

  let state: GameState = "ready";
  let pupY = 0;
  let velocity = 0;
  let spikes: Spike[] = [];
  let clouds: Cloud[] = [];
  let score = 0;
  let best = readBest();
  let isNewBest = false;
  let endedAt = 0;
  let scroll = 0;
  let time = 0;

  const pupX = () => Math.round(width * 0.3);
  const playHeight = () => height - FLOOR;

  const spikeTriangles = (spike: Spike): Triangle[] => {
    const centerX = spike.x + SPIKE_WIDTH / 2;
    const half = SPIKE_WIDTH / 2;
    const bottomTip = spike.gapTop + GAP;
    return [
      [[centerX, spike.gapTop], [centerX - half, 0], [centerX + half, 0]],
      [[centerX, bottomTip], [centerX - half, playHeight()], [centerX + half, playHeight()]],
    ];
  };

  const newSpike = (x: number): Spike => {
    const margin = 48;
    const range = Math.max(playHeight() - GAP - margin * 2, 0);
    return { x, gapTop: margin + Math.random() * range, scored: false };
  };

  const reset = () => {
    state = "ready";
    pupY = playHeight() * 0.48;
    velocity = 0;
    score = 0;
    isNewBest = false;
    spikes = [];
  };

  const seedClouds = () => {
    clouds = Array.from({ length: 4 }, (_, index) => ({
      x: (index / 4) * width + Math.random() * 40,
      y: 30 + Math.random() * (playHeight() * 0.55),
      size: 0.7 + Math.random() * 0.6,
    }));
  };

  const resize = () => {
    if (!canvas.clientWidth || !canvas.clientHeight) return;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    // Render at double density so the game stays crisp when the canvas is zoomed in.
    const ratio = Math.min(window.devicePixelRatio || 1, 2) * 2;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!clouds.length) seedClouds();
    if (state === "ready") pupY = playHeight() * 0.48;
  };

  const puff = () => {
    if (state === "over") {
      if (performance.now() - endedAt < RESTART_DELAY) return;
      reset();
    }
    if (state === "ready") {
      state = "playing";
      spikes = [newSpike(width + 60)];
    }
    velocity = PUFF;
  };

  const crash = () => {
    state = "over";
    endedAt = performance.now();
    if (score > best) {
      best = score;
      isNewBest = true;
      saveBest(best);
    }
    options.onGameOver?.(score);
  };

  const update = (dt: number) => {
    time += dt;
    const drift = state === "over" ? 0 : SPEED * dt;
    scroll = (scroll + drift) % 24;
    clouds.forEach((cloud) => {
      cloud.x -= drift * 0.25 * cloud.size;
      if (cloud.x < -60) {
        cloud.x = width + 40;
        cloud.y = 30 + Math.random() * (playHeight() * 0.55);
      }
    });

    if (state === "ready") {
      pupY = playHeight() * 0.48 + Math.sin(time * 3) * 6;
      return;
    }

    if (state === "over") {
      // Let the pup tumble down to the grass after a crash.
      if (pupY < playHeight() - PUP_RADIUS) {
        velocity = Math.min(velocity + GRAVITY * dt, MAX_FALL);
        pupY = Math.min(pupY + velocity * dt, playHeight() - PUP_RADIUS);
      }
      return;
    }

    velocity = Math.min(velocity + GRAVITY * dt, MAX_FALL);
    pupY += velocity * dt;

    spikes.forEach((spike) => {
      spike.x -= drift;
    });
    spikes = spikes.filter((spike) => spike.x > -PLATE_WIDTH);
    const lastSpike = spikes[spikes.length - 1];
    if (!lastSpike || lastSpike.x < width - SPACING) {
      spikes.push(newSpike((lastSpike ? lastSpike.x : width) + SPACING));
    }

    const x = pupX();
    const balloonY = pupY - BALLOON_OFFSET;
    spikes.forEach((spike) => {
      if (!spike.scored && spike.x + SPIKE_WIDTH < x - PUP_RADIUS) {
        spike.scored = true;
        score += 1;
      }
    });

    const hitSpike = spikes.some((spike) => {
      return spikeTriangles(spike).some((triangle) =>
        hitsTriangle(x, pupY, PUP_RADIUS, triangle) ||
        hitsTriangle(x + 4, balloonY, BALLOON_RADIUS, triangle));
    });

    if (hitSpike || pupY + PUP_RADIUS >= playHeight()) {
      pupY = Math.min(pupY, playHeight() - PUP_RADIUS);
      crash();
    } else if (balloonY - BALLOON_RADIUS < 0) {
      pupY = BALLOON_OFFSET + BALLOON_RADIUS;
      velocity = 0;
    }
  };

  const drawCloud = ({ x, y, size }: Cloud) => {
    context.fillStyle = "rgba(255, 255, 255, 0.85)";
    context.beginPath();
    context.arc(x, y, 14 * size, 0, Math.PI * 2);
    context.arc(x + 16 * size, y - 6 * size, 18 * size, 0, Math.PI * 2);
    context.arc(x + 34 * size, y, 13 * size, 0, Math.PI * 2);
    context.fill();
  };

  // One long metal spike pointing at the gap, bolted to the grass (direction 1) or to the
  // top edge of the sky (direction -1).
  const drawMetalSpike = (centerX: number, tipY: number, direction: 1 | -1, baseY: number) => {
    const half = SPIKE_WIDTH / 2;
    const tip: Point = [centerX, tipY];
    const left: Point = [centerX - half, baseY];
    const right: Point = [centerX + half, baseY];
    const middle: Point = [centerX, baseY];

    // Two facets lit from the upper left give the spike a polished, three-dimensional edge.
    const facet = (points: Point[], stops: [number, string][]) => {
      const shade = context.createLinearGradient(centerX - half, 0, centerX + half, 0);
      stops.forEach(([offset, color]) => shade.addColorStop(offset, color));
      context.fillStyle = shade;
      context.beginPath();
      points.forEach(([px, py], index) => (index ? context.lineTo(px, py) : context.moveTo(px, py)));
      context.closePath();
      context.fill();
    };
    facet([tip, left, middle], [[0, "#8f9aa6"], [0.3, "#eef3f7"], [0.5, "#c3ccd5"]]);
    facet([tip, middle, right], [[0.5, "#7d8894"], [0.75, "#a9b3bd"], [1, "#4b5560"]]);

    context.strokeStyle = steelEdge;
    context.lineWidth = 1.6;
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(...tip);
    context.lineTo(...left);
    context.lineTo(...right);
    context.closePath();
    context.stroke();

    // A thin glint running up the lit facet.
    context.strokeStyle = "rgba(255, 255, 255, 0.8)";
    context.lineWidth = 1.2;
    context.beginPath();
    context.moveTo(centerX - 1.5, tipY + direction * 10);
    context.lineTo(centerX - half * 0.45, baseY - direction * 6);
    context.stroke();

    // Bolted mounting plate at the base.
    const plateY = direction === 1 ? baseY - PLATE_HEIGHT : baseY;
    const plateShade = context.createLinearGradient(0, plateY, 0, plateY + PLATE_HEIGHT);
    plateShade.addColorStop(0, "#d5dce3");
    plateShade.addColorStop(1, "#5e6873");
    context.fillStyle = plateShade;
    context.beginPath();
    context.roundRect(centerX - PLATE_WIDTH / 2, plateY, PLATE_WIDTH, PLATE_HEIGHT, 3);
    context.fill();
    context.stroke();
    context.fillStyle = steelEdge;
    [-1, 1].forEach((sideX) => {
      context.beginPath();
      context.arc(centerX + sideX * (PLATE_WIDTH / 2 - 6), plateY + PLATE_HEIGHT / 2, 1.8, 0, Math.PI * 2);
      context.fill();
    });
  };

  const drawSpike = (spike: Spike) => {
    const centerX = spike.x + SPIKE_WIDTH / 2;
    drawMetalSpike(centerX, spike.gapTop, -1, 0);
    drawMetalSpike(centerX, spike.gapTop + GAP, 1, playHeight());
  };

  const drawPup = () => {
    const x = pupX();
    const tilt = state === "ready" ? 0 : Math.max(-0.35, Math.min(velocity / 900, 0.6));
    const balloonX = x + 6;
    const balloonY = pupY - BALLOON_OFFSET;
    const sprite = spriteReady(options.sprite) ? options.sprite : undefined;

    // String from the tip of the right ear (or the top of the sprite's head) up to the balloon.
    context.strokeStyle = ink;
    context.lineWidth = 1.5;
    context.beginPath();
    if (sprite) context.moveTo(x + 2, pupY - SPRITE_HEIGHT / 2 + 4);
    else context.moveTo(x + 7 * PUP_SCALE, pupY - 31 * PUP_SCALE);
    context.quadraticCurveTo(x + 5, pupY - 46, balloonX, balloonY + BALLOON_RADIUS);
    context.stroke();

    // Glossy heart balloon.
    context.save();
    context.translate(balloonX, balloonY);
    context.rotate(Math.sin(time * 4) * 0.08);
    context.scale(1.1, 1.1);
    const balloonShade = context.createRadialGradient(-5, -5, 1, 0, 0, 13);
    balloonShade.addColorStop(0, "#ff8fa6");
    balloonShade.addColorStop(0.55, heartRed);
    balloonShade.addColorStop(1, "#a3173a");
    context.fillStyle = balloonShade;
    context.beginPath();
    context.moveTo(0, 10);
    context.bezierCurveTo(-4, 6, -11, 3, -11, -3);
    context.bezierCurveTo(-11, -8, -5, -11, 0, -6);
    context.bezierCurveTo(5, -11, 11, -8, 11, -3);
    context.bezierCurveTo(11, 3, 4, 6, 0, 10);
    context.fill();
    context.fillStyle = "rgba(255, 255, 255, 0.75)";
    context.beginPath();
    context.ellipse(-5, -4, 2.5, 1.5, -0.6, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.save();
    context.translate(x, pupY);
    context.rotate(tilt);
    if (sprite) {
      drawSprite(context, sprite, SPRITE_HEIGHT);
    } else {
      context.scale(PUP_SCALE, PUP_SCALE);
      drawPupFigure(context, {
        kick: state === "playing" ? Math.sin(time * 14) * 1.2 : 0,
        crashed: state === "over",
      });
    }
    context.restore();
  };

  const drawFloor = () => {
    const top = playHeight();
    const grassShade = context.createLinearGradient(0, top, 0, top + FLOOR);
    grassShade.addColorStop(0, "#9fdc85");
    grassShade.addColorStop(1, "#4f9a45");
    context.fillStyle = grassShade;
    context.fillRect(0, top, width, FLOOR);
    context.fillStyle = "#5ea852";
    for (let x = -scroll; x < width; x += 24) {
      context.beginPath();
      context.moveTo(x, top + FLOOR);
      context.lineTo(x + 5, top + 8);
      context.lineTo(x + 10, top + FLOOR);
      context.fill();
    }
    context.fillStyle = grassEdge;
    context.fillRect(0, top, width, 2);
  };

  const drawText = (text: string, x: number, y: number, size: number, align: CanvasTextAlign = "center") => {
    context.font = `${size}px ${displayFont}`;
    context.textAlign = align;
    context.textBaseline = "middle";
    context.lineJoin = "round";
    context.lineWidth = 5;
    context.strokeStyle = "#fffdf4";
    context.strokeText(text, x, y);
    context.fillStyle = dark;
    context.fillText(text, x, y);
  };

  const drawHud = () => {
    if (state !== "ready") drawText(String(score), width / 2, 40, 38);
    context.font = `11px ${monoFont}`;
    context.textAlign = "right";
    context.textBaseline = "top";
    context.fillStyle = dark;
    context.fillText(`best ${best}`, width - 10, 10);

    if (state === "ready") {
      drawText("tap or press space to float", width / 2, playHeight() * 0.7, 14);
    } else if (state === "over") {
      context.fillStyle = "rgba(255, 253, 244, 0.6)";
      context.fillRect(0, 0, width, playHeight());
      drawText("Popped!", width / 2, playHeight() * 0.32, 32);
      drawText(isNewBest ? `new best: ${score}` : `score ${score} · best ${best}`, width / 2, playHeight() * 0.32 + 40, 15);
      if (performance.now() - endedAt >= RESTART_DELAY) {
        drawText("tap to try again", width / 2, playHeight() * 0.32 + 70, 13);
      }
    }
  };

  const draw = () => {
    const sky = context.createLinearGradient(0, 0, 0, playHeight());
    sky.addColorStop(0, "#bfe3f5");
    sky.addColorStop(1, "#fff4d6");
    context.fillStyle = sky;
    context.fillRect(0, 0, width, height);
    clouds.forEach(drawCloud);
    spikes.forEach(drawSpike);
    drawFloor();
    drawPup();
    drawHud();
  };

  let last = performance.now();
  let frameId = 0;
  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    update(dt);
    draw();
    frameId = requestAnimationFrame(frame);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    puff();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== " " && event.key !== "ArrowUp" && event.key !== "Enter") return;
    // Leave Space/Enter alone on the arcade's links and buttons so the rest of the page stays usable.
    const target = event.target;
    if (target instanceof Element && target !== canvas && target.closest("a, button, input, textarea, select")) return;
    event.preventDefault();
    if (!event.repeat) puff();
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("keydown", onKeyDown);
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  reset();
  frameId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(frameId);
    observer.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("keydown", onKeyDown);
  };
}
