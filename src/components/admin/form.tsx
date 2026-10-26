"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import {
  createContext,
  useContext,
  useId,
  useState,
  useTransition,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react";

import { useToast } from "@/components/admin/Toast";
import { cn } from "@/lib/utils";
import { idleState, type ActionState } from "@/server/admin/action-state";

/* ── Shared styles ──────────────────────────────────────────────────────── */

export const inputClass =
  "w-full rounded-sm border border-line-strong bg-ink-950 px-3 py-2 text-sm text-fg transition-colors placeholder:text-fg-subtle hover:border-white/25 focus:border-accent focus:outline-none aria-invalid:border-red-400/70 disabled:opacity-60";

export function buttonClass(variant: "primary" | "secondary" | "ghost" | "danger" = "primary", size: "sm" | "md" = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    size === "md" ? "h-9 px-4 text-sm" : "h-8 px-3 text-xs",
    variant === "primary" && "bg-accent text-ink-950 hover:bg-accent-strong hover:text-white",
    variant === "secondary" && "border border-line-strong text-fg hover:border-white/30 hover:bg-white/5",
    variant === "ghost" && "text-fg-muted hover:bg-white/5 hover:text-fg",
    variant === "danger" && "bg-red-500/90 text-white hover:bg-red-500",
  );
}

/* ── Form ───────────────────────────────────────────────────────────────── */

interface FormContextValue {
  errors: Record<string, string>;
  pending: boolean;
}

const FormContext = createContext<FormContextValue>({ errors: {}, pending: false });

export function useFieldError(name: string): string | undefined {
  return useContext(FormContext).errors[name];
}

/** Whether any field whose name starts with `prefix` has an error. */
export function useHasErrors(prefix: string): boolean {
  return Object.keys(useContext(FormContext).errors).some((key) => key.startsWith(prefix));
}

export type FormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

interface AdminFormProps {
  action: FormAction;
  onSuccess?: () => void;
  submitLabel?: string;
  onCancel?: () => void;
  children: ReactNode;
  /** Padding for use inside a modal; `page` renders as a standalone card. */
  layout?: "modal" | "page";
}

/**
 * Submits to a Server Action and keeps the user's input on validation errors
 * (a plain `<form action>` would reset uncontrolled fields after every submit).
 * Field components read their own errors by input name from context.
 */
export function AdminForm({ action, onSuccess, submitLabel = "ذخیره", onCancel, children, layout = "modal" }: AdminFormProps) {
  const [state, setState] = useState<ActionState>(idleState);
  const [pending, startTransition] = useTransition();
  const notify = useToast();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await action(state, formData);
      setState(result);
      if (result.ok) {
        if (result.message) notify(result.message);
        onSuccess?.();
      }
    });
  }

  const showAlert = !state.ok && state.message;

  return (
    <FormContext value={{ errors: state.errors ?? {}, pending }}>
      <form onSubmit={handleSubmit} noValidate className={cn(layout === "page" && "rounded-lg border border-line bg-ink-900/60")}>
        <div className={cn("space-y-5", layout === "modal" ? "px-5 py-5 sm:px-6" : "p-5 sm:p-7")}>
          {showAlert ? (
            <p role="alert" className="flex items-start gap-2.5 rounded-sm border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
              {state.message}
            </p>
          ) : null}
          {children}
        </div>
        <footer
          className={cn(
            "flex items-center justify-end gap-2 border-t border-line bg-ink-900/95 py-3.5",
            layout === "modal" ? "sticky bottom-0 px-5 sm:px-6" : "rounded-b-lg px-5 sm:px-7",
          )}
        >
          {onCancel ? (
            <button type="button" onClick={onCancel} className={buttonClass("ghost")}>
              انصراف
            </button>
          ) : null}
          <button type="submit" disabled={pending} className={buttonClass("primary")}>
            {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
            {submitLabel}
          </button>
        </footer>
      </form>
    </FormContext>
  );
}

/* ── Fields ─────────────────────────────────────────────────────────────── */

interface FieldProps {
  label: string;
  name: string;
  hint?: ReactNode;
  className?: string;
  children: (props: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => ReactNode;
}

/** Label, control, hint and the control's own validation error. */
export function Field({ label, name, hint, className, children }: FieldProps) {
  const id = useId();
  const error = useFieldError(name);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.8125rem] font-medium text-fg-muted">
        {label}
      </label>
      {children({ id, ...(error ? { "aria-invalid": true } : {}), ...(describedBy ? { "aria-describedby": describedBy } : {}) })}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<ComponentProps<"input">, "name" | "id"> & { label: string; name: string; hint?: ReactNode; fieldClassName?: string };

export function TextField({ label, name, hint, fieldClassName, className, ...props }: InputProps) {
  return (
    <Field label={label} name={name} hint={hint} className={fieldClassName}>
      {(field) => <input name={name} {...field} {...props} className={cn(inputClass, className)} />}
    </Field>
  );
}

type TextAreaProps = Omit<ComponentProps<"textarea">, "name" | "id" | "defaultValue"> & {
  label: string;
  name: string;
  hint?: ReactNode;
  fieldClassName?: string;
  defaultValue?: string | readonly string[];
};

/** Multi-line text. An array default renders one entry per line (parsed back with `lines()` on the server). */
export function TextAreaField({ label, name, hint, fieldClassName, className, defaultValue, rows = 3, ...props }: TextAreaProps) {
  const value = Array.isArray(defaultValue) ? defaultValue.join("\n") : defaultValue;
  return (
    <Field label={label} name={name} hint={hint} className={fieldClassName}>
      {(field) => (
        <textarea name={name} rows={rows} defaultValue={value} {...field} {...props} className={cn(inputClass, "resize-y leading-relaxed", className)} />
      )}
    </Field>
  );
}

type SelectProps = Omit<ComponentProps<"select">, "name" | "id"> & {
  label: string;
  name: string;
  hint?: ReactNode;
  fieldClassName?: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
};

export function SelectField({ label, name, hint, fieldClassName, className, options, placeholder, ...props }: SelectProps) {
  return (
    <Field label={label} name={name} hint={hint} className={fieldClassName}>
      {(field) => (
        <select name={name} {...field} {...props} className={cn(inputClass, "appearance-auto", className)}>
          {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function CheckboxField({ label, name, defaultChecked, hint }: { label: string; name: string; defaultChecked?: boolean; hint?: string }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--color-accent)]"
      />
      <label htmlFor={id} className="cursor-pointer text-sm">
        {label}
        {hint ? <span className="mt-0.5 block text-xs text-fg-subtle">{hint}</span> : null}
      </label>
    </div>
  );
}

/** Groups related fields under a small heading. */
export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4 border-t border-line pt-5 first:border-t-0 first:pt-0">
      <legend className="float-start mb-1 w-full">
        <span className="text-sm font-semibold text-fg">{title}</span>
        {description ? <span className="mt-0.5 block text-xs text-fg-subtle">{description}</span> : null}
      </legend>
      <div className="clear-both space-y-4">{children}</div>
    </fieldset>
  );
}

/** Responsive two-column grid for short fields. */
export function FieldGrid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
  return <div className={cn("grid gap-4", columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>{children}</div>;
}
