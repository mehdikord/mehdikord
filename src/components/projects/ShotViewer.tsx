"use client";

import { Lock, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ShotDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Host shown in the bar, e.g. "example.com". */
  address?: string;
  closeLabel: string;
  /** The full-length screenshot. Lazy images inside load only once the dialog opens. */
  children: ReactNode;
}

/**
 * Full-screen viewer for a whole page screenshot: the page at reading size
 * in a column the visitor scrolls natively. A modal `<dialog>`, so Escape,
 * focus trapping and the inert background come from the browser.
 */
export function ShotDialog({ open, onClose, title, address, closeLabel, children }: ShotDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      bodyRef.current?.scrollTo({ top: 0 });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      // A click on the backdrop (the dialog itself, outside the panel) closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="shot-viewer"
    >
      <div className="shot-viewer-panel">
        {/* Browser chrome reads left to right in every language, like the device bar. */}
        <header dir="ltr" className="flex h-12 shrink-0 items-center gap-3 border-b border-line bg-ink-900/95 px-3 backdrop-blur-md sm:px-4">
          <span aria-hidden className="hidden gap-1.5 sm:flex">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-medium sm:text-center">
            {address ? (
              <span dir="ltr" className="inline-flex max-w-full items-center gap-1.5 font-mono text-xs text-fg-muted">
                <Lock aria-hidden className="size-3 shrink-0" />
                <span className="truncate">{address}</span>
              </span>
            ) : (
              title
            )}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line-strong px-3 text-xs text-fg-muted transition-colors hover:border-fg-subtle hover:text-fg"
          >
            <X aria-hidden className="size-3.5" />
            {closeLabel}
          </button>
        </header>
        <div ref={bodyRef} className="shot-viewer-body">
          {children}
        </div>
      </div>
    </dialog>
  );
}

interface ShotViewerButtonProps extends Omit<ShotDialogProps, "open" | "onClose" | "children"> {
  /** Accessible name of the trigger. */
  label: string;
  /** What the trigger looks like (e.g. a framed preview). */
  children: ReactNode;
  /** The full-length screenshot shown in the viewer. */
  image: ReactNode;
  className?: string;
}

/** A preview that opens the full page in the viewer. */
export function ShotViewerButton({ label, children, image, className, ...dialog }: ShotViewerButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-label={label} onClick={() => setOpen(true)} className={cn("block w-full cursor-zoom-in text-start", className)}>
        {children}
      </button>
      <ShotDialog {...dialog} open={open} onClose={() => setOpen(false)}>
        {image}
      </ShotDialog>
    </>
  );
}
