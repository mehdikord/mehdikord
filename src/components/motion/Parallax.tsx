"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Travel as a percentage of the element height, in each direction. */
  distance?: number;
}

/**
 * Moves its content slightly slower than the page. The inner layer is
 * oversized so no edge is ever revealed. Static for reduced motion. The
 * caller positions the root (e.g. `relative` with a height, or `absolute`).
 */
export function Parallax({ children, className, distance = 5 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}%`, `${distance}%`]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <m.div
        className="absolute inset-x-0"
        style={{
          top: `-${distance}%`,
          bottom: `-${distance}%`,
          y: reduceMotion ? 0 : y,
        }}
      >
        {children}
      </m.div>
    </div>
  );
}
