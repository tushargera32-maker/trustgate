import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, normalize } from "path";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Authenticated document download.
 *
 * Every request re-checks who is asking. Staff may read any document; a client
 * may read only their own. There is no signed-URL shortcut here on purpose —
 * a URL that grants access on its own outlives the session that created it.
 */

const STORAGE_DIR =
  process.env.DOCUMENT_STORAGE_DIR ?? join(process.cwd(), ".uploads");

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const document = await prisma.document.findUnique({
    where: { id: params.id },
    select: {
      clientId: true,
      storageKey: true,
      fileName: true,
      mimeType: true
    }
  });

  if (!document?.storageKey) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const isStaff = Boolean(session.user.role) && session.user.role !== "CLIENT";

  if (!isStaff) {
    const client = await prisma.client.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    // 404 rather than 403: confirming a document exists but belongs to someone
    // else still leaks that it exists.
    if (!client || client.id !== document.clientId) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
  }

  // Defence in depth: keys are generated server-side, but a normalised path
  // that escapes the storage root must never be read.
  const resolved = normalize(join(STORAGE_DIR, document.storageKey));
  if (!resolved.startsWith(normalize(STORAGE_DIR))) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const data = await readFile(resolved);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": document.mimeType ?? "application/octet-stream",
        "Content-Disposition": `inline; filename="${(document.fileName ?? "document").replace(/"/g, "")}"`,
        // Never let a shared cache hold someone's passport.
        "Cache-Control": "private, no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
