"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const widths = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };

/**
 * Native `<dialog>` shown modally: focus is trapped, Escape closes it and the
 * rest of the page is inert. Content is only mounted while open, so each
 * opening starts from fresh default values.
 */
export function Modal({ open, onClose, title, description, size = "md", children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // Close on backdrop clicks (the dialog element itself is the backdrop area).
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="modal-title"
      className={cn(
        "m-auto max-h-[min(92svh,60rem)] w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-line-strong bg-ink-900 p-0 text-fg shadow-frame backdrop:bg-ink-950/75 backdrop:backdrop-blur-sm",
        widths[size],
      )}
    >
      {open ? (
        <div className="flex max-h-[inherit] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <h2 id="modal-title" className="text-base font-semibold">
                {title}
              </h2>
              {description ? <p className="mt-1 text-sm text-fg-subtle">{description}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="-m-1.5 inline-flex size-8 items-center justify-center rounded-sm text-fg-subtle transition-colors hover:bg-white/5 hover:text-fg"
            >
              <X aria-hidden className="size-4" />
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}
