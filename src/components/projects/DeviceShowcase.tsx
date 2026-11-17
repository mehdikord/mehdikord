"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Lock, Maximize2, MousePointer2, RotateCw } from "lucide-react";
import { useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { ShotDialog } from "@/components/projects/ShotViewer";
import { useMediaQuery, usePinned } from "@/hooks/use-media-query";
import { localizeDigits } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export interface DeviceShowcaseLabels {
  screen: string;
  hint: string;
  fullPage: string;
  fullPageAria: string;
  close: string;
  pageSize: string;
  scrolled: string;
}

interface DeviceShowcaseProps {
  title: string;
  /** Server-rendered full-length screenshot for the screen. */
  screen: ReactNode;
  /** The same screenshot for the full-page viewer (lazy until opened). */
  viewer: ReactNode;
  /** Server-rendered tiny copy, blurred behind the device. */
  ambient: ReactNode;
  /** Height ÷ width of the screenshot. */
  aspect: number;
  /** Shown in the address bar: the live host, or the title. */
  address: string;
  /** Pixel size of the stored page, for the readout; omitted for the default image. */
  pageSize?: { width: number; height: number };
  labels: DeviceShowcaseLabels;
}

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
/** Scroll held at the top and bottom of the page while pinned, as a share of the track. */
const HOLD = 0.07;
/** Page scroll spent per pixel the site scrolls inside the screen. */
const SCROLL_RATIO = 0.55;

/**
 * The project's page running on a desktop display. On large screens the
 * display pins and the site scrolls inside it as the visitor scrolls — eased
 * like a real trackpad, with an overlay scrollbar that wakes while moving.
 * Elsewhere the page scrolls inside the screen as the device passes through
 * the viewport. The whole page opens in a full-screen viewer either way.
 */
export function DeviceShowcase({ title, screen, viewer, ambient, aspect, address, pageSize, labels }: DeviceShowcaseProps) {
  const locale = useLocale();
  const pinned = usePinned();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const trackRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [trackHeight, setTrackHeight] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // While pinned: progress through the tall track. Otherwise: the device crossing the viewport.
  const { scrollYProgress: pinProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const { scrollYProgress: passProgress } = useScroll({ target: trackRef, offset: ["start 0.9", "end 0.15"] });
  const { scrollYProgress: enterProgress } = useScroll({ target: trackRef, offset: ["start end", "start 0.15"] });
  const page = useSpring(0, { stiffness: 170, damping: 30, mass: 0.7 });

  // How far the page can travel inside the screen, and how long the pinned track must be for it.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () => {
      const pageHeight = viewport.clientWidth * aspect;
      const travel = Math.max(0, pageHeight - viewport.clientHeight);
      viewport.style.setProperty("--travel", travel.toFixed(1));
      viewport.style.setProperty("--thumb", pageHeight > 0 ? Math.min(1, viewport.clientHeight / pageHeight).toFixed(4) : "1");
      const screens = window.innerHeight;
      setTrackHeight(Math.round(screens + Math.min(Math.max(travel * SCROLL_RATIO, screens * 1.1), screens * 3.6)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [aspect]);

  // Scroll position → target position of the page inside the screen (eased by the spring).
  useEffect(() => {
    if (reduceMotion) {
      page.jump(0);
      return;
    }
    const source = pinned ? pinProgress : passProgress;
    const toTarget = (raw: number) => (pinned ? clamp01((raw - HOLD) / (1 - HOLD * 2)) : clamp01(raw));
    page.set(toTarget(source.get()));
    return source.on("change", (raw) => page.set(toTarget(raw)));
  }, [pinned, reduceMotion, pinProgress, passProgress, page]);

  // Eased position → the screen, its scrollbar and the readout. Written to the DOM, not state.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let idle = 0;
    const draw = (value: number) => {
      viewport.style.setProperty("--p", value.toFixed(4));
      viewport.dataset.scrolling = "true";
      window.clearTimeout(idle);
      idle = window.setTimeout(() => delete viewport.dataset.scrolling, 700);
      if (percentRef.current) percentRef.current.textContent = localizeDigits(locale, Math.round(value * 100));
      hintRef.current?.toggleAttribute("data-hidden", value > 0.015);
    };
    draw(page.get());
    delete viewport.dataset.scrolling;
    const unsubscribe = page.on("change", draw);
    return () => {
      unsubscribe();
      window.clearTimeout(idle);
    };
  }, [page, locale]);

  // The display tips up from the desk as it arrives.
  useEffect(() => {
    const device = deviceRef.current;
    if (!device) return;
    if (reduceMotion) {
      device.style.removeProperty("transform");
      return;
    }
    const apply = (raw: number) => {
      const t = 1 - (1 - clamp01(raw)) ** 3;
      device.style.transform = `translate3d(0, ${((1 - t) * 7).toFixed(2)}%, 0) rotateX(${((1 - t) * 22).toFixed(2)}deg) scale(${(0.9 + t * 0.1).toFixed(4)})`;
    };
    apply(enterProgress.get());
    return enterProgress.on("change", apply);
  }, [reduceMotion, enterProgress]);

  const sizeLabel = pageSize
    ? `${localizeDigits(locale, pageSize.width)} × ${localizeDigits(locale, pageSize.height)}`
    : null;

  return (
    <div
      ref={trackRef}
      className="device-track relative"
      style={pinned && trackHeight ? { height: trackHeight } : undefined}
    >
      <div className="device-sticky">
        <figure className="device-stage mx-auto" aria-label={`${labels.screen}: ${title}`}>
          <div ref={deviceRef} className="device">
            <div aria-hidden className="device-ambient">
              {ambient}
            </div>

            <div className="device-body">
              <div className="device-glass">
                <span aria-hidden className="device-camera" />
                <div className="device-screen">
                  <div aria-hidden className="device-bar">
                    <span className="device-lights">
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="device-nav">
                      <ChevronLeft />
                      <ChevronRight />
                      <RotateCw />
                    </span>
                    <span dir="ltr" className="device-address">
                      <Lock />
                      <span>{address}</span>
                    </span>
                    <span className="device-nav device-nav-end">
                      <ArrowUpRight />
                    </span>
                  </div>

                  <div
                    ref={viewportRef}
                    className="device-viewport"
                    role="button"
                    tabIndex={0}
                    aria-label={labels.fullPageAria}
                    onClick={() => setViewerOpen(true)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setViewerOpen(true);
                      }
                    }}
                  >
                    <div className="device-page">{screen}</div>
                    <span aria-hidden className="device-scrollbar">
                      <span />
                    </span>
                  </div>

                  <span aria-hidden className="device-glare" />
                </div>
              </div>
            </div>

            <div aria-hidden className="device-neck" />
            <div aria-hidden className="device-foot" />
          </div>
        </figure>

        <div className="device-caption mx-auto mt-6 flex items-center justify-between gap-4 md:mt-8">
          <p className="label-mono flex min-w-0 items-center gap-3 text-fg-subtle">
            <span className="hidden truncate sm:inline">{labels.pageSize}</span>
            {sizeLabel ? (
              <span dir="ltr" className="shrink-0 text-fg-muted">
                {sizeLabel} px
              </span>
            ) : null}
            <span aria-hidden className="hidden h-px w-8 bg-line-strong md:block" />
            <span className="hidden shrink-0 md:inline">
              {labels.scrolled} <span ref={percentRef} className="inline-block min-w-[3ch] text-end text-fg tabular-nums">{localizeDigits(locale, 0)}</span>
              {locale === "fa" ? "٪" : "%"}
            </span>
          </p>

          <p ref={hintRef} className={cn("device-hint label-mono hidden items-center gap-2 text-fg-subtle", pinned && !reduceMotion && "lg:flex")}>
            <MousePointer2 aria-hidden className="size-3.5" />
            {labels.hint}
          </p>

          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            aria-label={labels.fullPageAria}
            className="group inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 text-[0.8125rem] font-medium text-fg transition-colors duration-300 hover:border-accent/60 hover:bg-accent-soft"
          >
            <Maximize2 aria-hidden className="size-3.5 text-accent transition-transform duration-500 ease-out-expo group-hover:scale-110" />
            {labels.fullPage}
          </button>
        </div>
      </div>

      <ShotDialog open={viewerOpen} onClose={() => setViewerOpen(false)} title={title} address={address} closeLabel={labels.close}>
        {viewer}
      </ShotDialog>
    </div>
  );
}
