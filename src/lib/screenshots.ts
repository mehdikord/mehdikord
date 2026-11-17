import type { ImageRendition, ImageVariants, ProjectImage } from "@/types/portfolio";

/**
 * Posters are cropped to the top of the page at this height-to-width ratio
 * (1920×3072): a few screens of the site, enough for cards to scroll through
 * a little without downloading the whole page. Mirrored on upload.
 */
export const POSTER_RATIO = 1.6;

function jsonRenditions(value: unknown): ImageRendition[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) =>
    item &&
    typeof item === "object" &&
    typeof item.src === "string" &&
    typeof item.width === "number" &&
    typeof item.height === "number" &&
    item.width > 0 &&
    item.height > 0
      ? [{ src: item.src, width: item.width, height: item.height, ...(typeof item.bytes === "number" ? { bytes: item.bytes } : {}) }]
      : [],
  );
}

/** Narrows the `project_images.variants` JSON column; `null` when absent or malformed. */
export function jsonVariants(value: unknown): ImageVariants | null {
  if (!value || typeof value !== "object") return null;
  const { full, poster } = value as Record<string, unknown>;
  const variants = { full: jsonRenditions(full), poster: jsonRenditions(poster) };
  if (!variants.full.length || !variants.poster.length) return null;
  const widest = (a: ImageRendition, b: ImageRendition) => b.width - a.width;
  return { full: variants.full.sort(widest), poster: variants.poster.sort(widest) };
}

/**
 * A project image from its database row. Files stored before optimized
 * copies existed act as their own single full and poster rendition.
 */
export function toProjectImage(row: { path: string; width: number; height: number; variants: unknown }, alt: string): ProjectImage {
  const original = { src: row.path, width: row.width, height: row.height };
  const variants = jsonVariants(row.variants);
  return {
    ...original,
    alt,
    full: variants?.full ?? [original],
    poster: variants?.poster ?? [original],
  };
}

/** `srcset` for a set of renditions: "a.webp 1920w, b.webp 1280w". */
export function srcSetOf(renditions: readonly ImageRendition[]): string {
  return renditions.map((rendition) => `${rendition.src} ${rendition.width}w`).join(", ");
}

/** Height ÷ width of a rendition set (they share one aspect ratio). */
export function aspectOf(renditions: readonly ImageRendition[]): number {
  const first = renditions[0];
  return first && first.width > 0 ? first.height / first.width : 0.625;
}

/** The smallest rendition at least `width` pixels wide, else the widest. */
export function renditionFor(renditions: readonly ImageRendition[], width: number): ImageRendition | undefined {
  return [...renditions].reverse().find((rendition) => rendition.width >= width) ?? renditions[0];
}
