import { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { ImageSettings } from "./image-settings";

export const metadata: Metadata = {
  title: "Image Management",
  description: "Manage all website images from one place"
};

export default async function ImageManagementPage() {
  await requireStaff();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Settings
        </p>
        <h1 className="mt-1 font-display text-3xl">
          Image Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload and manage all website images including logo, hero images, office photos, team members, and destination images.
        </p>
      </div>

      <ImageSettings />
    </div>
  );
}
