import { MaskedHeading } from "@/components/motion/MaskedHeading";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import type { HeadlineSegment } from "@/types/portfolio";

interface SectionHeaderProps {
  index: string;
  label: string;
  title: readonly HeadlineSegment[];
  titleId: string;
  intro?: string;
  className?: string;
}

/** Numbered section label, masked headline and optional introduction. */
export function SectionHeader({ index, label, title, titleId, intro, className }: SectionHeaderProps) {
  return (
    <header className={cn("grid gap-y-8 md:grid-cols-12 md:gap-x-8", className)}>
      <Reveal still className="label-mono flex items-center gap-4 text-fg-subtle md:col-span-12">
        <span className="text-accent">{index}</span>
        <span>{label}</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </Reveal>
      <MaskedHeading id={titleId} lines={title} className="text-headline text-balance md:col-span-8 lg:col-span-7" />
      {intro ? (
        <Reveal
          delay={0.15}
          className="text-pretty text-fg-muted md:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end"
        >
          <p>{intro}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
