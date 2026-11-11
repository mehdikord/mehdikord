"use client";

import { useEffect, useRef } from "react";

import { useStageProgress } from "@/components/about/AboutStage";
import { cn } from "@/lib/utils";

/** Share of the progress over which a single word resolves. */
const WORD_SPAN = 0.16;

/*
 * The lead paragraph, written in as the visitor scrolls: each word resolves
 * from a faint trace, flares in the accent colour for a moment and settles
 * into the text colour, so a bright edge travels through the sentence.
 * Word state goes to CSS variables (`--w`, `--h`) from one subscription.
 */
export function ScrollLead({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const progress = useStageProgress(ref, 0, 0.4, ["start 0.85", "end 0.45"]);
  const words = text.split(/\s+/).filter(Boolean);
  const count = words.length;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const spans = Array.from(node.querySelectorAll<HTMLElement>("[data-word]"));
    const apply = (value: number) => {
      spans.forEach((span, index) => {
        const start = (index / Math.max(1, count)) * (1 - WORD_SPAN);
        const w = Math.min(1, Math.max(0, (value - start) / WORD_SPAN));
        span.style.setProperty("--w", w.toFixed(3));
        span.style.setProperty("--h", Math.sin(w * Math.PI).toFixed(3));
      });
    };
    apply(progress.get());
    return progress.on("change", apply);
  }, [progress, count]);

  return (
    <p ref={ref} className={cn("scroll-lead", className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} data-word="" className="lead-word">
          {word}
          {index < count - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}
