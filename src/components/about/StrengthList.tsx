import {
  Boxes,
  Cable,
  CodeXml,
  Compass,
  Database,
  Gauge,
  KeyRound,
  Layers,
  Network,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
  Webhook,
  type LucideIcon,
} from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import type { Strength, StrengthIcon } from "@/types/portfolio";

const icons: Record<StrengthIcon, LucideIcon> = {
  code: CodeXml,
  architecture: Layers,
  api: Webhook,
  database: Database,
  modules: Boxes,
  scale: Network,
  auth: KeyRound,
  security: ShieldCheck,
  integrations: Cable,
  performance: Gauge,
  leadership: Compass,
  frontend: PanelsTopLeft,
  ai: Sparkles,
};

/**
 * Key strengths as icon tokens. They pop in one after another on first view;
 * on hover a token lifts, glows and its icon fills with the accent.
 * The first strength is the core specialism and stays highlighted.
 */
export function StrengthList({ strengths }: { strengths: readonly Strength[] }) {
  return (
    <RevealGroup as="ul" interval={0.045} className="flex flex-wrap gap-2.5 sm:gap-3">
      {strengths.map((strength, index) => {
        const Icon = icons[strength.icon];
        const core = index === 0;
        return (
          <RevealItem as="li" variant="pop" key={strength.label} className="max-w-full">
            <span
              className={cn(
                "group/token relative inline-flex min-h-11 max-w-full items-center gap-2.5 overflow-hidden rounded-full border py-1.5 ps-1.5 pe-4 sm:min-h-12 sm:gap-3 sm:pe-5",
                "transition-[translate,border-color,background-color,box-shadow] duration-500 ease-out-expo",
                "hover:-translate-y-0.5 hover:border-accent/55 hover:bg-accent-soft hover:shadow-[0_14px_34px_-14px_rgb(130_87_255/0.65)]",
                core ? "border-accent/45 bg-accent-soft" : "border-line bg-white/[0.025]",
              )}
            >
              {/* Light sweep across the token on hover. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -start-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent opacity-0 transition-[translate,opacity] duration-700 ease-out-expo group-hover/token:translate-x-[300%] group-hover/token:opacity-100 rtl:group-hover/token:-translate-x-[300%]"
              />
              <span
                aria-hidden
                className={cn(
                  "relative inline-flex size-8 shrink-0 items-center sm:size-9 justify-center rounded-full ring-1 transition-[background-color,color,rotate,box-shadow] duration-500 ease-out-expo",
                  "group-hover/token:-rotate-8 group-hover/token:bg-accent group-hover/token:text-ink-950 group-hover/token:ring-accent",
                  core ? "bg-accent text-ink-950 ring-accent" : "bg-accent-soft text-accent ring-accent/25",
                )}
              >
                <Icon className="size-[1.05rem]" strokeWidth={1.75} />
              </span>
              <span className="relative text-sm leading-snug sm:text-[0.9375rem] font-medium text-fg/90 transition-colors duration-300 group-hover/token:text-fg">
                {strength.label}
              </span>
            </span>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
