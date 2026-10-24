"use client";

import { useEffect, useRef } from "react";

/** Seconds of overlap between the end of one pass and the start of the next. */
const FADE_SECONDS = 1.2;

const other = (index: 0 | 1): 0 | 1 => (index === 0 ? 1 : 0);

interface CrossfadeLoopOptions {
  src: string;
  enabled: boolean;
  onPlaying: () => void;
  onFailure: () => void;
}

/**
 * Seamless looping for a clip whose last frame doesn't match its first: two
 * stacked <video> elements take turns, and the incoming one fades in over the
 * outgoing one during the final second. Playback pauses while the tab is
 * hidden or the hero is off-screen, and every listener, timer and decoder is
 * released on cleanup.
 *
 * Attach `containerRef` to the element observed for visibility and the two
 * video refs to stacked <video> elements without a `src` attribute.
 */
export function useCrossfadeLoop({ src, enabled, onPlaying, onFailure }: CrossfadeLoopOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLVideoElement>(null);
  const secondRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const first = firstRef.current;
    const second = secondRef.current;
    const host = containerRef.current;
    if (!enabled || !first || !second || !host) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const players = [first, second] as const;
    let active: 0 | 1 = 0;
    let fading = false;
    let disposed = false;
    let inView = true;
    let frame = 0;
    let swapTimer: number | undefined;

    for (const video of players) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      if (!video.getAttribute("src")) video.src = src;
      video.style.transition = "none";
      video.style.opacity = "0";
      video.style.zIndex = "0";
    }
    first.style.opacity = "1";
    first.style.zIndex = "1";
    first.preload = "auto";

    const canRun = () => !disposed && inView && document.visibilityState === "visible";

    const play = (video: HTMLVideoElement) =>
      video.play().catch((error: unknown) => {
        // AbortError means a pause() interrupted play() — expected, not a failure.
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (!disposed) onFailure();
      });

    const tick = () => {
      frame = 0;
      const current = players[active];
      const next = players[other(active)];
      const { duration, currentTime } = current;

      if (!fading && Number.isFinite(duration) && duration > FADE_SECONDS * 2 && currentTime >= duration - FADE_SECONDS) {
        fading = true;
        next.currentTime = 0;
        next.style.zIndex = "2";
        current.style.zIndex = "1";
        void play(next).then(() => {
          if (disposed) return;
          next.style.transition = `opacity ${FADE_SECONDS}s linear`;
          next.style.opacity = "1";
          swapTimer = window.setTimeout(() => {
            current.pause();
            current.style.transition = "none";
            current.style.opacity = "0";
            current.style.zIndex = "0";
            next.style.zIndex = "1";
            active = other(active);
            fading = false;
          }, FADE_SECONDS * 1000);
        });
      }
      schedule();
    };

    const schedule = () => {
      if (!frame && canRun()) frame = requestAnimationFrame(tick);
    };

    const resume = () => {
      if (!canRun()) return;
      void play(players[active]);
      if (fading) void play(players[other(active)]);
      schedule();
    };

    const suspend = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      players.forEach((video) => video.pause());
    };

    const handleVisibility = () => (document.visibilityState === "visible" ? resume() : suspend());
    const handlePlaying = () => onPlaying();
    const handleError = () => onFailure();
    // Start buffering the second player only once the first plays smoothly.
    const handleCanPlayThrough = () => {
      second.preload = "auto";
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) resume();
      else suspend();
    });
    observer.observe(host);

    document.addEventListener("visibilitychange", handleVisibility);
    first.addEventListener("playing", handlePlaying, { once: true });
    first.addEventListener("canplaythrough", handleCanPlayThrough, { once: true });
    players.forEach((video) => video.addEventListener("error", handleError));

    resume();

    return () => {
      disposed = true;
      suspend();
      window.clearTimeout(swapTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      first.removeEventListener("playing", handlePlaying);
      first.removeEventListener("canplaythrough", handleCanPlayThrough);
      players.forEach((video) => {
        video.removeEventListener("error", handleError);
        // Release the network connection and decoder.
        video.removeAttribute("src");
        video.load();
      });
    };
  }, [src, enabled, onPlaying, onFailure]);

  return { containerRef, firstRef, secondRef };
}
