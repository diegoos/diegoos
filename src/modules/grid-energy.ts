const SVG_NS = "http://www.w3.org/2000/svg";
const GRID_INSET = 24;
const REVEAL_OUTER_PX = 184;
const IDLE_MS = 300;
const REPEAT_MS = 3000;

type Point = { x: number; y: number };
type Dir = { x: number; y: number };

function readCellSize(page: HTMLElement): number {
  return (
    parseFloat(getComputedStyle(page).getPropertyValue("--grid-size")) || 24
  );
}

function getGridOffset(grid: Element): { ox: number; oy: number } {
  const parts = getComputedStyle(grid).backgroundPosition.split(/\s+/);
  return {
    ox: parseFloat(parts[0]) || 0,
    oy: parseFloat(parts[1]) || 0,
  };
}

function snapTo(value: number, offset: number, cell: number): number {
  return Math.round((value - offset) / cell) * cell + offset;
}

function buildRandomPath(startX: number, startY: number, dirs: Dir[]): Point[] {
  const points: Point[] = [{ x: startX, y: startY }];
  let x = startX;
  let y = startY;
  let last: Dir | null = null;
  const maxSteps = 14 + Math.floor(Math.random() * 10);

  for (let step = 0; step < maxSteps; step += 1) {
    const dist = Math.hypot(x - startX, y - startY);
    const outside = dist > REVEAL_OUTER_PX;
    const options = dirs
      .map((dir) => {
        const nx = x + dir.x;
        const ny = y + dir.y;
        const nextDist = Math.hypot(nx - startX, ny - startY);
        let weight = 1;
        if (last && dir.x === -last.x && dir.y === -last.y) weight = 0.08;
        if (nextDist > dist) weight *= outside ? 1.4 : 3.2;
        if (nextDist < dist) weight *= outside ? 0.35 : 0.55;
        if (Math.random() < 0.18) weight *= 2.2;
        return { dir, nx, ny, weight };
      })
      .filter((option) => option.weight > 0);

    const total = options.reduce((sum, option) => sum + option.weight, 0);
    let pick = Math.random() * total;
    let chosen = options[options.length - 1];
    for (const option of options) {
      pick -= option.weight;
      if (pick <= 0) {
        chosen = option;
        break;
      }
    }

    x = chosen.nx;
    y = chosen.ny;
    last = chosen.dir;
    points.push({ x, y });

    if (outside && step > 10 && Math.random() < 0.22) break;
  }

  return points;
}

function pointsToPath(points: Point[]): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

export function initGridEnergy(pageId = "page"): void {
  const page = document.getElementById(pageId);
  const bolts = page?.querySelector<SVGSVGElement>(".page__bolts");
  const grids = page
    ? [...page.querySelectorAll<HTMLElement>(".page__grid")]
    : [];
  const grid = grids[0];
  const focusGrid = page?.querySelector<HTMLElement>(".page__grid--focus");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  if (
    !page ||
    !bolts ||
    !grid ||
    reduceMotion.matches ||
    !finePointer.matches
  ) {
    return;
  }

  const cell = readCellSize(page);
  const dirs: Dir[] = [
    { x: cell, y: 0 },
    { x: -cell, y: 0 },
    { x: 0, y: cell },
    { x: 0, y: -cell },
  ];

  let rect = page.getBoundingClientRect();
  let rafId = 0;
  let idleTimer = 0;
  let repeatTimer = 0;
  let isIdle = false;
  let mouseLocal: Point = { x: 0, y: 0 };
  let activeAnims: Animation[] = [];

  const resizeObserver = new ResizeObserver(() => {
    rect = page.getBoundingClientRect();
  });
  resizeObserver.observe(page);

  const clearEnergyTimers = () => {
    window.clearTimeout(idleTimer);
    window.clearInterval(repeatTimer);
    idleTimer = 0;
    repeatTimer = 0;
  };

  const resumeGridDrift = () => {
    if (activeAnims.length > 0) return;
    for (const layer of grids) {
      layer.style.animationPlayState = "";
    }
  };

  const clearBolts = () => {
    for (const anim of activeAnims) anim.cancel();
    activeAnims = [];
    bolts.replaceChildren();
    resumeGridDrift();
  };

  const fireEnergy = () => {
    clearBolts();
    for (const layer of grids) {
      layer.style.animationPlayState = "paused";
    }

    const { ox, oy } = getGridOffset(grid);
    const startX = snapTo(mouseLocal.x, ox, cell);
    const startY = snapTo(mouseLocal.y, oy, cell);
    const pathCount = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < pathCount; i += 1) {
      const points = buildRandomPath(startX, startY, dirs);
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("class", "page__bolt-path");
      path.setAttribute("d", pointsToPath(points));
      bolts.appendChild(path);

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      const anim = path.animate(
        [
          { strokeDashoffset: length, opacity: 0.7 },
          { strokeDashoffset: length * 0.35, opacity: 0.45, offset: 0.55 },
          { strokeDashoffset: 0, opacity: 0 },
        ],
        {
          duration: 1700 + Math.random() * 600,
          delay: i * 80,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );

      activeAnims.push(anim);
      anim.finished
        .then(() => {
          path.remove();
          activeAnims = activeAnims.filter((item) => item !== anim);
          resumeGridDrift();
        })
        .catch(() => {
          resumeGridDrift();
        });
    }
  };

  const scheduleIdleEnergy = () => {
    window.clearTimeout(idleTimer);
    window.clearInterval(repeatTimer);
    repeatTimer = 0;
    idleTimer = window.setTimeout(() => {
      isIdle = true;
      fireEnergy();
      repeatTimer = window.setInterval(() => {
        if (isIdle && page.classList.contains("is-pointer-active")) {
          fireEnergy();
        }
      }, REPEAT_MS);
    }, IDLE_MS);
  };

  page.addEventListener("pointermove", (event) => {
    isIdle = false;
    window.clearInterval(repeatTimer);
    repeatTimer = 0;
    clearBolts();

    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      rafId = 0;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseLocal = {
        x: x + GRID_INSET,
        y: y + GRID_INSET,
      };
      page.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
      page.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
      page.classList.add("is-pointer-active");
      focusGrid?.classList.add("is-active");
      scheduleIdleEnergy();
    });
  });

  page.addEventListener("pointerleave", () => {
    isIdle = false;
    clearEnergyTimers();
    clearBolts();
    page.classList.remove("is-pointer-active");
    focusGrid?.classList.remove("is-active");
  });
}
