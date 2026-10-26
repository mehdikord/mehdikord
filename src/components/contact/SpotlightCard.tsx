"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Card with a soft light that follows a mouse pointer. The position is written
 * to CSS variables directly, so moving the pointer never re-renders React.
 */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onPointerMove={handleMove} className={cn("spotlight-card", className)}>
      {children}
    </div>
  );
}
