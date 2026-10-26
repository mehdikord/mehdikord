"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Toast {
  id: number;
  tone: "success" | "error";
  message: string;
}

type Notify = (message: string, tone?: Toast["tone"]) => void;

const ToastContext = createContext<Notify>(() => {});

/** Short-lived status messages for admin actions. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const notify = useCallback<Notify>((message, tone = "success") => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, tone, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000);
  }, []);

  return (
    <ToastContext value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-5 z-[200] flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = toast.tone === "success" ? CheckCircle2 : XCircle;
          return (
            <p
              key={toast.id}
              role={toast.tone === "error" ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-md border bg-ink-850/95 px-4 py-3 text-sm shadow-frame backdrop-blur",
                toast.tone === "success" ? "border-signal/30" : "border-red-400/40",
              )}
            >
              <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", toast.tone === "success" ? "text-signal" : "text-red-400")} />
              {toast.message}
            </p>
          );
        })}
      </div>
    </ToastContext>
  );
}

export function useToast(): Notify {
  return useContext(ToastContext);
}
