import Image from "next/image";

import { ShotImage } from "@/components/projects/ShotImage";
import { getDictionary } from "@/data/dictionaries";
import { projectPlaceholder } from "@/data/media";
import { interpolate } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { aspectOf } from "@/lib/screenshots";
import { cn } from "@/lib/utils";
import type { ImageRendition, Project } from "@/types/portfolio";

/** What a project shows: its uploaded screenshot's copies, or the default image. */
export interface ProjectShot {
  alt: string;
  /** The whole page, widest first. */
  full: readonly ImageRendition[];
  /** The top of the page, widest first — for cards and previews. */
  poster: readonly ImageRendition[];
  /** True for the default image, which gets a badge so it isn't mistaken for a screenshot. */
  placeholder: boolean;
}

export async function getProjectShot(project: Project): Promise<ProjectShot> {
  const image = project.coverImage;
  if (image) return { alt: image.alt, full: image.full, poster: image.poster, placeholder: false };
  const copy = getDictionary(await getLocale()).work;
  const placeholder = [{ ...projectPlaceholder }];
  return { alt: interpolate(copy.previewAria, { title: project.title }), full: placeholder, poster: placeholder, placeholder: true };
}

/** Small badge marking the default image, so it isn't mistaken for a screenshot. */
export async function PreviewNotice({ placement = "bottom" }: { placement?: "top" | "bottom" }) {
  const copy = getDictionary(await getLocale()).work;
  return (
    <span
      className={cn(
        "label-mono absolute z-10 rounded-full border border-tint/10 bg-ink-950/75 px-2.5 py-1 text-[0.625rem] text-fg-muted backdrop-blur-md",
        placement === "top" ? "start-4 top-4" : "start-3 bottom-3",
      )}
    >
      {copy.previewNotice}
    </span>
  );
}

interface ProjectMediaProps {
  project: Project;
  /** Aspect ratio and sizing classes for the frame. */
  className?: string;
  sizes?: string;
  /**
   * How the rest of the poster comes into view: on hover (and keyboard focus
   * within the card), or a slow automatic browse for previews nobody hovers.
   */
  pan?: "hover" | "auto";
}

/**
 * Framed project visual for cards. Shows a standard-height window onto the
 * top of the page; the tall screenshot itself is never downloaded here —
 * only its poster copy, which then glides up on hover to reveal a few
 * screens more, like a visitor scrolling the site.
 */
export async function ProjectMedia({ project, className, sizes = "(min-width: 1024px) 40vw, 100vw", pan = "hover" }: ProjectMediaProps) {
  const shot = await getProjectShot(project);
  return (
    <div
      className={cn("shot-card relative isolate w-full overflow-hidden rounded-md bg-ink-900 shadow-frame", className)}
      data-pan={pan}
    >
      <div className="shot-window absolute inset-0 overflow-hidden">
        <ShotImage renditions={shot.poster} alt={shot.alt} sizes={sizes} className="shot-pan block min-h-full w-full object-cover object-top" />
      </div>
      {shot.placeholder ? <PreviewNotice /> : null}
    </div>
  );
}

/**
 * The top of the page at its natural aspect ratio and full width, for the
 * homepage frames that scroll through it with the page. Uses the poster copy,
 * so the frame travels a few screens down the site — not the whole page.
 */
export async function ProjectScreen({ project, sizes }: { project: Project; sizes: string }) {
  const shot = await getProjectShot(project);
  return <ShotImage renditions={shot.poster} alt={shot.alt} sizes={sizes} className="block h-auto w-full" />;
}

/** A tiny copy of the visual, blurred behind a frame so the project's colours light its surroundings. */
export async function ProjectAmbient({ project }: { project: Project }) {
  const shot = await getProjectShot(project);
  const smallest = shot.poster.at(-1) ?? projectPlaceholder;
  return (
    <Image
      src={smallest.src}
      alt=""
      fill
      sizes="96px"
      unoptimized={shot.placeholder}
      className="object-cover object-top"
    />
  );
}

/** Height ÷ width of the homepage visual (the poster). */
export function projectAspect(project: Project): number {
  return project.coverImage ? aspectOf(project.coverImage.poster) : projectPlaceholder.height / projectPlaceholder.width;
}
