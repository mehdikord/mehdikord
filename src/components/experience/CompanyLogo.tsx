import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "size-5 rounded-[0.3rem] p-0.5 text-[0.5rem]",
  md: "size-9 rounded-lg p-1.5 text-[0.6875rem]",
  lg: "size-14 rounded-xl p-2.5 text-base",
};

/** Up to two initials from the company name, e.g. "Commerce Group" → "CG". */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

interface CompanyLogoProps {
  src?: string;
  name: string;
  size?: Size;
  className?: string;
}

/**
 * Company mark for the timeline: the uploaded logo on a white tile, or a
 * violet monogram when no logo exists. Logos are plain <img> elements so
 * SVG uploads render as-is without the image optimizer.
 */
export function CompanyLogo({ src, name, size = "md", className }: CompanyLogoProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden ring-1 transition-transform duration-500 ease-out-expo",
        src ? "bg-white ring-black/10 shadow-[0_6px_20px_-10px_rgb(0_0_0/0.5)]" : "bg-gradient-to-br from-accent to-indigo font-semibold text-white ring-white/15",
        sizes[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="size-full object-contain" loading="lazy" decoding="async" />
      ) : (
        <span aria-hidden className="leading-none tracking-tight">
          {initials(name)}
        </span>
      )}
    </span>
  );
}
