import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { imageSize } from "image-size";

/**
 * Uploaded media lives outside `public/` (which is fixed at build time) in
 * `storage/uploads`, and is served by `app/uploads/[...path]/route.ts`.
 */
export const UPLOADS_ROOT = path.join(process.cwd(), "storage", "uploads");
export const UPLOADS_URL = "/uploads";

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

/** Logos may also be SVG; they are only ever rendered through <img>. */
export const LOGO_TYPES: Record<string, string> = { ...IMAGE_TYPES, "image/svg+xml": "svg" };

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export interface StoredImage {
  url: string;
  width: number;
  height: number;
}

/** Saves an uploaded image under `storage/uploads/<folder>/` and returns its public URL and size. */
export async function storeImage(file: File, folder: string, types: Record<string, string> = IMAGE_TYPES): Promise<StoredImage> {
  const extension = types[file.type];
  if (!extension) throw new Error("Unsupported image type");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { width, height } = imageSize(bytes);
  if (!width || !height) throw new Error("Unreadable image");

  const name = `${randomUUID()}.${extension}`;
  const directory = path.join(UPLOADS_ROOT, folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), bytes);

  return { url: `${UPLOADS_URL}/${folder}/${name}`, width, height };
}

/** Resolves a public `/uploads/...` URL to a path inside the uploads root, or `null`. */
export function resolveUpload(url: string): string | null {
  if (!url.startsWith(`${UPLOADS_URL}/`)) return null;
  const target = path.resolve(UPLOADS_ROOT, decodeURIComponent(url.slice(UPLOADS_URL.length + 1)));
  return target.startsWith(UPLOADS_ROOT + path.sep) ? target : null;
}

/** Deletes an uploaded file or folder by public URL; anything outside the uploads root is ignored. */
export async function removeUpload(url: string): Promise<void> {
  const target = resolveUpload(url);
  if (target) await rm(target, { recursive: true, force: true });
}
