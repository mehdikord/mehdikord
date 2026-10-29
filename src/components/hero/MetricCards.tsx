"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/*
 * Illustrative dashboard tiles. The numbers are a gentle random walk inside a
 * plausible band, so the scene feels live; they are not real measurements.
 */

interface SeriesOptions {
  min: number;
  max: number;
  step: number;
  length: number;
  interval: number;
}

function seed({ min, max, length }: SeriesOptions): number[] {
  const mid = (min + max) / 2;
  const span = (max - min) / 2;
  return Array.from({ length }, (_, index) => Math.round(mid + Math.sin(index * 1.7) * span * 0.6));
}

function useLiveSeries(running: boolean, options: SeriesOptions): number[] {
  const [series, setSeries] = useState(() => seed(options));
  const { min, max, step, interval } = options;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeries((previous) => {
        const last = previous[previous.length - 1] ?? (min + max) / 2;
        const next = Math.min(max, Math.max(min, Math.round(last + (Math.random() - 0.5) * step)));
        return [...previous.slice(1), next];
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [running, min, max, step, interval]);

  return series;
}

const latencyOptions: SeriesOptions = { min: 29, max: 52, step: 12, length: 18, interval: 1300 };
const throughputOptions: SeriesOptions = { min: 108, max: 142, step: 16, length: 12, interval: 1700 };

function sparkline(series: number[], width: number, height: number, { min, max }: SeriesOptions): string {
  const stepX = width / (series.length - 1);
  return series
    .map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / (max - min)) * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("");
}

function Label({ children }: { children: string }) {
  return <p className="font-mono text-[0.625rem] tracking-[0.14em] text-fg-subtle uppercase">{children}</p>;
}

export function LatencyCard({ running }: { running: boolean }) {
  const series = useLiveSeries(running, latencyOptions);
  const latest = series[series.length - 1] ?? 0;
  const width = 136;
  const height = 34;
  const line = sparkline(series, width, height, latencyOptions);
  const lastY = Number(line.slice(line.lastIndexOf(" ") + 1));

  return (
    <div className="glass-card px-4 pt-3.5 pb-3">
      <div className="flex items-baseline justify-between gap-3">
        <Label>p95 latency</Label>
        <span className="font-mono text-[0.625rem] text-signal">−12%</span>
      </div>
      <p className="mt-1 font-mono text-[1.5rem] leading-none font-medium tracking-tight tabular-nums">
        {latest}
        <span className="ms-1 text-[0.75rem] text-fg-subtle">ms</span>
      </p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2.5 h-auto w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="hero-spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--color-accent)" }} stopOpacity={0.35} />
            <stop offset="100%" style={{ stopColor: "var(--color-accent)" }} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`${line}L${width} ${height}L0 ${height}Z`} fill="url(#hero-spark-fill)" />
        <path d={line} fill="none" style={{ stroke: "var(--color-accent)" }} strokeWidth={1.25} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={width} cy={lastY} r={2.4} style={{ fill: "var(--t-spark)" }} />
        <circle cx={width} cy={lastY} r={5} style={{ fill: "var(--color-accent)" }} fillOpacity={0.3} className="hero-led" />
      </svg>
    </div>
  );
}

export function ThroughputCard({ running }: { running: boolean }) {
  const series = useLiveSeries(running, throughputOptions);
  const latest = series[series.length - 1] ?? 0;
  const { min, max } = throughputOptions;

  return (
    <div className="glass-card px-4 pt-3.5 pb-3.5">
      <Label>throughput</Label>
      <p className="mt-1 font-mono text-[1.5rem] leading-none font-medium tracking-tight tabular-nums">
        {(latest / 10).toFixed(1)}k
        <span className="ms-1 text-[0.75rem] text-fg-subtle">req/s</span>
      </p>
      <div className="mt-3 flex h-7 items-end gap-1" aria-hidden>
        {series.map((value, index) => (
          <span
            key={index}
            className={cn(
              "flex-1 rounded-[1px] transition-[height] duration-700 ease-out-quart",
              index === series.length - 1 ? "bg-accent" : "bg-accent/35",
            )}
            style={{ height: `${20 + ((value - min) / (max - min)) * 80}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function UptimePill() {
  return (
    <p className="glass-card inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 font-mono text-[0.6875rem] tracking-[0.08em] text-fg-muted uppercase">
      <span aria-hidden className="relative inline-block size-1.5 rounded-full bg-signal text-signal status-dot" />
      <span className="text-fg tabular-nums">99.99%</span> uptime · 30d
    </p>
  );
}
