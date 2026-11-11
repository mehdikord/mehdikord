"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

import { useAboutStage, useStageProgress } from "@/components/about/AboutStage";

/*
 * An exploded axonometric view of a system I build. Six slabs — from the
 * interface down to the engineer it all rests on — sit stacked as one block.
 * Scrolling takes the block apart: the slabs separate and turn, labels draw
 * out, and an inspection gap travels down the stack until the foundation is
 * exposed. The pointer tilts the whole stack and opens the gap above the
 * layer it hovers (as do the labels).
 *
 * Orthographic projection: every slab is an affine image of a flat square,
 * so each face is a single SVG `matrix()` and its contents stay crisp. All
 * geometry is written to the DOM from one rAF loop (paused off-screen);
 * React only renders the static markup.
 */

const VW = 640;
const VH = 720;
const HALF = 100;
const CX = 222;
const CY = 372;
const THICK = 9;
const GAP_CLOSED = 15;
const GAP_OPEN = 92;
const FOCUS_AMP = 92;
const LABEL_X = 446;
const DEG = Math.PI / 180;

const CORNERS: readonly (readonly [number, number])[] = [
  [-HALF, -HALF],
  [HALF, -HALF],
  [HALF, HALF],
  [-HALF, HALF],
];

type LayerKind = "foundation" | "data" | "async" | "services" | "edge" | "interface";

interface Layer {
  kind: LayerKind;
  name: string;
  sub: string;
}

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutBack = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));
const fract = (value: number) => value - Math.floor(value);
const pad2 = (value: number) => String(value).padStart(2, "0");

export interface SystemStackProps {
  initials: string;
  years: number;
  figureLabel: string;
  liveLabel: string;
  hint: string;
  caption: string;
}

