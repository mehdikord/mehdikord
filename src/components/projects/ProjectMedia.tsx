import Image from "next/image";

import { Parallax } from "@/components/motion/Parallax";
import { Tilt } from "@/components/motion/Tilt";
import { getDictionary } from "@/data/dictionaries";
import { projectPlaceholder } from "@/data/media";
import { interpolate } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

/**
 * The project's visual without a frame: the uploaded cover screenshot, or the
 * default website image. Fills its positioned parent, cropped from the top so
 * a page screenshot keeps its header in view.
 */
export async function ProjectVisual({
  project,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  preload = false,
}: {
  project: Project;
  sizes?: string;
  preload?: boolean;
}) {
  if (project.coverImage) {
    return (
      <Image
        src={project.coverImage.src}
        alt={project.coverImage.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover object-top"
      />
    );
  }
  const copy = getDictionary(await getLocale()).work;
  return (
    <Image
      src={projectPlaceholder.src}
      alt={interpolate(copy.previewAria, { title: project.title })}
      fill
      sizes={sizes}
      preload={preload}
      // A vector image: nothing for the optimizer to do.
      unoptimized
      className="object-cover object-top"
    />
  );
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
  preload?: boolean;
  effect?: "none" | "parallax" | "tilt";
}

/** Framed project visual with hover zoom and an optional motion effect. */
export function ProjectMedia({ project, className, sizes, preload = false, effect = "none" }: ProjectMediaProps) {
  const zoomLayer = (
    <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.035]">
      <ProjectVisual project={project} sizes={sizes} preload={preload} />
    </div>
  );

  const frame = (
    <div className={cn("relative isolate w-full overflow-hidden rounded-md bg-ink-900 shadow-frame", className)}>
      {effect === "parallax" ? (
        <Parallax className="absolute inset-0" distance={4}>
          {zoomLayer}
        </Parallax>
      ) : (
        zoomLayer
      )}
      {project.coverImage ? null : <PreviewNotice />}
    </div>
  );

  return effect === "tilt" ? <Tilt>{frame}</Tilt> : frame;
}
