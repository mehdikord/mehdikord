"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, m, useMotionValue, useScroll, useSpring, type Variants } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from "react";

import { ease } from "@/components/motion/motion-variants";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useFinePointer, useMediaQuery, usePinned } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export interface ShowcaseItem {
  slug: string;
  href: string;
  title: string;
  /** Pre-formatted, e.g. "P/01" or "پروژه ۰۱". */
  indexLabel: string;
  /** Short number among all projects, e.g. "08". */
  number: string;
  /** Position among the featured projects, e.g. "02". */
  order: string;
  category: string;
  period: string;
  description: string;
  role: string;
  technologies: readonly string[];
  ctaLabel: string;
  /** Shown in the frame's address bar: the live host, or the title. */
  address: string;
  /** Height ÷ width of the visual; tall page shots scroll inside the frame. */
  aspect: number;
  /** Server-rendered visual at its natural aspect ratio. */
  screen: ReactNode;
  /** Server-rendered tiny copy of the visual for the glow behind the frame. */
  ambient: ReactNode;
  /** Server-rendered "default image" badge, when applicable. */
  notice: ReactNode;
}

interface ShowcaseLabels {
  role: string;
  stack: string;
  hint: string;
}

interface WorkShowcaseProps {
  items: readonly ShowcaseItem[];
  labels: ShowcaseLabels;
}

/**
 * Homepage showcase, built so the work itself is the centre of attention.
 * Large screens: a pinned screening room — one big, unobstructed frame at a
 * time, the screenshot scrolling inside it as the visitor scrolls, then the
 * next project rising into place while the last one sinks away. Details sit
 * beside the frame, never on top of it. Elsewhere (small screens, short
 * viewports, reduced motion): the same frames in a calm vertical list.
 */
export function WorkShowcase({ items, labels }: WorkShowcaseProps) {
  return (
    <>
      <div className="hidden pin:block">
        <PinnedShowcase items={items} labels={labels} />
      </div>
      <div className="container-page pin:hidden">
        <ShowcaseList items={items} labels={labels} />
      </div>
    </>
  );
}

/* ── Shared pieces ─────────────────────────────────────────────────────── */

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/**
 * Fits the visual inside a frame: how far a tall shot can travel (`--max-shift`,
 * as a share of its own height) or, for a shot that already fits, a slow zoom
 * (`--zoom`) instead. Scroll position arrives separately as `--scroll`.
 */
function useShotFit(frameRef: RefObject<HTMLElement | null>, aspect: number) {
  useEffect(() => {
    const frame = frameRef.current;
    const screen = frame?.querySelector<HTMLElement>("[data-screen]");
    if (!frame || !screen) return;
    const fit = () => {
      const shotHeight = screen.clientWidth * aspect;
      const shift = shotHeight > 0 ? Math.max(0, 1 - screen.clientHeight / shotHeight) : 0;
      frame.style.setProperty("--max-shift", shift.toFixed(4));
      frame.style.setProperty("--zoom", shift < 0.04 ? "0.06" : "0");
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(screen);
    return () => observer.disconnect();
  }, [frameRef, aspect]);
}

interface ProjectFrameProps {
  item: ShowcaseItem;
  frameRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

/** A quiet browser-like frame: a hairline address bar and the screenshot, nothing over it. */
function ProjectFrame({ item, frameRef, className }: ProjectFrameProps) {
  useShotFit(frameRef, item.aspect);
  return (
    <div ref={frameRef} className={cn("work-frame relative flex size-full flex-col overflow-hidden", className)}>
      <div aria-hidden className="flex h-8 shrink-0 items-center gap-3 border-b border-line px-3.5">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-tint/15" />
          <span className="size-2 rounded-full bg-tint/15" />
          <span className="size-2 rounded-full bg-tint/15" />
        </span>
        <span
          dir="ltr"
          className="mx-auto max-w-[60%] truncate rounded-full bg-tint/[0.05] px-3 py-0.5 font-mono text-[0.625rem] text-fg-subtle"
        >
          {item.address}
        </span>
        <span className="w-[2.625rem]" />
      </div>
      <div data-screen className="relative min-h-0 flex-1 overflow-hidden bg-ink-900">
        <div className="work-shot">{item.screen}</div>
        {item.notice}
      </div>
    </div>
  );
}

/** The project's colours, blurred and spilled behind its frame. */
function Ambient({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden className={cn("work-ambient pointer-events-none absolute -inset-[7%] -z-10", className)}>
      <div className="relative size-full">{children}</div>
    </div>
  );
}

interface ProjectInfoProps {
  item: ShowcaseItem;
  labels: ShowcaseLabels;
  /** Heading level inside the section. */
  headingId?: string;
}

const infoStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const infoLine: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: ease.outExpo } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.28, ease: ease.outQuart } },
};

