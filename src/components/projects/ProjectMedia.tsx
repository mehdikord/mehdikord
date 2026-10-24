import Image from "next/image";

import { Parallax } from "@/components/motion/Parallax";
import { Tilt } from "@/components/motion/Tilt";
import { ProjectPreview } from "@/components/projects/ProjectPreview";
import { content } from "@/data/content";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

interface ProjectMediaProps {
  project: Project;
  /** Aspect ratio and sizing classes for the frame. */
  className?: string;
  sizes?: string;
  preload?: boolean;
  effect?: "none" | "parallax" | "tilt";
  surface?: "dark" | "light";
}

/**
 * Project visual: the real cover screenshot when provided, otherwise the
 * illustrative preview, clearly labelled as such.
 */
export function ProjectMedia({
  project,
  className,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  preload = false,
  effect = "none",
  surface = "dark",
}: ProjectMediaProps) {
  const visual = project.coverImage ? (
    <Image
      src={project.coverImage.src}
      alt={project.coverImage.alt}
      fill
      sizes={sizes}
      preload={preload}
      className="object-cover"
    />
  ) : (
    <ProjectPreview preview={project.preview} title={project.title} className="absolute inset-0" />
  );

  const zoomLayer = (
    <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.035]">
      {visual}
    </div>
  );

  const frame = (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden rounded-md",
        surface === "dark"
          ? "bg-ink-900 shadow-frame"
          : "bg-white shadow-[0_30px_60px_-30px_rgb(12_11_18/0.35)] ring-1 ring-paper-line",
        className,
      )}
    >
      {effect === "parallax" ? (
        <Parallax className="absolute inset-0" distance={4}>
          {zoomLayer}
        </Parallax>
      ) : (
        zoomLayer
      )}
      {project.coverImage ? null : (
        <span className="label-mono absolute bottom-3 left-3 z-10 rounded-full border border-white/10 bg-ink-950/75 px-2.5 py-1 text-[0.625rem] text-fg-muted backdrop-blur-md">
          {content.work.previewNotice}
        </span>
      )}
    </div>
  );

  return effect === "tilt" ? <Tilt>{frame}</Tilt> : frame;
}
