import type { HeadlineLine } from "@/types/portfolio";

/**
 * Admin notation for the hero headline: one line per visual line, segments
 * separated by "|" (each segment wraps as a unit) and an emphasised segment
 * wrapped in asterisks, e.g. "Building | *what scales.*".
 */
export function parseHeadline(value: string): { text: string; emphasis?: boolean }[][] {
  return value
    .split(/\r?\n/)
    .map((line) =>
      line
        .split("|")
        .map((segment) => segment.trim())
        .filter(Boolean)
        .map((segment) => {
          const emphasis = /^\*.+\*$/.test(segment);
          return emphasis ? { text: segment.slice(1, -1).trim(), emphasis: true } : { text: segment };
        }),
    )
    .filter((line) => line.length > 0);
}

export function formatHeadline(lines: readonly HeadlineLine[]): string {
  return lines
    .map((line) => line.map((segment) => (segment.emphasis ? `*${segment.text}*` : segment.text)).join(" | "))
    .join("\n");
}
