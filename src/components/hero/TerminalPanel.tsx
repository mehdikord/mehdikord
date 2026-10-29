"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/*
 * A deploy from the command line, typed out and looped: the command is typed
 * character by character, the pipeline stages then report in one after
 * another. With reduced motion (or while off-screen) the finished log is shown.
 */

type LineKind = "cmd" | "out" | "ok";

interface ScriptLine {
  kind: LineKind;
  text: string;
}

const script: readonly ScriptLine[] = [
  { kind: "cmd", text: "git push origin main" },
  { kind: "out", text: "ci       248 tests passed · 12.4s" },
  { kind: "out", text: "build    api:1.284 · 48 MB · cached" },
  { kind: "out", text: "deploy   rolling · app-01 ✓ 02 ✓ 03 ✓" },
  { kind: "out", text: "migrate  3 migrations · 0.9s" },
  { kind: "ok", text: "live on 3 nodes · p95 38 ms · 0 errors" },
];

interface Cursor {
  /** Index of the line being revealed; `script.length` once everything is shown. */
  line: number;
  /** Characters typed of the current command line. */
  char: number;
}

function useTypewriter(running: boolean): Cursor {
  const [cursor, setCursor] = useState<Cursor>({ line: 0, char: 0 });
  const position = useRef<Cursor>({ line: 0, char: 0 });

  useEffect(() => {
    if (!running) return;
    let timer = 0;

    const step = () => {
      const current = position.current;
      const entry = script[current.line];

      if (!entry) {
        // Everything is on screen: clear and start the next deploy.
        position.current = { line: 0, char: 0 };
        setCursor(position.current);
        timer = window.setTimeout(step, 700);
        return;
      }

      if (entry.kind === "cmd" && current.char < entry.text.length) {
        position.current = { line: current.line, char: current.char + 1 };
        setCursor(position.current);
        timer = window.setTimeout(step, 28 + Math.random() * 55);
        return;
      }

      position.current = { line: current.line + 1, char: 0 };
      setCursor(position.current);
      const finished = position.current.line === script.length;
      timer = window.setTimeout(step, finished ? 4800 : entry.kind === "cmd" ? 650 : 340 + Math.random() * 280);
    };

    const fresh = position.current.line === 0 && position.current.char === 0;
    timer = window.setTimeout(step, fresh ? 1400 : 400);
    return () => window.clearTimeout(timer);
  }, [running]);

  return cursor;
}

export function TerminalPanel({ running, animate }: { running: boolean; animate: boolean }) {
  const cursor = useTypewriter(running && animate);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-tint/15" />
          <span className="size-2 rounded-full bg-tint/15" />
          <span className="size-2 rounded-full bg-tint/15" />
        </span>
        <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase">deploy — zsh</span>
        <span className="ms-auto font-mono text-[0.625rem] text-fg-subtle">#1284</span>
      </div>

      <ol className="min-h-[7.25rem] space-y-1.5 px-4 py-3.5 font-mono text-[0.6875rem] leading-[1.45] whitespace-pre text-fg-muted">
        {script.map((entry, index) => {
          const complete = !animate || index < cursor.line;
          const typing = animate && index === cursor.line && entry.kind === "cmd";
          if (!complete && !typing) return null;

          const text = typing ? entry.text.slice(0, cursor.char) : entry.text;

          return (
            <li
              key={entry.text}
              className={cn(
                "flex gap-2",
                entry.kind === "cmd" && "text-fg",
                entry.kind === "ok" && "text-signal",
              )}
            >
              <span aria-hidden className={cn("shrink-0", entry.kind === "cmd" ? "text-accent" : "text-fg-subtle")}>
                {entry.kind === "cmd" ? "$" : entry.kind === "ok" ? "✓" : "›"}
              </span>
              <span>
                {text}
                {typing ? <span aria-hidden className="hero-caret ms-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-accent" /> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
