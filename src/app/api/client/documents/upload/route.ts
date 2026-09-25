import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Client document upload.
 *
 * Deliberately NOT reusing /api/admin/upload-image: that route writes into
 * /public, which is served statically to anyone who guesses the URL. Passports,
 * bank statements and employment letters must never be publicly reachable.
 *
 * Files here are written outside the web root and can only be read back through
 * the authenticated download route, which re-checks ownership on every request.
 *
 * NOTE: local disk is single-server and does not survive a redeploy on hosts
 * with an ephemeral filesystem (Vercel, Railway, Fly). Before going live, point
 * STORAGE_DIR at a mounted volume or swap the write below for S3/R2/Blob. The
 * database only ever stores the key, so that swap touches this file alone.
 */

const STORAGE_DIR =
  process.env.DOCUMENT_STORAGE_DIR ?? join(process.cwd(), ".uploads");

const MAX_BYTES = 10 * 1024 * 1024;

const ACCEPTED: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });

  if (!client) {
    return NextResponse.json(
      { error: "No client record is linked to this account." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const documentId = formData.get("documentId");

  if (!(file instanceof File) || typeof documentId !== "string") {
    return NextResponse.json(
      { error: "A file and documentId are required." },
      { status: 400 }
    );
  }

  // Confirm the target document belongs to this client BEFORE writing anything
  // to disk — otherwise an attacker can fill the volume with orphaned files.
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { clientId: true }
  });

  if (!document || document.clientId !== client.id) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const extension = ACCEPTED[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Upload a PDF, JPG, PNG or WebP file." },
      { status: 415 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Files must be 10MB or smaller." },
      { status: 413 }
    );
  }

  // The stored name is generated, never taken from the upload. A user-supplied
  // filename is a path-traversal vector and can leak personal details.
  const storageKey = `${client.id}/${randomUUID()}.${extension}`;
  const destination = join(STORAGE_DIR, storageKey);

  try {
    await mkdir(join(STORAGE_DIR, client.id), { recursive: true });
    await writeFile(destination, Buffer.from(await file.arrayBuffer()));
  } catch (error) {
    console.error("[document-upload]", error);
    return NextResponse.json(
      { error: "The file could not be saved. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ storageKey });
}
