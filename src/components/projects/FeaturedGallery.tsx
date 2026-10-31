"use client";

import { ArrowUpRight } from "lucide-react";
import { m, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { ease, viewportOnce } from "@/components/motion/motion-variants";
import { cn } from "@/lib/utils";

export interface FeaturedItem {
  slug: string;
  href: string;
  title: string;
  /** Pre-formatted, e.g. "P/01" or "پروژه ۰۱". */
  indexLabel: string;
  /** Short number for the collapsed panel, e.g. "01". */
  number: string;
  category: string;
  period: string;
  description: string;
  role: string;
  technologies: readonly string[];
  ctaLabel: string;
  /** Server-rendered visual (uploaded screenshot or the default image). */
  visual: ReactNode;
  /** Server-rendered "default image" badge, when applicable. */
  notice: ReactNode;
}

interface FeaturedGalleryProps {
  items: readonly FeaturedItem[];
  labels: { role: string; stack: string; hint: string };
}

const curtain: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0.4 },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: { duration: 1.2, ease: ease.outExpo },
  },
};

const railVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } };

/**
 * Homepage showcase. Desktop: an expanding-panel rail — the active project
 * opens wide while the others collapse to slim, numbered spines. Small
 * screens: a native swipeable row of cards.
 */
export function FeaturedGallery({ items, labels }: FeaturedGalleryProps) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion ? {} : { initial: "hidden", whileInView: "visible", viewport: viewportOnce };

  return (
    <>
      {/* Desktop rail */}
      <m.div
        className="featured-rail hidden h-[clamp(32rem,70vh,44rem)] gap-3 lg:flex"
        variants={railVariants}
        {...entrance}
      >
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <m.article
              key={item.slug}
              variants={curtain}
              aria-current={isActive ? "true" : undefined}
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
              onFocusCapture={() => setActive(index)}
              onClick={() => setActive(index)}
              className={cn(
                "group/panel relative min-w-0 basis-0 overflow-hidden rounded-lg border bg-ink-900 transition-[flex-grow,border-color] duration-[900ms] ease-out-expo",
                isActive ? "grow-[5] border-line-strong" : "grow cursor-pointer border-line hover:border-line-strong",
              )}
            >
              {/* Fixed-width visual, centred and clipped by the panel, so it never reflows while resizing. */}
              <div
                className={cn(
                  "absolute inset-y-0 left-1/2 w-(--panel-w) -translate-x-1/2 transition-[scale,opacity,filter] duration-[1100ms] ease-out-expo",
                  isActive ? "scale-100 opacity-100" : "scale-[1.08] opacity-35 grayscale-[0.7]",
                )}
              >
                {item.visual}
              </div>

              {/* Legibility gradient */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-transparent transition-opacity duration-700",
                  isActive ? "opacity-100" : "opacity-80",
                )}
              />

              {/* Collapsed spine */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 flex flex-col justify-between p-6 transition-opacity",
                  isActive ? "opacity-0 duration-200" : "opacity-100 delay-300 duration-500",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-sm text-accent">{item.number}</span>
                  <span className="label-mono truncate text-fg-subtle">{item.category}</span>
                </div>
                <span className="self-start text-2xl font-semibold tracking-[-0.03em] whitespace-nowrap text-fg/90 [writing-mode:vertical-rl] rotate-180">
                  {item.title}
                </span>
              </div>

              {/* Expanded details — always in the DOM so links stay keyboard-reachable. */}
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 p-8 transition-[opacity,translate] xl:p-10",
                  isActive
                    ? "translate-y-0 opacity-100 delay-300 duration-700 ease-out-expo"
                    : "pointer-events-none translate-y-6 opacity-0 duration-200",
                )}
              >
                <div className="grid w-(--panel-content-w) items-end gap-8 xl:grid-cols-[1.4fr_1fr]">
                  <div>
                    <p className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-subtle">
                      <span className="text-accent">{item.indexLabel}</span>
                      <span>{item.category}</span>
                      <span aria-hidden>·</span>
                      <span>{item.period}</span>
                    </p>
                    <h3 className="mt-4 text-[clamp(2rem,1.1rem+2vw,3.25rem)] leading-[1] font-semibold tracking-[-0.045em]">
                      {/* Stays tabbable while collapsed: focusing it expands the panel. */}
                      <Link
                        href={item.href}
                        className={cn(isActive && "after:absolute after:inset-0 after:z-0 after:content-['']")}
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-4 max-w-md text-pretty text-fg-muted">{item.description}</p>
                  </div>
                  <div className="relative z-10 flex items-end justify-between gap-6">
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="label-mono text-fg-subtle">{labels.role}</dt>
                        <dd className="mt-1">{item.role}</dd>
                      </div>
                      <div>
                        <dt className="label-mono text-fg-subtle">{labels.stack}</dt>
                        <dd dir="ltr" className="mt-1 font-mono text-[0.75rem] leading-relaxed text-fg-muted rtl:text-right">
                          {item.technologies.slice(0, 4).join(" · ")}
                        </dd>
                      </div>
                    </dl>
                    <Link
                      href={item.href}
                      tabIndex={isActive ? 0 : -1}
                      aria-label={`${item.ctaLabel}: ${item.title}`}
                      className="group/cta inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-fg text-ink-950 transition-[background-color,scale] duration-500 ease-out-expo hover:scale-105 hover:bg-accent"
                    >
                      <ArrowUpRight
                        aria-hidden
                        className="size-6 transition-transform duration-500 ease-out-expo group-hover/cta:rotate-45 rtl:-scale-x-100 rtl:group-hover/cta:-rotate-45"
                        strokeWidth={1.5}
                      />
                    </Link>
                  </div>
                </div>
              </div>

              <div className={cn("transition-opacity duration-500", isActive ? "opacity-100" : "opacity-0")}>
                {item.notice}
              </div>
            </m.article>
          );
        })}
      </m.div>
      <p className="sr-only">{labels.hint}</p>

      {/* Small screens: swipeable cards */}
      <m.ul
        className="no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-2 lg:hidden"
        variants={railVariants}
        {...entrance}
      >
        {items.map((item) => (
          <m.li key={item.slug} variants={curtain} className="w-[84%] shrink-0 snap-start sm:w-[62%] md:w-[46%]">
            <article className="group relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-ink-900">
                <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.03]">
                  {item.visual}
                </div>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="label-mono flex flex-wrap gap-x-2 text-fg-subtle">
                    <span className="text-accent">{item.indexLabel}</span>
                    <span>{item.category}</span>
                  </p>
                  <h3 className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-[-0.035em]">
                    <Link href={item.href} className="after:absolute after:inset-0 after:content-['']">
                      {item.title}
                    </Link>
                  </h3>
                </div>
                {item.notice}
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-pretty text-fg-muted">{item.description}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                {item.ctaLabel}
                <ArrowUpRight aria-hidden className="size-4 text-accent rtl:-scale-x-100" strokeWidth={1.75} />
              </p>
            </article>
          </m.li>
        ))}
      </m.ul>
    </>
  );
}
