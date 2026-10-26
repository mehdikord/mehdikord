"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition, type ReactNode } from "react";

import { buttonClass } from "@/components/admin/form";
import { Modal } from "@/components/admin/Modal";
import { useToast } from "@/components/admin/Toast";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/server/admin/action-state";

/** Which record the create/edit modal is showing: `null` closed, `"new"` create. */
export function useEditor<T>() {
  const [editing, setEditing] = useState<T | "new" | null>(null);
  return {
    open: editing !== null,
    item: editing === "new" || editing === null ? null : editing,
    create: () => setEditing("new"),
    edit: (item: T) => setEditing(item),
    close: () => setEditing(null),
  };
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-fg-subtle">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function CreateButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={buttonClass("primary")}>
      <Plus aria-hidden className="size-4" />
      {label}
    </button>
  );
}

export interface Column<T> {
  header: string;
  cell: (item: T) => ReactNode;
  className?: string;
}

interface ResourceTableProps<T extends { id: string }> {
  items: readonly T[];
  columns: readonly Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => Promise<ActionState>;
  /** Name shown in the delete confirmation. */
  describe: (item: T) => string;
  extraActions?: (item: T) => ReactNode;
  empty?: string;
}

export function ResourceTable<T extends { id: string }>({
  items,
  columns,
  onEdit,
  onDelete,
  describe,
  extraActions,
  empty = "هنوز موردی ثبت نشده است.",
}: ResourceTableProps<T>) {
  if (items.length === 0) {
    return <p className="rounded-lg border border-dashed border-line-strong px-6 py-14 text-center text-sm text-fg-subtle">{empty}</p>;
  }

  return (
    // `relative` keeps the absolutely positioned sr-only header inside the scroll box.
    <div className="relative overflow-x-auto rounded-lg border border-line bg-ink-900/60">
      <table className="w-full min-w-[40rem] text-sm">
        <thead>
          <tr className="border-b border-line text-start text-xs text-fg-subtle">
            {columns.map((column) => (
              <th key={column.header} scope="col" className={cn("px-4 py-3 text-start font-medium", column.className)}>
                {column.header}
              </th>
            ))}
            <th scope="col" className="w-0 px-4 py-3">
              <span className="sr-only">عملیات</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
              {columns.map((column) => (
                <td key={column.header} className={cn("px-4 py-3 align-middle", column.className)}>
                  {column.cell(item)}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {extraActions?.(item)}
                  <button type="button" onClick={() => onEdit(item)} className={buttonClass("ghost", "sm")}>
                    <Pencil aria-hidden className="size-3.5" />
                    ویرایش
                  </button>
                  <DeleteButton name={describe(item)} onConfirm={() => onDelete(item.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Delete with a confirmation modal; reports the result as a toast. */
export function DeleteButton({ name, onConfirm, compact = false }: { name: string; onConfirm: () => Promise<ActionState>; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const notify = useToast();

  function confirm() {
    startTransition(async () => {
      const result = await onConfirm();
      if (result.message) notify(result.message, result.ok ? "success" : "error");
      if (result.ok) setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={compact ? `حذف ${name}` : undefined}
        className={cn(buttonClass("ghost", "sm"), "hover:bg-red-500/10 hover:text-red-300")}
      >
        <Trash2 aria-hidden className="size-3.5" />
        {compact ? null : "حذف"}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="حذف شود؟" size="sm">
        <div className="px-5 py-5 text-sm text-fg-muted sm:px-6">
          «<span className="text-fg">{name}</span>» برای همیشه حذف می‌شود. این کار قابل بازگشت نیست.
        </div>
        <footer className="flex justify-end gap-2 border-t border-line px-5 py-3.5 sm:px-6">
          <button type="button" onClick={() => setOpen(false)} className={buttonClass("ghost")}>
            انصراف
          </button>
          <button type="button" onClick={confirm} disabled={pending} className={buttonClass("danger")}>
            {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
            حذف
          </button>
        </footer>
      </Modal>
    </>
  );
}

/** Small pill for status columns. */
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "success" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-medium",
        tone === "neutral" && "bg-white/5 text-fg-muted",
        tone === "accent" && "bg-accent-soft text-accent",
        tone === "success" && "bg-signal/10 text-signal",
      )}
    >
      {children}
    </span>
  );
}