function ProjectInfo({ item, labels }: ProjectInfoProps) {
  return (
    <>
      <m.p variants={infoLine} className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-subtle">
        <span className="text-accent">{item.indexLabel}</span>
        <span>{item.category}</span>
        <span aria-hidden>·</span>
        <span>{item.period}</span>
      </m.p>
      <m.h3
        variants={infoLine}
        className="mt-5 text-[clamp(2.1rem,1.2rem+2.2vw,3.4rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance"
      >
        {item.title}
      </m.h3>
      <m.p variants={infoLine} className="mt-5 max-w-md text-pretty text-fg-muted">
        {item.description}
      </m.p>
      <m.dl variants={infoLine} className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-line pt-6 text-sm">
        <dt className="label-mono pt-0.5 text-fg-subtle">{labels.role}</dt>
        <dd>{item.role}</dd>
        <dt className="label-mono pt-0.5 text-fg-subtle">{labels.stack}</dt>
        <dd dir="ltr" className="font-mono text-[0.75rem] leading-relaxed text-fg-muted rtl:text-right">
          {item.technologies.slice(0, 5).join(" · ")}
        </dd>
      </m.dl>
      <m.div variants={infoLine} className="mt-9">
        <ButtonLink href={item.href} icon="up-right" ariaLabel={`${item.ctaLabel}: ${item.title}`}>
          {item.ctaLabel}
        </ButtonLink>
      </m.div>
    </>
  );
}

/* ── Pinned screening room ─────────────────────────────────────────────── */

/** Scroll held on the first and last project, in project-lengths. */
const HOLD = 0.38;
const pointerSpring = { stiffness: 80, damping: 20, mass: 0.8 };

