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
  /** Hide the name on small screens (e.g. while the header shows the section readout there). The name always yields between `md` and `lg`, where the links need the room. */
  compactName?: boolean;
  onNavigate?: () => void;
}

/** Monogram plus name; the slash turns on hover. */
export function Wordmark({ name, initials, homeLabel, className, compactName = false, onNavigate }: WordmarkProps) {
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
        <span className="inline-block text-accent transition-transform duration-700 ease-out-expo group-hover:rotate-[180deg]">/</span>
        {second}
      </span>
      <span
        className={cn(
          "truncate text-sm font-medium tracking-tight text-fg",
          compactName ? "hidden lg:inline" : "inline md:hidden lg:inline",
        )}
      >
        {name}
      </span>
    </Link>
  );
}
