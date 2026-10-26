import type { Transition, Variants } from "motion/react";

type Bezier = [number, number, number, number];

/** Mirrors the easing tokens in globals.css. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as Bezier,
  outQuart: [0.25, 1, 0.5, 1] as Bezier,
  inOutQuart: [0.76, 0, 0.24, 1] as Bezier,
};

export const duration = {
  fast: 0.16,
  base: 0.32,
  slow: 0.7,
  reveal: 0.9,
  mask: 1.1,
};

/** Reveal once, slightly before the element is fully in view. */
export const viewportOnce = { once: true, margin: "0px 0px -10% 0px" } as const;

export const revealTransition = (delay = 0): Transition => ({
  duration: duration.reveal,
  ease: ease.outExpo,
  delay,
});

/** Fade and settle upward. `custom` sets the delay in seconds. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({ opacity: 1, y: 0, transition: revealTransition(delay) }),
};

/** Small, springy rise for compact items such as tags. */
export const pop: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22, mass: 0.7 } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({ opacity: 1, transition: { duration: duration.slow, ease: ease.outQuart, delay } }),
};

/** A line rising through a clipping mask. `custom` sets the delay. */
export const maskLine: Variants = {
  hidden: { y: "105%" },
  visible: (delay: number = 0) => ({ y: "0%", transition: { duration: duration.mask, ease: ease.outExpo, delay } }),
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});
