import { cn } from "@/lib/utils";

/** Small live indicator with a soft pulse (static for reduced motion). */
export function StatusDot({ active = true, className }: { active?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-block size-1.5 shrink-0 rounded-full",
        active ? "status-dot bg-signal text-signal" : "bg-fg-subtle",
        className,
      )}
    />
  );
}