function PinnedShowcase({ items, labels }: WorkShowcaseProps) {
  const count = items.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const pinned = usePinned();
  const finePointer = useFinePointer();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const interactive = finePointer && !reduceMotion;

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, pointerSpring);
  const py = useSpring(rawY, pointerSpring);

  useEffect(() => {
    if (!pinned) return;
    let queued = 0;
    let current = -1;
    const span = Math.max(1, count - 1 + HOLD * 2);

    const draw = () => {
      queued = 0;
      const raw = scrollYProgress.get() * span - HOLD;
      const base = Math.floor(raw);
      const eased = Math.min(count - 1, Math.max(0, base + smooth(0.26, 0.74, raw - base)));
      const tiltY = px.get() * 9;
      const tiltX = -py.get() * 7;

      for (let index = 0; index < count; index += 1) {
        const wrap = wrapRefs.current[index];
        const frame = wrap?.querySelector<HTMLElement>(".work-frame");
        if (!wrap) continue;
        const d = eased - index;
        let y: number;
        let rx: number;
        let scale: number;
        let opacity: number;
        if (d < 0) {
          // Rising from below, tipping upright as it arrives.
          const a = Math.min(1, -d);
          y = a * 70;
          rx = a * 36;
          scale = 1 - a * 0.05;
          opacity = clamp01(1 - a * 2.4);
        } else {
          // Sinking back into the room.
          const a = Math.min(1, d);
          y = -a * 12;
          rx = -a * 8;
          scale = 1 - a * 0.18;
          opacity = clamp01(1 - a * 1.8);
        }
        wrap.style.transform = `translate3d(0, ${y.toFixed(2)}%, 0) rotateX(${(rx + tiltX).toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        wrap.style.opacity = opacity.toFixed(3);
        wrap.style.visibility = opacity < 0.005 ? "hidden" : "visible";
        wrap.style.pointerEvents = Math.abs(d) < 0.5 ? "auto" : "none";

        const scroll = clamp01((raw - index + 0.36) / 0.72);
        frame?.style.setProperty("--scroll", scroll.toFixed(4));
        const bar = barRefs.current[index];
        if (bar) bar.style.transform = `scaleX(${scroll.toFixed(4)})`;
      }

      const next = Math.min(count - 1, Math.max(0, Math.round(raw)));
      if (next !== current) {
        current = next;
        setActive(next);
      }
    };

    const schedule = () => {
      if (!queued) queued = requestAnimationFrame(draw);
    };
    schedule();
    const unsubscribers = [scrollYProgress.on("change", schedule), px.on("change", schedule), py.on("change", schedule)];
    return () => {
      cancelAnimationFrame(queued);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [pinned, count, scrollYProgress, px, py]);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || event.pointerType !== "mouse") return;
    const stage = event.currentTarget;
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    rawX.set(x / rect.width - 0.5);
    rawY.set(y / rect.height - 0.5);
    stage.style.setProperty("--cx", `${x}px`);
    stage.style.setProperty("--cy", `${y}px`);
    stage.dataset.hover = "true";
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    rawX.set(0);
    rawY.set(0);
    delete event.currentTarget.dataset.hover;
  }

  function jumpTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const span = Math.max(1, count - 1 + HOLD * 2);
    const progress = (index + HOLD) / span;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + progress * (track.offsetHeight - window.innerHeight), behavior: "smooth" });
  }

  const item = items[active];

  return (
    <div ref={trackRef} className="relative" style={{ height: `${count * 95 + 45}svh` }}>
      <div className="sticky top-0 flex h-svh items-center pt-(--nav-h)">
        <div className="container-page grid w-full grid-cols-12 items-center gap-x-10 xl:gap-x-14">
          <div className="col-span-4 flex flex-col">
            <ol className="grid gap-1" aria-label={labels.hint}>
              {items.map((entry, index) => (
                <li key={entry.slug}>
                  <button
                    type="button"
                    onClick={() => jumpTo(index)}
                    aria-current={index === active ? "true" : undefined}
                    className={cn(
                      "group flex w-full items-center gap-4 py-1.5 text-start transition-colors duration-500",
                      index === active ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
                    )}
                  >
                    <span className={cn("font-mono text-xs transition-colors", index === active && "text-accent")}>
                      {entry.order}
                    </span>
                    <span className="relative h-px w-10 shrink-0 overflow-hidden bg-line-strong">
                      <span
                        ref={(node) => {
                          barRefs.current[index] = node;
                        }}
                        className="absolute inset-0 origin-left bg-accent rtl:origin-right"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </span>
                    <span className="truncate text-sm">{entry.title}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-10 min-h-[25rem] xl:mt-14">
              <AnimatePresence mode="wait" initial={false}>
                {item ? (
                  <m.div key={item.slug} variants={infoStagger} initial="hidden" animate="visible" exit="exit">
                    <ProjectInfo item={item} labels={labels} />
                  </m.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div
            ref={stageRef}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className="work-stage relative col-span-8 [perspective:1800px]"
          >
            <div className="relative aspect-[16/10.4] w-full">
              {items.map((entry, index) => (
                <PinnedSlide
                  key={entry.slug}
                  item={entry}
                  index={index}
                  wrapRef={(node) => {
                    wrapRefs.current[index] = node;
                  }}
                />
              ))}
            </div>

            {/* Follows the pointer over the frame. */}
            <span aria-hidden className="work-pill pointer-events-none absolute start-0 top-0 z-50">
              <span className="flex items-center gap-2 rounded-full bg-fg py-2 ps-4 pe-2 text-sm font-medium whitespace-nowrap text-ink-950 shadow-glow">
                {item?.ctaLabel}
                <span className="flex size-6 items-center justify-center rounded-full bg-accent text-white">
                  <ArrowUpRight className="size-3.5 rtl:-scale-x-100" strokeWidth={2} />
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PinnedSlide({ item, index, wrapRef }: { item: ShowcaseItem; index: number; wrapRef: (node: HTMLDivElement | null) => void }) {
  const frameRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 isolate origin-[50%_100%] will-change-transform"
      style={{ zIndex: index + 1, opacity: index === 0 ? 1 : 0 }}
    >
      <Ambient>{item.ambient}</Ambient>
      <Link href={item.href} tabIndex={-1} aria-label={`${item.ctaLabel}: ${item.title}`} className="block size-full">
        <ProjectFrame item={item} frameRef={frameRef} />
      </Link>
    </div>
  );
}

/* ── Vertical list ─────────────────────────────────────────────────────── */

function ShowcaseList({ items, labels }: WorkShowcaseProps) {
  return (
    <ol className="grid gap-20 md:gap-28">
      {items.map((item, index) => (
        <li key={item.slug}>
          <ListEntry item={item} labels={labels} flip={index % 2 === 1} />
        </li>
      ))}
    </ol>
  );
}

function ListEntry({ item, labels, flip }: { item: ShowcaseItem; labels: ShowcaseLabels; flip: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { scrollYProgress } = useScroll({ target: holderRef, offset: ["start 0.85", "end 0.25"] });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (reduceMotion) {
      frame.style.setProperty("--scroll", "0");
      return;
    }
    const apply = (value: number) => frame.style.setProperty("--scroll", value.toFixed(4));
    apply(scrollYProgress.get());
    return scrollYProgress.on("change", apply);
  }, [scrollYProgress, reduceMotion]);

  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <Reveal className={cn("lg:col-span-7", flip && "lg:order-2")}>
        <div ref={holderRef} className="relative isolate aspect-[16/10.4]">
          <Ambient className="opacity-70">{item.ambient}</Ambient>
          <Link href={item.href} tabIndex={-1} aria-label={`${item.ctaLabel}: ${item.title}`} className="block size-full">
            <ProjectFrame item={item} frameRef={frameRef} />
          </Link>
        </div>
      </Reveal>
      <m.div
        className="lg:col-span-5"
        variants={infoStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      >
        <ProjectInfo item={item} labels={labels} />
      </m.div>
    </article>
  );
}
