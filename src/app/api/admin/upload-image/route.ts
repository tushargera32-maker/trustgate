import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    // "STAFF" is not a value in the Role enum, so the previous check rejected
    // every user and this route never worked. Staff is "any role that is not
    // CLIENT" — the same rule requireStaff() applies.
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role === "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This route writes into /public and is for marketing imagery ONLY.
    // Client documents go through /api/client/documents/upload, which stores
    // outside the web root.

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;

    if (!file || !path) {
      return NextResponse.json({ error: "Missing file or path" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine the full file path in public directory
    const publicDir = join(process.cwd(), "public");
    const fullPath = join(publicDir, path);
    const dir = dirname(fullPath);

    // Create directory if it doesn't exist
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    // Write the file
    await writeFile(fullPath, buffer);

    return NextResponse.json({
      success: true,
      path: path,
      message: "Image uploaded successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
