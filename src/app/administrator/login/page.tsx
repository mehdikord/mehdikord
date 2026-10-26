import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "ورود" };

export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-svh items-center justify-center px-4 py-12">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="hairline-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000,transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_45%,rgb(130_87_255/0.14),transparent_70%)]" />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-sm border border-accent/50 font-mono text-sm text-accent">MK</span>
          <h1 className="mt-5 text-xl font-semibold">ورود به پنل مدیریت</h1>
          <p className="mt-1.5 text-sm text-fg-subtle">با شماره موبایل و رمز عبور وارد شوید.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
