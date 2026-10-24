import Link from "next/link";

import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

/** Monogram plus name; the name collapses on narrow screens. */
export function Wordmark({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const [first = "", second = ""] = profile.initials.split("");
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={`${profile.name} — home`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        aria-hidden
        className="relative inline-flex size-9 items-center justify-center rounded-sm border border-line-strong font-mono text-[0.8125rem] font-medium tracking-tight transition-colors duration-500 group-hover:border-accent/70"
      >
        {first}
        <span className="text-accent">/</span>
        {second}
      </span>
      <span className="hidden text-sm font-medium tracking-tight text-fg xs:inline">{profile.name}</span>
    </Link>
  );
}
