"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

import { useFinePointer } from "@/hooks/use-media-query";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
}

const spring = { stiffness: 140, damping: 18, mass: 0.6 };

/**
 * Subtle perspective tilt following the pointer. Only active for fine
 * pointers and when the visitor hasn't asked for reduced motion.
 */
export function Tilt({ children, className, max = 4 }: TiltProps) {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = finePointer && !reduceMotion;

  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * max * 2);
    rotateX.set(-y * max * 2);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <m.div
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={enabled ? { rotateX, rotateY, transformPerspective: 1400 } : undefined}
    >
      {children}
    </m.div>
  );
}
