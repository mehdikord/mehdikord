"use client";

import { m } from "motion/react";

import { maskLine, viewportOnce } from "@/components/motion/motion-variants";
import { cn } from "@/lib/utils";
import type { HeadlineSegment } from "@/types/portfolio";

const tags = { h1: m.h1, h2: m.h2, h3: m.h3 };

interface MaskedHeadingProps {
  lines: readonly HeadlineSegment[];
  as?: keyof typeof tags;
  id?: string;
  className?: string;
  /** Seconds between lines. */
  interval?: number;
  delay?: number;
}

/** Section headline whose lines rise through clipping masks on first view. */
export function MaskedHeading({ lines, as = "h2", id, className, interval = 0.09, delay = 0 }: MaskedHeadingProps) {
  const Tag = tags[as] as typeof m.h2;
  return (
    <Tag id={id} className={className} initial="hidden" whileInView="visible" viewport={viewportOnce}>
      {lines.map((line, index) => (
        // Padding keeps descenders and italic overhangs inside the mask.
        <span key={line.text} className="mask-line">
          <m.span
            className={cn("block", line.emphasis && "text-accent-serif")}
            data-reveal=""
            variants={maskLine}
            custom={delay + index * interval}
          >
            {line.text}
            {index < lines.length - 1 ? " " : null}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
