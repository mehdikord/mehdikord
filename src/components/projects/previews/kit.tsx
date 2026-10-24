import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/*
 * Building blocks for illustrative interface compositions. All sizes use
 * container-query units (cqw) relative to the 16:10 preview canvas, so a
 * composition scales like an image at any frame size.
 */

type Tone = "base" | "strong" | "accent" | "soft";

const tones: Record<Tone, string> = {
  base: "var(--pv-bar)",
  strong: "var(--pv-bar-strong)",
  accent: "var(--pa)",
  soft: "var(--ps)",
};

export function Bar({ w = 60, h = 0.55, tone = "base", className }: { w?: number; h?: number; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn("block shrink-0 rounded-full", className)}
      style={{ width: `${w}%`, height: `${h}cqw`, background: tones[tone] }}
    />
  );
}

export function Label({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={cn("block truncate text-[1.05cqw] leading-tight font-medium", className)} style={style}>
      {children}
    </span>
  );
}

export function Chip({ children, active = false, className }: { children: ReactNode; active?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-[0.8cqw] py-[0.3cqw] text-[0.85cqw] leading-none font-medium whitespace-nowrap",
        active ? "pv-soft-bg pv-accent-line pv-accent" : "pv-line pv-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({ size = 2, hue = 0 }: { size?: number; hue?: number }) {
  return (
    <span
      className="pv-accent-grad block shrink-0 rounded-full"
      style={{ width: `${size}cqw`, height: `${size}cqw`, filter: `hue-rotate(${hue}deg) saturate(0.85)`, opacity: 0.9 }}
    />
  );
}

export function Panel({ children, className, style }: { children?: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cn("pv-panel pv-line rounded-[0.7cqw] border", className)} style={style}>
      {children}
    </div>
  );
}

export function Button({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "pv-accent-grad inline-flex items-center justify-center rounded-[0.5cqw] px-[1.2cqw] py-[0.65cqw] text-[0.95cqw] leading-none font-medium whitespace-nowrap text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

const sidebarWidths = [62, 48, 70, 54, 40, 58, 66];

export function Sidebar({ active = 1, count = 6 }: { active?: number; count?: number }) {
  return (
    <div className="pv-line flex w-[13%] shrink-0 flex-col gap-[0.9cqw] border-r p-[1.4cqw]">
      <span className="pv-accent-grad mb-[1cqw] block size-[2.2cqw] rounded-[0.6cqw]" />
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn(
            "flex items-center gap-[0.6cqw] rounded-[0.5cqw] px-[0.6cqw] py-[0.6cqw]",
            index === active && "pv-soft-bg",
          )}
        >
          <span
            className={cn("block size-[1cqw] shrink-0 rounded-[0.25cqw]", index === active ? "pv-accent-bg" : "pv-bar-strong-bg")}
          />
          <Bar w={sidebarWidths[index % sidebarWidths.length]} tone={index === active ? "accent" : "base"} />
        </span>
      ))}
    </div>
  );
}

/** Application window with a minimal toolbar. */
export function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="pv-bg pv-text flex size-full flex-col overflow-hidden">
      <div className="pv-line flex h-[4cqw] shrink-0 items-center gap-[0.7cqw] border-b px-[1.6cqw]">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="pv-bar-strong-bg block size-[0.8cqw] rounded-full" />
        ))}
        <span className="pv-muted ml-[1.4cqw] text-[1cqw] font-medium">{title}</span>
        <span className="ml-auto flex items-center gap-[0.8cqw]">
          <span className="pv-raised pv-line block h-[2cqw] w-[14cqw] rounded-full border" />
          <Avatar size={2} hue={30} />
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
