"use client";

import type { MouseEvent } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { interpolate } from "@/i18n/format";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/ThemeProvider";

interface ThemeToggleProps {
  copy: { switchTo: string; light: string; dark: string };
  className?: string;
}

/**
 * Sun / moon switch. The icon morphs between the two (rays unfold, a mask
 * slides off the disc) and the new theme sweeps across the page in a circle
 * that starts at the button, when the browser supports view transitions.
 */
export function ThemeToggle({ copy, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const next = theme === "light" ? "dark" : "light";

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const rect = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--vt-y", `${rect.top + rect.height / 2}px`);

    if (!reduceMotion && typeof document.startViewTransition === "function") {
      document.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={interpolate(copy.switchTo, { theme: next === "light" ? copy.light : copy.dark })}
      title={interpolate(copy.switchTo, { theme: next === "light" ? copy.light : copy.dark })}
      className={cn(
        "group relative inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-fg transition-[border-color,background-color,box-shadow] duration-300 hover:border-accent/60 hover:bg-accent-soft hover:shadow-glow",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[1.125rem] transition-transform duration-700 ease-out-expo group-hover:rotate-[20deg]" aria-hidden>
        <defs>
          <mask id="theme-toggle-mask">
            <rect width="24" height="24" fill="#fff" />
            {/* Bites a crescent out of the disc in dark mode; slides away in light mode. */}
            <circle className="theme-toggle__mask" cx="16" cy="8" r="6.5" fill="#000" />
          </mask>
        </defs>
        <circle className="theme-toggle__core" cx="12" cy="12" r="7" fill="currentColor" mask="url(#theme-toggle-mask)" />
        <g className="theme-toggle__ray" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.9" y1="4.9" x2="6.3" y2="6.3" />
          <line x1="17.7" y1="17.7" x2="19.1" y2="19.1" />
          <line x1="4.9" y1="19.1" x2="6.3" y2="17.7" />
          <line x1="17.7" y1="6.3" x2="19.1" y2="4.9" />
        </g>
      </svg>
    </button>
  );
}
