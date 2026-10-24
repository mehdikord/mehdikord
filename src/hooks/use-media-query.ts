"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Always `false` during server rendering. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True for devices with a precise pointer that can hover (mouse, trackpad). */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
