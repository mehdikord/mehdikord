"use client";

import { useEffect, useRef } from "react";

import { useHeroMotion } from "@/components/hero/hero-motion";
import { THEME_EVENT } from "@/theme/theme";

/*
 * A field of drifting data points covering the hero. Points near the pointer
 * light up and link to it and to each other, like nodes joining a network;
 * a slow sweep passes over the field the way a monitoring scan would. Without
 * a fine pointer, a roaming focus keeps the field alive. With reduced motion,
 * a single still frame is drawn. Rendering pauses off-screen and in hidden tabs.
 */

const SPACING = 46;
const JITTER = 9;
const RADIUS = 210;
const MAX_DPR = 1.5;
const TAU = Math.PI * 2;

interface Point {
  ox: number;
  oy: number;
  phase: number;
  speed: number;
  x: number;
  y: number;
  near: number;
}

export function HeroField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pointer, interactive, reduceMotion } = useHeroMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    // "r g b" triplets from the theme, read on build and whenever the theme changes.
    let dot = "190, 170, 255";
    let link = "155, 123, 255";

    const readColors = () => {
      const styles = getComputedStyle(canvas);
      dot = styles.getPropertyValue("--t-dot").trim().split(/\s+/).join(", ") || dot;
      link = styles.getPropertyValue("--t-link").trim().split(/\s+/).join(", ") || link;
    };
    let points: Point[] = [];
    let frame = 0;
    let inView = true;
    const started = performance.now();

    const build = () => {
      readColors();
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;
      points = [];
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const ox = (col - 0.5) * SPACING + (Math.random() - 0.5) * JITTER * 2;
          const oy = (row - 0.5) * SPACING + (Math.random() - 0.5) * JITTER * 2;
          points.push({ ox, oy, phase: Math.random() * TAU, speed: 0.35 + Math.random() * 0.5, x: ox, y: oy, near: 0 });
        }
      }
    };

    const draw = (now: number) => {
      const t = (now - started) / 1000;
      context.clearRect(0, 0, width, height);

      // Focus: the real pointer, or a slow roaming point when there is none.
      const live = interactive && pointer.current.active;
      const fx = live ? pointer.current.x : width * 0.5 + Math.sin(t * 0.21) * width * 0.34;
      const fy = live ? pointer.current.y : height * 0.42 + Math.cos(t * 0.29) * height * 0.22;
      const focus = reduceMotion ? 0 : 1;
      const sweep = ((t * 64) % (height + 320)) - 160;

      for (const point of points) {
        const x = reduceMotion ? point.ox : point.ox + Math.sin(t * point.speed + point.phase) * 5;
        const y = reduceMotion ? point.oy : point.oy + Math.cos(t * point.speed * 0.8 + point.phase) * 5;
        const distance = Math.hypot(x - fx, y - fy);
        const near = Math.max(0, 1 - distance / RADIUS) * focus;
        const scan = reduceMotion ? 0 : Math.exp(-(((y - sweep) / 64) ** 2));
        const alpha = 0.09 + near * 0.7 + scan * 0.2;

        point.x = x;
        point.y = y;
        point.near = near;

        context.fillStyle = `rgba(${dot},${alpha.toFixed(3)})`;
        context.beginPath();
        context.arc(x, y, 1 + near * 1.3, 0, TAU);
        context.fill();
      }

      if (focus === 0) return;

      context.lineWidth = 1;
      for (let index = 0; index < points.length; index += 1) {
        const point = points[index];
        if (!point || point.near <= 0.02) continue;

        // Link to the focus.
        context.strokeStyle = `rgba(${link},${(point.near * point.near * 0.55).toFixed(3)})`;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(fx, fy);
        context.stroke();

        // Link to the right-hand and lower neighbours when they are lit too.
        const right = (index + 1) % cols === 0 ? undefined : points[index + 1];
        const below = points[index + cols];
        for (const neighbour of [right, below]) {
          if (!neighbour || neighbour.near <= 0.02) continue;
          const strength = Math.min(point.near, neighbour.near) * 0.4;
          context.strokeStyle = `rgba(${dot},${strength.toFixed(3)})`;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(neighbour.x, neighbour.y);
          context.stroke();
        }
      }
    };

    const canRun = () => inView && document.visibilityState === "visible";

    const tick = (now: number) => {
      frame = 0;
      draw(now);
      if (!reduceMotion && canRun()) frame = requestAnimationFrame(tick);
    };

    const resume = () => {
      if (frame || !canRun()) return;
      frame = requestAnimationFrame(tick);
    };

    const suspend = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) resume();
      else suspend();
    });
    observer.observe(host);

    const resizer = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    resizer.observe(host);

    const handleVisibility = () => (document.visibilityState === "visible" ? resume() : suspend());
    document.addEventListener("visibilitychange", handleVisibility);
    const handleTheme = () => {
      readColors();
      draw(performance.now());
    };
    window.addEventListener(THEME_EVENT, handleTheme);

    build();
    resume();

    return () => {
      suspend();
      observer.disconnect();
      resizer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener(THEME_EVENT, handleTheme);
    };
  }, [pointer, interactive, reduceMotion]);

  return (
    <div aria-hidden className={className}>
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