export function SystemStack({ initials, years, figureLabel, liveLabel, hint, caption }: SystemStackProps) {
  const figureRef = useRef<HTMLElement>(null);
  const progress = useStageProgress(figureRef, 0.02, 0.86, ["start 0.85", "end 0.35"]);
  const { px, py, interactive, reduceMotion } = useAboutStage();

  const layers: Layer[] = [
    { kind: "foundation", name: "The engineer", sub: `${initials} · ${years}+ yrs · judgement` },
    { kind: "data", name: "Data", sub: "mysql · redis · search" },
    { kind: "async", name: "Async", sub: "queues · workers · events" },
    { kind: "services", name: "Services", sub: "laravel · modular · stateless" },
    { kind: "edge", name: "Edge", sub: "nginx · tls · rate limits" },
    { kind: "interface", name: "Interface", sub: "web · mobile · partners" },
  ];
  const count = layers.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const plateRefs = useRef<(SVGGElement | null)[]>([]);
  const faceRefs = useRef<(SVGGElement | null)[]>([]);
  const sideARefs = useRef<(SVGPolygonElement | null)[]>([]);
  const sideBRefs = useRef<(SVGPolygonElement | null)[]>([]);
  const litRefs = useRef<(SVGGElement | null)[]>([]);
  const leaderRefs = useRef<(SVGLineElement | null)[]>([]);
  const zTextRefs = useRef<(SVGTextElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beamRef = useRef<SVGLineElement>(null);
  const packetRefs = useRef<(SVGCircleElement | null)[]>([]);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  /** Pointer height over the stack in viewBox units, or null when away. */
  const pointerY = useRef<number | null>(null);
  const hovered = useRef<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let scale = stage.clientWidth / VW;
    let frame = 0;
    let inView = false;
    let introStart: number | null = reduceMotion ? -1e9 : null;
    let readout = "";
    const focus = { f: count - 1, a: 0 };
    const zTexts: string[] = [];
    const started = performance.now();

    const draw = (now: number, settle: boolean) => {
      const t = (now - started) / 1000;
      const u = progress.get();
      const explode = easeInOut(clamp01(u / 0.55));
      const scan = clamp01((u - 0.38) / 0.56);
      const live = !reduceMotion;

      const yaw = (45 - explode * 16 + px.get() * 30 + (live ? Math.sin(t * 0.33) * 2.4 * explode : 0)) * DEG;
      const pitch = (50 + explode * 10 - py.get() * 12) * DEG;
      const sinA = Math.sin(yaw);
      const cosA = Math.cos(yaw);
      const sinB = Math.sin(pitch);
      const cosB = Math.cos(pitch);
      const a = cosA;
      const b = sinA * cosB;
      const c = -sinA;
      const d = cosA * cosB;
      const gap = GAP_CLOSED + (GAP_OPEN - GAP_CLOSED) * explode;
      const mid = (count - 1) / 2;

      // Where the inspection gap opens: a hovered label, the pointer, or the scan.
      let target: number;
      let amount: number;
      if (hovered.current !== null && explode > 0.4) {
        target = hovered.current;
        amount = 1;
      } else if (pointerY.current !== null && explode > 0.4) {
        const raw = (CY - pointerY.current) / (gap * sinB) + mid + 0.35;
        target = Math.round(Math.min(count - 1, Math.max(0, raw)));
        amount = 1;
      } else {
        target = (count - 1) * (1 - scan);
        amount = smooth(0, 0.12, scan) * explode;
      }
      const ease = settle ? 1 : 0.12;
      focus.f += (target - focus.f) * ease;
      focus.a += (amount - focus.a) * ease;

      // Intro: on first view the slabs drop into place, bottom first.
      if (introStart === null && inView) introStart = now;
      const intro = introStart === null ? 0 : (now - introStart) / 1000;

      const centersY: number[] = [];
      for (let index = 0; index < count; index += 1) {
        const drop = reduceMotion ? 1 : clamp01((intro - index * 0.09) / 0.85);
        const landed = easeOutBack(drop);
        const bob = live ? Math.sin(t * 1.15 + index * 1.7) * 2.2 * explode : 0;
        const lift = focus.a * FOCUS_AMP * (sigmoid((index - focus.f - 0.5) * 4) - 0.5);
        const z = (index - mid) * gap + lift + bob + (1 - landed) * 220;
        const fy = CY - z * sinB;
        centersY.push(fy);

        const plate = plateRefs.current[index];
        if (plate) plate.style.opacity = drop.toFixed(3);
        faceRefs.current[index]?.setAttribute(
          "transform",
          `matrix(${a.toFixed(4)} ${b.toFixed(4)} ${c.toFixed(4)} ${d.toFixed(4)} ${CX} ${fy.toFixed(2)})`,
        );

        // Screen corners, the lowest one (front) and the rightmost one (label anchor).
        const xs: number[] = [];
        const ys: number[] = [];
        let front = 0;
        let right = 0;
        let left = 0;
        for (let k = 0; k < 4; k += 1) {
          const [lx, ly] = CORNERS[k] as readonly [number, number];
          xs.push(CX + a * lx + c * ly);
          ys.push(fy + b * lx + d * ly);
          if ((ys[k] as number) > (ys[front] as number)) front = k;
          if ((xs[k] as number) > (xs[right] as number)) right = k;
          if ((xs[k] as number) < (xs[left] as number)) left = k;
        }
        const depth = THICK * sinB;
        const side = (from: number, to: number) =>
          `${xs[from]!.toFixed(1)},${ys[from]!.toFixed(1)} ${xs[to]!.toFixed(1)},${ys[to]!.toFixed(1)} ${xs[to]!.toFixed(1)},${(ys[to]! + depth).toFixed(1)} ${xs[from]!.toFixed(1)},${(ys[from]! + depth).toFixed(1)}`;
        sideARefs.current[index]?.setAttribute("points", side(front, (front + 1) % 4));
        sideBRefs.current[index]?.setAttribute("points", side((front + 3) % 4, front));

        // Light: the inspected layer, plus the foundation once the scan lands.
        const lit = Math.max(
          Math.max(0, 1 - Math.abs(index - focus.f)) * focus.a,
          index === 0 ? smooth(0.86, 1, scan) : 0,
        );
        const litGroup = litRefs.current[index];
        if (litGroup) litGroup.style.opacity = lit.toFixed(3);

        // Labels draw out top first as the block opens.
        const order = count - 1 - index;
        const shown = clamp01((explode - 0.28 - order * 0.07) / 0.22) * drop;
        const rx = xs[right] as number;
        const ry = ys[right] as number;
        const leader = leaderRefs.current[index];
        if (leader) {
          leader.setAttribute("x1", (rx + 6).toFixed(1));
          leader.setAttribute("y1", ry.toFixed(1));
          leader.setAttribute("x2", (rx + 6 + (LABEL_X - 14 - rx - 6) * shown).toFixed(1));
          leader.setAttribute("y2", ry.toFixed(1));
          leader.style.opacity = shown.toFixed(3);
        }
        const label = labelRefs.current[index];
        if (label) {
          label.style.transform = `translate3d(0, ${(ry * scale).toFixed(1)}px, 0) translateY(-50%)`;
          label.style.opacity = shown.toFixed(3);
          label.style.setProperty("--lit", lit.toFixed(3));
          label.style.pointerEvents = shown > 0.6 ? "auto" : "none";
        }

        const zText = zTextRefs.current[index];
        if (zText) {
          const units = Math.min(99, Math.round(Math.abs(z) / 3));
          const value = `z ${units === 0 ? "±" : z > 0 ? "+" : "−"}${pad2(units)}`;
          if (zTexts[index] !== value) {
            zText.textContent = value;
            zTexts[index] = value;
          }
          zText.setAttribute("x", ((xs[left] as number) - 12).toFixed(1));
          zText.setAttribute("y", ((ys[left] as number) + 3).toFixed(1));
          zText.style.opacity = (shown * 0.8).toFixed(3);
        }
      }

      // The data axis through every slab, with requests going down and responses coming up.
      const top = centersY[count - 1] as number;
      const bottom = centersY[0] as number;
      const beam = beamRef.current;
      if (beam) {
        beam.setAttribute("y1", (top - 4).toFixed(1));
        beam.setAttribute("y2", bottom.toFixed(1));
        beam.style.opacity = (0.25 + explode * 0.55).toFixed(3);
      }
      packetRefs.current.forEach((packet, index) => {
        if (!packet) return;
        const down = index % 2 === 0;
        const phase = fract(t * (down ? 0.32 : 0.24) + index * 0.29);
        const y = down ? top + (bottom - top) * phase : bottom - (bottom - top) * phase;
        packet.setAttribute("cy", y.toFixed(1));
        packet.style.opacity = (live ? explode * Math.sin(phase * Math.PI) : 0).toFixed(3);
      });

      const shadow = shadowRef.current;
      if (shadow) {
        shadow.setAttribute("cy", (bottom + 34 + explode * 26).toFixed(1));
        shadow.setAttribute("ry", (HALF * 1.9 * cosB).toFixed(1));
        shadow.style.opacity = (0.45 + explode * 0.4).toFixed(3);
      }

      const bar = barRef.current;
      if (bar) bar.style.transform = `scaleX(${u.toFixed(4)})`;

      const readoutIndex = Math.round(Math.min(count - 1, Math.max(0, focus.f)));
      const layer = layers[readoutIndex];
      const next =
        focus.a > 0.35 && layer
          ? `L${pad2(readoutIndex + 1)}/${pad2(count)} · ${layer.name}`
          : `L${pad2(count)}/${pad2(count)} · assembled`;
      if (next !== readout && readoutRef.current) {
        readoutRef.current.textContent = next;
        readout = next;
      }
    };

    const tick = (now: number) => {
      frame = 0;
      draw(now, false);
      if (inView && document.visibilityState === "visible") frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      if (reduceMotion) {
        draw(performance.now(), true);
        return;
      }
      if (!frame && inView && document.visibilityState === "visible") frame = requestAnimationFrame(tick);
    };
    const suspend = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? false;
      if (inView) resume();
      else suspend();
    });
    observer.observe(stage);
    const resizer = new ResizeObserver(() => {
      scale = stage.clientWidth / VW;
      draw(performance.now(), true);
    });
    resizer.observe(stage);
    const handleVisibility = () => (document.visibilityState === "visible" ? resume() : suspend());
    document.addEventListener("visibilitychange", handleVisibility);
    // With reduced motion nothing loops, so redraw whenever the progress changes.
    const unsubscribe = reduceMotion ? progress.on("change", () => draw(performance.now(), true)) : undefined;

    draw(performance.now(), true);

    return () => {
      suspend();
      observer.disconnect();
      resizer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      unsubscribe?.();
    };
    // `layers` is rebuilt from props each render; its contents only change with them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, px, py, reduceMotion, count, initials, years]);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * VW;
    pointerY.current = x < LABEL_X - 20 ? ((event.clientY - rect.top) / rect.height) * VH : null;
  }

  return (
    <figure ref={figureRef} className="relative">
      <div className="label-mono relative flex items-center justify-between gap-4 text-fg-subtle">
        <span>{figureLabel}</span>
        <span aria-hidden dir="ltr" className="flex shrink-0 items-center gap-2 whitespace-nowrap text-accent">
          <span className="sr-only sm:not-sr-only">{liveLabel}</span>
          <span ref={readoutRef} className="tabular-nums">
            L{pad2(count)}/{pad2(count)} · assembled
          </span>
        </span>
      </div>

      <div
        ref={stageRef}
        dir="ltr"
        aria-hidden
        onPointerMove={handleMove}
        onPointerLeave={() => {
          pointerY.current = null;
        }}
        className="stack-stage relative mt-4 aspect-[640/720] w-full select-none pin:mx-auto pin:w-[min(100%,calc((100svh-var(--nav-h)-10rem)*0.8889))]"
      >
        <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 size-full overflow-visible">
          <defs>
            <radialGradient id="stack-shadow">
              <stop offset="0%" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.32 }} />
              <stop offset="55%" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.08 }} />
              <stop offset="100%" style={{ stopColor: "var(--color-accent)", stopOpacity: 0 }} />
            </radialGradient>
            <linearGradient id="stack-sheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--color-tint)", stopOpacity: 0.09 }} />
              <stop offset="60%" style={{ stopColor: "var(--color-tint)", stopOpacity: 0.015 }} />
              <stop offset="100%" style={{ stopColor: "var(--color-tint)", stopOpacity: 0 }} />
            </linearGradient>
            <linearGradient id="stack-initials" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--t-serif-start)" }} />
              <stop offset="55%" style={{ stopColor: "var(--color-accent)" }} />
              <stop offset="100%" style={{ stopColor: "var(--color-indigo)" }} />
            </linearGradient>
          </defs>

          <ellipse ref={shadowRef} cx={CX} cy={CY + 240} rx={HALF * 2.1} ry={HALF} fill="url(#stack-shadow)" />

          {layers.map((layer, index) => (
            <g
              key={layer.kind}
              ref={(node) => {
                plateRefs.current[index] = node;
              }}
              style={{ opacity: 0 }}
            >
              <polygon
                ref={(node) => {
                  sideARefs.current[index] = node;
                }}
                style={{ fill: "var(--color-ink-800)", stroke: "var(--color-line-strong)" }}
                strokeWidth={1}
                strokeLinejoin="round"
              />
              <polygon
                ref={(node) => {
                  sideBRefs.current[index] = node;
                }}
                style={{ fill: "var(--color-ink-700)", stroke: "var(--color-line-strong)" }}
                strokeWidth={1}
                strokeLinejoin="round"
              />
              <g
                ref={(node) => {
                  faceRefs.current[index] = node;
                }}
              >
                <rect
                  x={-HALF}
                  y={-HALF}
                  width={HALF * 2}
                  height={HALF * 2}
                  rx={7}
                  style={{ fill: "var(--color-ink-900)", stroke: "var(--color-line-strong)" }}
                  fillOpacity={0.94}
                  vectorEffect="non-scaling-stroke"
                />
                <rect x={-HALF} y={-HALF} width={HALF * 2} height={HALF * 2} rx={7} fill="url(#stack-sheen)" />
                <g
                  ref={(node) => {
                    litRefs.current[index] = node;
                  }}
                  style={{ opacity: 0 }}
                >
                  <rect
                    x={-HALF}
                    y={-HALF}
                    width={HALF * 2}
                    height={HALF * 2}
                    rx={7}
                    style={{ fill: "var(--color-accent)", stroke: "var(--color-accent)" }}
                    fillOpacity={0.09}
                    strokeWidth={1.4}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
                <LayerArt kind={layer.kind} initials={initials} years={years} />
              </g>
              <line
                ref={(node) => {
                  leaderRefs.current[index] = node;
                }}
                style={{ stroke: "var(--color-fg-subtle)", opacity: 0 }}
                strokeWidth={1}
                strokeDasharray="2 3"
              />
              <text
                ref={(node) => {
                  zTextRefs.current[index] = node;
                }}
                textAnchor="end"
                fontSize={10}
                letterSpacing={1}
                className="fill-fg-subtle font-mono"
                style={{ opacity: 0 }}
              />
            </g>
          ))}

          <line
            ref={beamRef}
            x1={CX}
            x2={CX}
            style={{ stroke: "var(--color-accent)", opacity: 0 }}
            strokeWidth={1}
            strokeDasharray="1 5"
            strokeLinecap="round"
          />
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <circle
              key={index}
              ref={(node) => {
                packetRefs.current[index] = node;
              }}
              cx={CX}
              r={index % 2 === 0 ? 2.6 : 2}
              style={{ fill: index % 2 === 0 ? "var(--color-accent)" : "var(--color-signal)", opacity: 0 }}
            />
          ))}
        </svg>

        {layers.map((layer, index) => (
          <div
            key={layer.kind}
            ref={(node) => {
              labelRefs.current[index] = node;
            }}
            onPointerEnter={() => {
              hovered.current = index;
            }}
            onPointerLeave={() => {
              hovered.current = null;
            }}
            className="stack-label absolute top-0 cursor-default ps-2 will-change-transform"
            style={{ left: `${((LABEL_X - 8) / VW) * 100}%`, opacity: 0, pointerEvents: "none" }}
          >
            <span className="flex items-baseline gap-2">
              <span className="font-mono text-[0.625rem] text-accent">{pad2(index + 1)}</span>
              <span className="stack-label-name text-[0.6875rem] font-medium tracking-[0.06em] whitespace-nowrap uppercase sm:text-xs sm:tracking-[0.12em]">
                {layer.name}
              </span>
            </span>
            <span className="mt-0.5 hidden font-mono text-[0.625rem] whitespace-nowrap text-fg-subtle sm:block">
              {layer.sub}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="label-mono shrink-0 text-fg-subtle">{hint}</span>
        <span aria-hidden className="relative h-px flex-1 overflow-hidden bg-line">
          <span ref={barRef} className="absolute inset-0 origin-left bg-accent rtl:origin-right" style={{ transform: "scaleX(0)" }} />
        </span>
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}

/* ── Slab artwork, drawn flat in slab coordinates (−100…100) ───────────── */

const line = { vectorEffect: "non-scaling-stroke" as const, fill: "none", strokeWidth: 1 };
const strong = { stroke: "var(--color-line-strong)" };
const accent = { stroke: "var(--color-accent)" };

function LayerArt({ kind, initials, years }: { kind: LayerKind; initials: string; years: number }): ReactNode {
  switch (kind) {
    case "interface":
      return (
        <g>
          <rect x={-84} y={-74} width={116} height={86} rx={6} {...line} style={strong} />
          <line x1={-84} y1={-60} x2={32} y2={-60} {...line} style={strong} />
          {[-76, -69, -62].map((cx) => (
            <circle key={cx} cx={cx} cy={-67} r={1.8} style={{ fill: "var(--color-fg-subtle)" }} />
          ))}
          <rect x={-74} y={-50} width={58} height={6} rx={2} style={{ fill: "var(--color-line-strong)" }} />
          <rect x={-74} y={-39} width={84} height={4} rx={2} style={{ fill: "var(--color-line)" }} />
          <rect x={-74} y={-29} width={70} height={4} rx={2} style={{ fill: "var(--color-line)" }} />
          <rect x={-74} y={-18} width={44} height={22} rx={3} {...line} style={{ ...accent, fill: "var(--color-accent-soft)" }} />
          <rect x={-24} y={-18} width={44} height={22} rx={3} {...line} style={strong} />
          <rect x={44} y={-66} width={42} height={76} rx={8} {...line} style={strong} />
          <rect x={51} y={-55} width={28} height={40} rx={3} style={{ fill: "var(--color-accent-soft)" }} />
          <line x1={58} y1={2} x2={72} y2={2} {...line} style={strong} />
          {[-60, 0, 60].map((cx) => (
            <g key={cx}>
              <line x1={cx} y1={50} x2={0} y2={26} {...line} style={strong} strokeDasharray="2 3" />
              <circle cx={cx} cy={56} r={7} {...line} style={strong} />
              <circle cx={cx} cy={56} r={2} style={{ fill: "var(--color-accent)" }} />
            </g>
          ))}
        </g>
      );
    case "edge":
      return (
        <g>
          <circle r={84} {...line} style={strong} strokeDasharray="3 5" />
          <circle r={56} {...line} style={strong} />
          <circle r={28} {...line} style={accent} />
          <line x1={-92} y1={0} x2={92} y2={0} {...line} style={{ stroke: "var(--color-line)" }} />
          <line x1={0} y1={-92} x2={0} y2={92} {...line} style={{ stroke: "var(--color-line)" }} />
          <path d="M0 -14 L11 -9 V2 C11 9 5 13 0 15 C-5 13 -11 9 -11 2 V-9 Z" {...line} style={accent} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const x = Math.cos(angle * DEG) * 56;
            const y = Math.sin(angle * DEG) * 56;
            return <rect key={angle} x={x - 3.5} y={y - 3.5} width={7} height={7} rx={1.5} style={{ fill: "var(--color-ink-700)", stroke: "var(--color-accent)" }} {...{ vectorEffect: "non-scaling-stroke" }} />;
          })}
        </g>
      );
    case "services":
      return (
        <g>
          {[-1, 0, 1].map((row) =>
            [-1, 0, 1].map((col) => {
              const lit = row === 0;
              return (
                <g key={`${row}${col}`}>
                  <rect
                    x={col * 58 - 22}
                    y={row * 58 - 22}
                    width={44}
                    height={44}
                    rx={5}
                    {...line}
                    style={lit ? { ...accent, fill: "var(--color-accent-soft)" } : strong}
                  />
                  {lit ? <circle cx={col * 58 + 13} cy={-13} r={2.4} style={{ fill: "var(--color-signal)" }} /> : null}
                  <rect x={col * 58 - 13} y={row * 58 + 6} width={18} height={3} rx={1.5} style={{ fill: "var(--color-line-strong)" }} />
                </g>
              );
            }),
          )}
          <line x1={-36} y1={0} x2={-22} y2={0} {...line} style={accent} />
          <line x1={22} y1={0} x2={36} y2={0} {...line} style={accent} />
        </g>
      );
    case "async":
      return (
        <g>
          {[-57, -19, 19, 57].map((y, lane) => (
            <g key={y}>
              <rect x={-88} y={y - 11} width={150} height={22} rx={5} {...line} style={strong} />
              <line x1={-80} y1={y} x2={54} y2={y} {...line} className="flow-line" style={accent} strokeWidth={1.4} />
              {[0, 1, 2].slice(0, 3 - (lane % 2)).map((job) => (
                <rect key={job} x={-78 + job * 22 + lane * 6} y={y - 5} width={14} height={10} rx={2} style={{ fill: "var(--color-accent-soft)" }} />
              ))}
              <circle cx={80} cy={y} r={8} {...line} style={strong} />
              <circle cx={80} cy={y} r={2.6} style={{ fill: lane === 1 ? "var(--color-signal)" : "var(--color-fg-subtle)" }} />
            </g>
          ))}
        </g>
      );
    case "data":
      return (
        <g>
          {[
            { cx: -46, cy: -38, r: 34, lit: true },
            { cx: 44, cy: -44, r: 26, lit: false },
            { cx: 8, cy: 46, r: 30, lit: false },
          ].map((disc) => (
            <g key={disc.cx}>
              <circle cx={disc.cx} cy={disc.cy} r={disc.r} {...line} style={disc.lit ? { ...accent, fill: "var(--color-accent-soft)" } : strong} />
              <circle cx={disc.cx} cy={disc.cy} r={disc.r - 9} {...line} style={strong} />
              <circle cx={disc.cx} cy={disc.cy} r={disc.r - 18} {...line} style={{ stroke: "var(--color-line)" }} />
            </g>
          ))}
          <line x1={-30} y1={-8} x2={-6} y2={20} {...line} style={accent} strokeDasharray="3 3" />
          <line x1={18} y1={-44} x2={-12} y2={-40} {...line} style={strong} />
          <rect x={58} y={36} width={26} height={26} rx={4} {...line} style={strong} strokeDasharray="2 3" />
        </g>
      );
    case "foundation":
      return (
        <g>
          {[-75, -50, -25, 0, 25, 50, 75].map((value) => (
            <g key={value}>
              <line x1={value} y1={-92} x2={value} y2={92} {...line} style={{ stroke: "var(--color-line)" }} />
              <line x1={-92} y1={value} x2={92} y2={value} {...line} style={{ stroke: "var(--color-line)" }} />
            </g>
          ))}
          <rect x={-86} y={-86} width={172} height={172} rx={4} {...line} style={accent} strokeDasharray="4 4" />
          <text
            x={0}
            y={22}
            textAnchor="middle"
            fontSize={84}
            className="font-serif italic"
            style={{ fill: "url(#stack-initials)" }}
          >
            {initials}
          </text>
          <text x={-80} y={-72} fontSize={8} letterSpacing={1.6} className="fill-fg-subtle font-mono">
            ROOT
          </text>
          <text x={80} y={80} textAnchor="end" fontSize={8} letterSpacing={1.6} className="fill-accent font-mono">
            {`${years}+ YRS`}
          </text>
        </g>
      );
  }
}
