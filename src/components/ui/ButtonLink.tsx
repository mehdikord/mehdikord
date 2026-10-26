import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Icon = "right" | "up-right" | "down" | "none";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: Icon;
  className?: string;
  /** Opens in a new tab with safe `rel` attributes. */
  external?: boolean;
  ariaLabel?: string;
  /** Ghost links on light surfaces use dark ink. */
  onLight?: boolean;
}

const icons = { right: ArrowRight, "up-right": ArrowUpRight, down: ArrowDown };

const variants: Record<Variant, string> = {
  primary:
    "h-12 gap-3 rounded-full bg-fg ps-6 pe-1.5 text-[0.9375rem] font-medium text-ink-950 hover:shadow-glow",
  secondary:
    "h-12 gap-2.5 rounded-full border border-line-strong bg-white/[0.03] px-6 text-[0.9375rem] font-medium text-fg backdrop-blur-sm hover:border-accent/60 hover:bg-accent-soft",
  ghost:
    "gap-2 text-sm font-medium after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left rtl:after:origin-right after:scale-x-[0.3] after:bg-current after:opacity-60 after:transition-transform after:duration-500 after:ease-out-expo hover:after:scale-x-100",
};

/**
 * Call-to-action link. Chooses `next/link` for internal routes, a plain anchor
 * for in-page hashes and a safe external anchor otherwise.
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon = "right",
  className,
  external = false,
  ariaLabel,
  onLight = false,
}: ButtonLinkProps) {
  const Icon = icon === "none" ? null : icons[icon];
  const classes = cn(
    "group relative inline-flex shrink-0 items-center whitespace-nowrap transition-[box-shadow,background-color,border-color,color] duration-(--duration-base) ease-out-quart",
    variants[variant],
    variant === "ghost" && (onLight ? "text-paper-ink" : "text-fg"),
    className,
  );

  const iconNode = Icon ? (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-center justify-center transition-transform duration-500 ease-out-expo",
        variant === "primary" && "size-9 rounded-full bg-ink-950 text-fg",
        // Directional arrows mirror in right-to-left layouts.
        icon !== "down" && "rtl:-scale-x-100",
        icon === "right" && "group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5",
        icon === "up-right" && "group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5",
        icon === "down" && "group-hover:translate-y-0.5",
      )}
    >
      <Icon className="size-4" strokeWidth={1.75} />
    </span>
  ) : null;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label={ariaLabel}>
        {children}
        {iconNode}
      </a>
    );
  }

  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
        {iconNode}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
      {iconNode}
    </Link>
  );
}
