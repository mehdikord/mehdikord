"use client";

import { m, useInView, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { ClusterPanel } from "@/components/hero/ClusterPanel";
import { HeroLayer, useHeroMotion } from "@/components/hero/hero-motion";
import { heroTimeline } from "@/components/hero/HeroCopy";
import { LatencyCard, ThroughputCard, UptimePill } from "@/components/hero/MetricCards";
import { TerminalPanel } from "@/components/hero/TerminalPanel";
import { ease } from "@/components/motion/motion-variants";

/*
 * The operations stage: a cluster topology with a terminal and dashboard
 * tiles layered over it. Designed at a fixed size and scaled down to its
 * column (never up), so the composition holds on every screen. The whole stage tilts toward the
 * pointer and each layer drifts by its depth; live parts pause off-screen.
 */

const DESIGN = { width: 560, height: 508 };

function Rise({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <m.div
      data-reveal=""
      initial={{ opacity: 0, y: 44, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: ease.outExpo, delay }}
    >
      {children}
    </m.div>
  );
}

export function HeroScene() {
  const { px, py, interactive, reduceMotion } = useHeroMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const inView = useInView(hostRef, { amount: 0.15 });
  const running = inView && !reduceMotion;

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? DESIGN.width;
      setScale(width / DESIGN.width);
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const rotateY = useTransform(px, (value) => value * 14);
  const rotateX = useTransform(py, (value) => value * -14);

  return (
    <div
      ref={hostRef}
      dir="ltr"
      className="relative w-full"
      style={{ aspectRatio: `${DESIGN.width} / ${DESIGN.height}`, visibility: scale === null ? "hidden" : undefined }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: DESIGN.width, height: DESIGN.height, transform: `scale(${scale ?? 1})` }}
      >
        <m.div
          className="relative size-full"
          style={interactive ? { rotateX, rotateY, transformPerspective: 1400 } : undefined}
        >
          <HeroLayer depth={1} className="absolute" style={{ left: 48, top: 40, width: 400 }}>
            <Rise delay={heroTimeline.scene}>
              <ClusterPanel running={running} />
            </Rise>
          </HeroLayer>

          <HeroLayer depth={3} className="absolute" style={{ left: 392, top: 0, width: 168 }}>
            <Rise delay={heroTimeline.scene + 0.3}>
              <LatencyCard running={running} />
            </Rise>
          </HeroLayer>

          <HeroLayer depth={2.2} className="absolute" style={{ left: 0, top: 310, width: 336 }}>
            <Rise delay={heroTimeline.scene + 0.18}>
              <TerminalPanel running={running} animate={!reduceMotion} />
            </Rise>
          </HeroLayer>

          <HeroLayer depth={2.6} className="absolute" style={{ left: 404, top: 342, width: 156 }}>
            <Rise delay={heroTimeline.scene + 0.42}>
              <ThroughputCard running={running} />
            </Rise>
          </HeroLayer>

          <HeroLayer depth={1.6} className="absolute" style={{ left: 6, top: 8 }}>
            <Rise delay={heroTimeline.scene + 0.52}>
              <UptimePill />
            </Rise>
          </HeroLayer>
        </m.div>
      </div>
    </div>
  );
}
