import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp, { type Metadata, type Sharp, type SharpOptions, type WebpOptions } from "sharp";

import { POSTER_RATIO } from "@/lib/screenshots";
import { UPLOADS_ROOT, UPLOADS_URL } from "@/server/uploads";
import type { ImageRendition, ImageVariants } from "@/types/portfolio";

/**
 * Project screenshots arrive as huge full-page PNGs (1920 × 3000–13000 px,
 * 5–30 MB). Each upload is decoded once and stored as a small set of WebP
 * copies, so no page ever downloads more than it shows:
 *
 *   full-<w>.webp    the whole page — the project page's device mockup
 *   poster-<w>.webp  the top of the page (POSTER_RATIO) — cards and previews
 *
 * at 1920 / 1280 / 828 px wide, inside `projects/<id>/<uuid>/`. Settings were
 * chosen against real screenshots: lossy WebP at q90 with sharp-YUV chroma
 * keeps small text and coloured type indistinguishable from the PNG at 1:1
 * (~38–39 dB PSNR) while cutting 20–30 MB pages to 1–2 MB. Flat, graphic
 * pages sometimes compress better losslessly; those get whichever is smaller.
 */

/** Accepted upload types (the original is never kept). */
export const SCREENSHOT_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"]);
export const MAX_SCREENSHOT_BYTES = 40 * 1024 * 1024;

/** Widest stored copy; screenshots are taken at desktop width. */
const MAX_WIDTH = 1920;
/** Smaller copies for smaller screens, skipped when the source is narrower. */
const WIDTHS = [1280, 828];
/** WebP cannot store a side longer than this. */
const WEBP_MAX_SIDE = 16383;
/** Guards against decompression bombs (a 1920 × 78 000 page still fits). */
const MAX_INPUT_PIXELS = 150_000_000;
/** Rows or columns whose alpha never exceeds this are treated as empty and trimmed. */
const EMPTY_ALPHA = 8;

const LOSSY: WebpOptions = { quality: 90, effort: 5, smartSubsample: true };
const LOSSLESS: WebpOptions = { lossless: true, effort: 4 };

export interface StoredScreenshot {
  /** The widest full-length copy. */
  url: string;
  width: number;
  height: number;
  variants: ImageVariants;
}

interface Raw {
  data: Buffer;
  info: { width: number; height: number; channels: 1 | 2 | 3 | 4 };
}

export class ScreenshotError extends Error {}

/** Bounds of the non-transparent content (full-page captures often end in a transparent strip). */
function contentBounds({ data, info }: Raw): { left: number; top: number; width: number; height: number } | null {
  const { width, height } = info;
  const rowHas = new Uint8Array(height);
  const colHas = new Uint8Array(width);
  for (let y = 0; y < height; y += 1) {
    let offset = y * width * 4 + 3;
    for (let x = 0; x < width; x += 1, offset += 4) {
      if ((data[offset] ?? 0) > EMPTY_ALPHA) {
        rowHas[y] = 1;
        colHas[x] = 1;
      }
    }
  }
  const top = rowHas.indexOf(1);
  if (top === -1) return null;
  const bottom = rowHas.lastIndexOf(1);
  const left = colHas.indexOf(1);
  const right = colHas.lastIndexOf(1);
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/** Encodes lossy, or lossless as well when that may win, keeping the smaller file. */
async function encode(image: Sharp, tryLossless: boolean): Promise<Buffer> {
  const lossy = image.clone().webp(LOSSY).toBuffer();
  if (!tryLossless) return lossy;
  const [a, b] = await Promise.all([lossy, image.clone().webp(LOSSLESS).toBuffer()]);
  return b.length <= a.length ? b : a;
}

/** Widest stored width for a source, honouring the WebP side limit. */
function topWidth(width: number, height: number): number {
  return Math.max(1, Math.floor(Math.min(width, MAX_WIDTH, (width * WEBP_MAX_SIDE) / height)));
}

/**
 * Converts an uploaded screenshot into optimized WebP copies under
 * `storage/uploads/<folder>/<uuid>/` and returns their public URLs.
 * Throws `ScreenshotError` for unreadable or empty images.
 */
export async function storeScreenshot(file: File, folder: string): Promise<StoredScreenshot> {
  const input = Buffer.from(await file.arrayBuffer());
  const options: SharpOptions = { limitInputPixels: MAX_INPUT_PIXELS, failOn: "error" };

  let metadata: Metadata;
  let rgba: Raw;
  try {
    metadata = await sharp(input, options).metadata();
    // Decode once (first frame, EXIF orientation applied, sRGB) and reuse the pixels for every copy.
    rgba = await sharp(input, options).rotate().toColourspace("srgb").ensureAlpha().raw({ depth: "uchar" }).toBuffer({ resolveWithObject: true });
  } catch {
    throw new ScreenshotError("Unreadable image");
  }

  const bounds = contentBounds(rgba);
  if (!bounds) throw new ScreenshotError("Empty image");

  // Opaque RGB on white: transparent edges trimmed, alpha dropped (screenshots have no real transparency).
  const rgb: Raw = await sharp(rgba.data, { raw: rgba.info })
    .extract(bounds)
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = rgb.info;

  // Lossless only pays off for flat, graphic pages — which also compress well as PNG.
  const bytesPerPixel = input.length / ((metadata.width ?? width) * (metadata.height ?? height));
  const tryLossless = (metadata.format === "png" || metadata.format === "gif") && bytesPerPixel < 0.25;

  const widest = topWidth(width, height);
  const widths = [widest, ...WIDTHS.filter((w) => w < widest - 64)];
  const posterSourceHeight = Math.min(height, Math.round(width * POSTER_RATIO));

  const id = randomUUID();
  const directory = path.join(UPLOADS_ROOT, folder, id);
  const baseUrl = `${UPLOADS_URL}/${folder}/${id}`;
  await mkdir(directory, { recursive: true });

  const render = async (kind: "full" | "poster", targetWidth: number): Promise<ImageRendition> => {
    const sourceHeight = kind === "full" ? height : posterSourceHeight;
    const targetHeight = Math.max(1, Math.round((sourceHeight * targetWidth) / width));
    let image: Sharp = sharp(rgb.data, { raw: rgb.info });
    if (sourceHeight < height) image = image.extract({ left: 0, top: 0, width, height: sourceHeight });
    if (targetWidth !== width) image = image.resize(targetWidth, targetHeight, { fit: "fill", kernel: "lanczos3" });
    const output = await encode(image, tryLossless);
    const name = `${kind}-${targetWidth}.webp`;
    await writeFile(path.join(directory, name), output);
    return { src: `${baseUrl}/${name}`, width: targetWidth, height: targetHeight, bytes: output.length };
  };

  try {
    const [full, poster] = await Promise.all([
      Promise.all(widths.map((w) => render("full", w))),
      Promise.all(widths.map((w) => render("poster", w))),
    ]);
    const main = full[0]!;
    return { url: main.src, width: main.width, height: main.height, variants: { full, poster } };
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}
