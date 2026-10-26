"use client";

import Link from "next/link";

import { localePath } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  name: string;
  initials: string;
  homeLabel: string;
  className?: string;
  onNavigate?: () => void;
}

/** Monogram plus name; the name collapses on narrow screens. */
export function Wordmark({ name, initials, homeLabel, className, onNavigate }: WordmarkProps) {
  const locale = useLocale();
  const [first = "", second = ""] = initials.split("");
  return (
    <Link
      href={localePath(locale)}
      onClick={onNavigate}
      aria-label={`${name} — ${homeLabel}`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        aria-hidden
        dir="ltr"
        className="relative inline-flex size-9 items-center justify-center rounded-sm border border-line-strong font-mono text-[0.8125rem] font-medium tracking-tight transition-colors duration-500 group-hover:border-accent/70"
      >
        {first}
        <span className="text-accent">/</span>
        {second}
      </span>
      <span className="hidden text-sm font-medium tracking-tight text-fg sm:inline">{name}</span>
    </Link>
  );
}
