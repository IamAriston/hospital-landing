import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Uploaded files live under <project>/assets, outside public/, so they aren't
// served statically. This handler streams them back for URLs like
// /assets/2026/08/doctors/uuid.jpg (written by lib/actions/uploads.ts).
const ASSETS_ROOT = path.join(process.cwd(), "assets");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // Reject traversal before touching the filesystem.
  if (segments.some((s) => s === ".." || s === "." || s.includes("\0"))) {
    return new NextResponse("Not found", { status: 404 });
  }

  const absPath = path.join(ASSETS_ROOT, ...segments);
  if (absPath !== ASSETS_ROOT && !absPath.startsWith(ASSETS_ROOT + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await readFile(absPath);
    const contentType =
      CONTENT_TYPES[path.extname(absPath).toLowerCase()] ??
      "application/octet-stream";
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        // New files are uuid-unique and replaces are cache-busted via ?v=.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
