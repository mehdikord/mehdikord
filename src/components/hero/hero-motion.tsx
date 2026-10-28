"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import { createContext, useContext, type CSSProperties, type ReactNode, type RefObject } from "react";

export interface PointerState {
  /** Pointer position in hero pixel coordinates. */
  x: number;
  y: number;
  /** False once the pointer has left the hero. */
  active: boolean;
}

export interface HeroMotion {
  /** Pointer across the hero, −0.5…0.5 on each axis, spring-smoothed. */
  px: MotionValue<number>;
  py: MotionValue<number>;
  /** 0 with the page at the top, 1 once the hero has scrolled out of view. */
  progress: MotionValue<number>;
  /** Raw pointer, read every frame by the canvas field without re-rendering. */
  pointer: RefObject<PointerState>;
  /** Pointer-driven effects are on: fine pointer and no reduced-motion request. */
  interactive: boolean;
  reduceMotion: boolean;
}

const HeroMotionContext = createContext<HeroMotion | null>(null);

export const HeroMotionProvider = HeroMotionContext.Provider;

export function useHeroMotion(): HeroMotion {
  const value = useContext(HeroMotionContext);
  if (!value) throw new Error("useHeroMotion must be used inside <HeroStage>.");
  return value;
}

/** Pixels of travel per unit of depth at the edge of the hero. */
const TRAVEL = 16;

interface HeroLayerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /**
   * Parallax depth: positive layers drift with the pointer, negative ones
   * against it. Larger magnitudes feel closer to the viewer.
   */
  depth: number;
}

/** A layer that drifts with the pointer in proportion to its depth. */
export function HeroLayer({ children, className, style, depth }: HeroLayerProps) {
  const { px, py, interactive } = useHeroMotion();
  const x = useTransform(px, (value) => value * depth * TRAVEL);
  const y = useTransform(py, (value) => value * depth * TRAVEL);

  return (
    <m.div className={className} style={interactive ? { ...style, x, y } : style}>
      {children}
    </m.div>
  );
}
