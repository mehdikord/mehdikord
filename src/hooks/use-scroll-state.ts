"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

/**
 * Tracks which of the given section ids sits in the reading band of the
 * viewport. Pass an empty list to disable (e.g. on other routes).
 */
export function useActiveSection<T extends string>(ids: readonly T[]): T | null {
  const [active, setActive] = useState<T | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    if (!key) return;
    const sectionIds = key.split("|") as T[];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as T);
        }
      },
      { rootMargin: "-42% 0px -56% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return key ? active : null;
}

export type ScrollDirection = "up" | "down";

/**
 * The direction the page is travelling, switching only after `threshold`
 * pixels of travel the other way so small jitters don't flip it. `reset()`
 * forces "up" (e.g. when the visitor asks for the full header back).
 */
export function useScrollDirection(threshold = 14): [ScrollDirection, () => void] {
  const [direction, setDirection] = useState<ScrollDirection>("up");
  const state = useRef({ direction: "up" as ScrollDirection, anchor: 0 });

  useEffect(() => {
    const current = state.current;
    current.anchor = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (current.direction === "down") {
        if (y > current.anchor) current.anchor = y;
        else if (y < current.anchor - threshold) {
          current.direction = "up";
          current.anchor = y;
          setDirection("up");
        }
      } else if (y < current.anchor) current.anchor = y;
      else if (y > current.anchor + threshold) {
        current.direction = "down";
        current.anchor = y;
        setDirection("down");
      }
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  const reset = useCallback(() => {
    state.current.direction = "up";
    state.current.anchor = window.scrollY;
    setDirection("up");
  }, []);

  return [direction, reset];
}

/**
 * Writes how far the reader is through section `id` (0…1, measured at the
 * middle of the viewport) to `--section-p` on `target`, without re-rendering.
 */
export function useSectionProgress(id: string | null, target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = target.current;
    if (!node) return;
    const section = id ? document.getElementById(id) : null;
    if (!section) {
      node.style.setProperty("--section-p", "0");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const progress = (window.innerHeight * 0.5 - rect.top) / Math.max(1, rect.height);
      node.style.setProperty("--section-p", Math.min(1, Math.max(0, progress)).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [id, target]);
}
