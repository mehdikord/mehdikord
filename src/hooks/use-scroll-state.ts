"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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
