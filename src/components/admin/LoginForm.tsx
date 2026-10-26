"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useActionState } from "react";

import { buttonClass, inputClass } from "@/components/admin/form";
import { idleState } from "@/server/admin/action-state";
import { login } from "@/server/admin/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, idleState);
  const errors = state.errors ?? {};

  return (
    <form action={action} noValidate className="space-y-4 rounded-lg border border-line bg-ink-900/70 p-6 shadow-frame backdrop-blur">
      {state.message ? (
        <p role="alert" className="flex items-start gap-2.5 rounded-sm border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-[0.8125rem] font-medium text-fg-muted">
          شماره موبایل
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="username"
          placeholder="09xxxxxxxxx"
          dir="ltr"
          required
          aria-invalid={errors.phone ? true : undefined}
          className={`${inputClass} text-start`}
        />
        {errors.phone ? <p className="mt-1.5 text-xs text-red-300">{errors.phone}</p> : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-[0.8125rem] font-medium text-fg-muted">
          رمز عبور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          required
          aria-invalid={errors.password ? true : undefined}
          className={`${inputClass} text-start`}
        />
        {errors.password ? <p className="mt-1.5 text-xs text-red-300">{errors.password}</p> : null}
      </div>

      <button type="submit" disabled={pending} className={`${buttonClass("primary")} w-full`}>
        {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
        ورود
      </button>
    </form>
  );
}
