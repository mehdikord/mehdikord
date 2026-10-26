"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import { fade, fadeUp, pop, stagger, viewportOnce } from "@/components/motion/motion-variants";

const elements = { div: m.div, li: m.li, ul: m.ul, ol: m.ol, p: m.p, header: m.header, article: m.article };

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds. */
  delay?: number;
  as?: keyof typeof elements;
  /** Fade only, without vertical movement. */
  still?: boolean;
}

/** Scroll-triggered entrance for a single block. */
export function Reveal({ children, className, delay = 0, as = "div", still = false }: RevealProps) {
  const Element = elements[as] as typeof m.div;
  return (
    <Element
      className={className}
      data-reveal=""
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={still ? fade : fadeUp}
      custom={delay}
    >
      {children}
    </Element>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  as?: keyof typeof elements;
  interval?: number;
  delay?: number;
}

/** Staggers its `RevealItem` children as the group enters the viewport. */
export function RevealGroup({ children, className, as = "div", interval = 0.07, delay = 0 }: RevealGroupProps) {
  const Element = elements[as] as typeof m.div;
  return (
    <Element
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger(interval, delay)}
    >
      {children}
    </Element>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  as?: keyof typeof elements;
  /** "rise" fades upward; "pop" is a smaller, springy entrance for compact items. */
  variant?: "rise" | "pop";
}) {
  const Element = elements[as] as typeof m.div;
  return (
    <Element className={className} data-reveal="" variants={variant === "pop" ? pop : fadeUp}>
      {children}
    </Element>
  );
}
