import type { CSSProperties } from "react";

import { renditionFor, srcSetOf } from "@/lib/screenshots";
import type { ImageRendition } from "@/types/portfolio";

interface ShotImageProps {
  /** Copies of one image at several widths, widest first. */
  renditions: readonly ImageRendition[];
  alt: string;
  sizes: string;
  /** Load immediately with high priority (the page's main visual). */
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A screenshot from its pre-optimized WebP copies. A plain `<img srcset>`
 * rather than `next/image`: the copies are already sized and encoded at
 * high quality on upload, and the image optimizer would encode them again.
 * Works in server and client components.
 */
export function ShotImage({ renditions, alt, sizes, eager = false, className, style }: ShotImageProps) {
  const widest = renditions[0];
  const fallback = renditionFor(renditions, 1280);
  if (!widest || !fallback) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- see the component comment
    <img
      src={fallback.src}
      srcSet={renditions.length > 1 ? srcSetOf(renditions) : undefined}
      sizes={renditions.length > 1 ? sizes : undefined}
      width={widest.width}
      height={widest.height}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
      draggable={false}
      className={className}
      style={style}
    />
  );
}
