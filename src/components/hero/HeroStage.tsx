"use client";

import { m, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type PointerEvent } from "react";

import { HeroMotionProvider, type PointerState } from "@/components/hero/hero-motion";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { HeroCopy, type HeroCopyProps } from "@/components/hero/HeroCopy";
import { HeroRail, type HeroRailProps } from "@/components/hero/HeroRail";
import { HeroScene } from "@/components/hero/HeroScene";
import { useFinePointer, useMediaQuery } from "@/hooks/use-media-query";

export interface HeroStageProps extends HeroCopyProps {
  rail: HeroRailProps;
}

const pointerSpring = { stiffness: 70, damping: 22, mass: 0.9 };

/**
 * Client root of the hero. Tracks the pointer (normalised for parallax, in
 * pixels for the canvas and the CSS spotlight) and the hero's scroll
 * progress, then shares both with the backdrop, copy, scene and rail.
 */
export function HeroStage({ rail, ...copy }: HeroStageProps) {
  const ref = useRef<HTMLElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false });
  const finePointer = useFinePointer();
  // Hydration-safe (false on the server and during hydration), unlike `useReducedMotion`.
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const interactive = finePointer && !reduceMotion;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, pointerSpring);
  const py = useSpring(rawY, pointerSpring);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const sceneOpacity = useTransform(scrollYProgress, [0.1, 0.75], [1, 0]);
  const railOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  function handleMove(event: PointerEvent<HTMLElement>) {
    if (!interactive || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    rawX.set(x / rect.width - 0.5);
    rawY.set(y / rect.height - 0.5);
    pointer.current = { x, y, active: true };

    const { style } = event.currentTarget;
    style.setProperty("--mx", `${x}px`);
    style.setProperty("--my", `${y}px`);
    style.setProperty("--spot-a", "1");
  }

  function handleLeave(event: PointerEvent<HTMLElement>) {
    rawX.set(0);
    rawY.set(0);
    pointer.current = { ...pointer.current, active: false };
    event.currentTarget.style.setProperty("--spot-a", "0");
  }

  return (
    <HeroMotionProvider value={{ px, py, progress: scrollYProgress, pointer, interactive, reduceMotion }}>
      <section
        ref={ref}
        id="top"
        aria-labelledby="hero-title"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="hero-stage relative isolate flex min-h-svh flex-col overflow-hidden"
      >
        <HeroBackdrop />

        <div className="container-page relative z-10 flex flex-1 flex-col justify-center pt-[calc(var(--nav-h)+2.5rem)] pb-28 md:pb-32 lg:pb-28 [@media(max-height:560px)]:pt-[calc(var(--nav-h)+1rem)]">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
            <m.div
              className="lg:col-span-7 xl:col-span-6"
              style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
            >
              <HeroCopy {...copy} />
            </m.div>

            <m.div
              className="w-full max-w-[35rem] justify-self-center lg:col-span-5 lg:justify-self-end xl:col-span-6"
              style={reduceMotion ? undefined : { y: sceneY, scale: sceneScale, opacity: sceneOpacity }}
            >
              <HeroScene />
            </m.div>
          </div>
        </div>

        <m.div className="absolute inset-x-0 bottom-0 z-10" style={reduceMotion ? undefined : { opacity: railOpacity }}>
          <HeroRail {...rail} />
        </m.div>
      </section>
    </HeroMotionProvider>
  );
}
