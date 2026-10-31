"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface CopyButtonProps {
  /** Text placed on the clipboard. */
  value: string;
  labels: { copy: string; copied: string };
  className?: string;
}

/** Copies a value to the clipboard and confirms for a moment. */
export function CopyButton({ value, labels, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard unavailable (insecure context or denied): the link next to it still works.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? labels.copied : labels.copy}
      className={cn(
        "group inline-flex h-12 items-center gap-2.5 rounded-full border border-line-strong bg-tint/[0.03] px-5 text-[0.9375rem] font-medium backdrop-blur-sm transition-[border-color,background-color] duration-300 hover:border-accent/60 hover:bg-accent-soft",
        className,
      )}
    >
      <span aria-hidden className="relative inline-flex size-4">
        <Copy
          className={cn("absolute inset-0 size-4 transition-[opacity,scale] duration-300", copied ? "scale-50 opacity-0" : "opacity-100")}
          strokeWidth={1.75}
        />
        <Check
          className={cn("absolute inset-0 size-4 text-signal transition-[opacity,scale] duration-300", copied ? "opacity-100" : "scale-50 opacity-0")}
          strokeWidth={2}
        />
      </span>
      <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
    </button>
  );
}
