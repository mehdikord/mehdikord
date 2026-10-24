"use client";

import { AnimatePresence, m } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";

import { ease } from "@/components/motion/motion-variants";
import { content } from "@/data/content";
import { cn, pad } from "@/lib/utils";

export interface ExplorerEntry {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  /** Server-rendered row and preview, so preview code never ships to the client. */
  row: ReactNode;
  media: ReactNode;
}

export interface ExplorerCategory {
  id: string;
  label: string;
  count: number;
}

interface ProjectExplorerProps {
  entries: readonly ExplorerEntry[];
  categories: readonly ExplorerCategory[];
  activeCategory: string | null;
  onSelect?: (category: string | null) => void;
}

const copy = content.projectsPage;

export function ProjectExplorer({ entries, categories, activeCategory, onSelect }: ProjectExplorerProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = activeCategory ? entries.filter((entry) => entry.category === activeCategory) : entries;
  const previewEntry = filtered.find((entry) => entry.slug === hovered) ?? filtered[0];
  const filters = [{ id: null, label: copy.all, count: entries.length }, ...categories];

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div role="group" aria-label={copy.filterLabel} className="-mx-1 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const selected = filter.id === activeCategory || (filter.id === null && activeCategory === null);
            return (
              <button
                key={filter.id ?? "all"}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect?.(filter.id)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[0.8125rem] font-medium transition-colors duration-300",
                  selected
                    ? "border-accent/60 bg-accent-soft text-fg"
                    : "border-line-strong text-fg-muted hover:border-fg-subtle hover:text-fg",
                )}
              >
                {filter.label}
                <span className={cn("font-mono text-[0.6875rem]", selected ? "text-accent" : "text-fg-subtle")}>
                  {pad(filter.count)}
                </span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="label-mono shrink-0 text-fg-subtle">
          <span className="text-fg">{pad(filtered.length)}</span> / {pad(entries.length)} {copy.projectsNoun}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-start gap-5 border-b border-line py-24">
          <p className="text-title">{copy.emptyTitle}</p>
          <p className="text-fg-muted">{copy.emptyBody}</p>
          <button
            type="button"
            onClick={() => onSelect?.(null)}
            className="label-mono rounded-full border border-line-strong px-4 py-2.5 text-fg transition-colors hover:border-accent/60"
          >
            {copy.reset}
          </button>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
          <m.ol
            key={activeCategory ?? "all"}
            className="lg:col-span-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: ease.outQuart }}
          >
            {filtered.map((entry) => (
              <li
                key={entry.slug}
                className="group/row"
                data-active={previewEntry?.slug === entry.slug}
                onPointerEnter={() => setHovered(entry.slug)}
                onFocus={() => setHovered(entry.slug)}
              >
                {entry.row}
              </li>
            ))}
          </m.ol>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[calc(var(--nav-h)+2.5rem)] pt-10">
              <div className="relative aspect-[4/3]">
                <AnimatePresence initial={false}>
                  {previewEntry ? (
                    <m.div
                      key={previewEntry.slug}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 0.985 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: ease.outExpo }}
                    >
                      {previewEntry.media}
                    </m.div>
                  ) : null}
                </AnimatePresence>
              </div>
              {previewEntry ? (
                <p className="label-mono mt-5 flex items-center justify-between gap-4 text-fg-subtle">
                  <span className="truncate text-fg">{previewEntry.title}</span>
                  <span className="shrink-0">{previewEntry.categoryLabel}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Reads and writes the selected category in the URL (`?category=saas`). */
export function ProjectExplorerWithParams(props: Omit<ProjectExplorerProps, "activeCategory" | "onSelect">) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  function handleSelect(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    const query = params.toString();
    // Native history updates are synced with useSearchParams without a server round trip.
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  return <ProjectExplorer {...props} activeCategory={activeCategory} onSelect={handleSelect} />;
}
