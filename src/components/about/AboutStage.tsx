"use client";

import { useMotionValue, useScroll, useSpring, type MotionValue } from "motion/react";
import { createContext, useContext, useEffect, useRef, type PointerEvent, type ReactNode, type RefObject } from "react";

import { useFinePointer, useMediaQuery, usePinned } from "@/hooks/use-media-query";

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>["offset"]>;

interface AboutStageValue {
  /** 0 when the pinned track reaches the top of the viewport, 1 when it releases. */
  pin: MotionValue<number>;
  /** The track is pinned (large screens, enough height, motion allowed). */
  pinned: boolean;
  /** Pointer across the stage, −0.5…0.5 on each axis, spring-smoothed. */
  px: MotionValue<number>;
  py: MotionValue<number>;
  interactive: boolean;
  reduceMotion: boolean;
}

const AboutStageContext = createContext<AboutStageValue | null>(null);

export function useAboutStage(): AboutStageValue {
  const value = useContext(AboutStageContext);
  if (!value) throw new Error("useAboutStage must be used inside <AboutStage>.");
  return value;
}

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/**
 * A 0…1 progress for one piece of the scene. While pinned it is a slice
 * (`from`…`to`) of the pinned track; otherwise it follows the element's own
 * passage through the viewport (`offset`). With reduced motion it is 1.
 */
export function useStageProgress(
  target: RefObject<HTMLElement | null>,
  from: number,
  to: number,
  offset: ScrollOffset,
): MotionValue<number> {
  const { pin, pinned, reduceMotion } = useAboutStage();
  const { scrollYProgress: local } = useScroll({ target, offset });
  const progress = useMotionValue(0);

  useEffect(() => {
    if (reduceMotion) {
      progress.set(1);
      return;
    }
    const source = pinned ? pin : local;
    const map = pinned ? (value: number) => clamp01((value - from) / (to - from)) : clamp01;
    progress.set(map(source.get()));
    return source.on("change", (value) => progress.set(map(value)));
  }, [pin, local, pinned, reduceMotion, from, to, progress]);

  return progress;
}

const pointerSpring = { stiffness: 60, damping: 20, mass: 1 };

/**
 * Client root of the About intro: a tall track whose stage pins to the
 * viewport while the system stack comes apart, the lead lights up and the
 * figures roll. Shares scroll and pointer state with the pieces inside.
 */
export function AboutStage({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinned = usePinned();
  const finePointer = useFinePointer();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const interactive = finePointer && !reduceMotion;

  const { scrollYProgress: pin } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, pointerSpring);
  const py = useSpring(rawY, pointerSpring);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - rect.left) / rect.width - 0.5);
    rawY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <AboutStageContext.Provider value={{ pin, pinned, px, py, interactive, reduceMotion }}>
      <div ref={trackRef} className="relative pin:h-[270svh]">
        <div
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          className="relative pin:sticky pin:top-0 pin:flex pin:h-svh pin:flex-col pin:justify-center"
        >
          {children}
        </div>
      </div>
    </AboutStageContext.Provider>
  );
}
