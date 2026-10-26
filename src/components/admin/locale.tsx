"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";

import { buttonClass, inputClass, useFieldError, useHasErrors } from "@/components/admin/form";
import { localeMeta, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Persian first: it is the panel's language and usually edited first. */
const tabOrder: readonly Locale[] = ["fa", "en"];

function TabButton({ locale, active, onSelect }: { locale: Locale; active: boolean; onSelect: () => void }) {
  const hasErrors = useHasErrors(`${locale}.`);
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={cn(
        "relative -mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm transition-colors",
        active ? "border-accent text-fg" : "border-transparent text-fg-subtle hover:text-fg",
      )}
    >
      {localeMeta[locale].nativeName}
      {hasErrors ? <span aria-label="دارای خطا" className="size-1.5 rounded-full bg-red-400" /> : null}
    </button>
  );
}

/**
 * Language tabs for translated fields. Both panels stay mounted (only hidden),
 * so switching tabs never loses input and both languages submit together.
 * `children(locale)` renders the fields, named `<locale>.<field>`.
 */
export function LocaleTabs({ children }: { children: (locale: Locale) => ReactNode }) {
  const [active, setActive] = useState<Locale>(tabOrder[0]!);

  return (
    <div className="rounded-md border border-line">
      <div role="tablist" aria-label="زبان محتوا" className="flex border-b border-line px-2">
        {tabOrder.map((locale) => (
          <TabButton key={locale} locale={locale} active={active === locale} onSelect={() => setActive(locale)} />
        ))}
      </div>
      {tabOrder.map((locale) => (
        <div
          key={locale}
          role="tabpanel"
          lang={locale}
          dir={localeMeta[locale].dir}
          hidden={active !== locale}
          className="space-y-4 p-4"
        >
          {children(locale)}
        </div>
      ))}
    </div>
  );
}

interface Note {
  title: string;
  detail: string;
}

/** Repeater for `{ title, detail }` pairs, posted as JSON in a hidden input. */
export function NotesField({ label, name, defaultValue = [] }: { label: string; name: string; defaultValue?: readonly Note[] }) {
  const [notes, setNotes] = useState<Note[]>(() => defaultValue.map((note) => ({ ...note })));
  const error = useFieldError(name);
  const update = (index: number, patch: Partial<Note>) =>
    setNotes((current) => current.map((note, i) => (i === index ? { ...note, ...patch } : note)));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[0.8125rem] font-medium text-fg-muted">{label}</span>
        <button type="button" onClick={() => setNotes((current) => [...current, { title: "", detail: "" }])} className={buttonClass("ghost", "sm")}>
          <Plus aria-hidden className="size-3.5" />
          افزودن
        </button>
      </div>
      <input type="hidden" name={name} value={JSON.stringify(notes)} />
      {notes.length === 0 ? (
        <p className="rounded-sm border border-dashed border-line-strong px-3 py-3 text-xs text-fg-subtle">موردی ثبت نشده است.</p>
      ) : (
        <ol className="space-y-2.5">
          {notes.map((note, index) => (
            <NoteRow
              key={index}
              name={name}
              index={index}
              note={note}
              onChange={(patch) => update(index, patch)}
              onRemove={() => setNotes((current) => current.filter((_, i) => i !== index))}
            />
          ))}
        </ol>
      )}
      {error ? <p className="mt-1.5 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

function NoteRow({
  name,
  index,
  note,
  onChange,
  onRemove,
}: {
  name: string;
  index: number;
  note: Note;
  onChange: (patch: Partial<Note>) => void;
  onRemove: () => void;
}) {
  const titleError = useFieldError(`${name}.${index}.title`);
  const detailError = useFieldError(`${name}.${index}.detail`);

  return (
    <li className="flex gap-2 rounded-sm border border-line bg-ink-950/40 p-2.5">
      <span className="w-5 shrink-0 pt-2 text-center font-mono text-xs text-fg-subtle">{index + 1}</span>
      <div className="min-w-0 flex-1 space-y-2">
        <input
          value={note.title}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="عنوان"
          aria-label={`عنوان مورد ${index + 1}`}
          aria-invalid={titleError ? true : undefined}
          className={inputClass}
        />
        <textarea
          value={note.detail}
          onChange={(event) => onChange({ detail: event.target.value })}
          placeholder="توضیح"
          rows={2}
          aria-label={`توضیح مورد ${index + 1}`}
          aria-invalid={detailError ? true : undefined}
          className={cn(inputClass, "resize-y leading-relaxed")}
        />
        {titleError || detailError ? <p className="text-xs text-red-300">{titleError ?? detailError}</p> : null}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`حذف مورد ${index + 1}`}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-fg-subtle hover:bg-red-500/10 hover:text-red-300"
      >
        <Trash2 aria-hidden className="size-4" />
      </button>
    </li>
  );
}
