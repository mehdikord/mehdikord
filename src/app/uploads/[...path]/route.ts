import { readFile } from "node:fs/promises";
import path from "node:path";

import { IMAGE_TYPES, resolveUpload, UPLOADS_URL } from "@/server/uploads";

const contentTypes = Object.fromEntries(Object.entries(IMAGE_TYPES).map(([type, extension]) => [`.${extension}`, type]));

/** Serves files uploaded from the admin panel (see `src/server/uploads.ts`). */
export async function GET(_request: Request, { params }: RouteContext<"/uploads/[...path]">) {
  const { path: segments } = await params;
  const file = resolveUpload(`${UPLOADS_URL}/${segments.join("/")}`);
  const type = file ? contentTypes[path.extname(file).toLowerCase()] : undefined;
  if (!file || !type) return new Response("Not found", { status: 404 });

  try {
    const body = await readFile(file);
    return new Response(body, {
      headers: {
        "Content-Type": type,
        // File names are random and never reused, so they can be cached forever.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
