"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, Check, Loader2, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type ImageCategory = {
  id: string;
  title: string;
  description: string;
  images: {
    id: string;
    label: string;
    path: string;
    size: string;
  }[];
};

const IMAGE_CATEGORIES: ImageCategory[] = [
  {
    id: "branding",
    title: "Logo & Branding",
    description: "Main logo used in header and footer",
    images: [
      { id: "logo", label: "Main Logo", path: "/logo.webp", size: "180x50px recommended" }
    ]
  },
  {
    id: "hero",
    title: "Hero & Homepage",
    description: "Main hero section and homepage showcase images",
    images: [
      { id: "hero-bg", label: "Hero Background", path: "/hero/hero-background.webp", size: "1920x1080px" },
      { id: "consultation", label: "Consultation Image", path: "/hero/consultation-meeting.webp", size: "800x600px" },
      { id: "visa-success", label: "Visa Success", path: "/hero/visa-success.webp", size: "800x600px" }
    ]
  },
  {
    id: "offices",
    title: "Office Locations",
    description: "Office photos displayed on homepage and about page",
    images: [
      { id: "india-office", label: "India Office", path: "/office/india-office.webp", size: "800x600px" },
      { id: "london-office", label: "London Office", path: "/office/london-office.webp", size: "800x600px" }
    ]
  },
  {
    id: "team",
    title: "Team Members",
    description: "Team member photos shown on about page",
    images: [
      { id: "director", label: "Director", path: "/team/director.webp", size: "400x400px" },
      { id: "case-manager", label: "Case Manager", path: "/team/case-manager.webp", size: "400x400px" },
      { id: "content-specialist", label: "Content Specialist", path: "/team/content-specialist.webp", size: "400x400px" },
      { id: "finance-manager", label: "Finance Manager", path: "/team/finance-manager.webp", size: "400x400px" }
    ]
  },
  {
    id: "destinations",
    title: "Destination Countries",
    description: "Country/destination images for visa services",
    images: [
      { id: "schengen", label: "Schengen/Europe", path: "/destinations/schengen.webp", size: "800x600px" },
      { id: "uk", label: "United Kingdom", path: "/destinations/uk.webp", size: "800x600px" },
      { id: "australia", label: "Australia", path: "/destinations/australia.webp", size: "800x600px" },
      { id: "canada", label: "Canada", path: "/destinations/canada.webp", size: "800x600px" },
      { id: "usa", label: "USA", path: "/destinations/usa.webp", size: "800x600px" },
      { id: "new-zealand", label: "New Zealand", path: "/destinations/new-zealand.webp", size: "800x600px" }
    ]
  },
  {
    id: "testimonials",
    title: "Client Success Stories",
    description: "Client photos for testimonials and success stories",
    images: [
      { id: "client-1", label: "Client Story 1", path: "/stories/client-1.webp", size: "400x400px" },
      { id: "client-2", label: "Client Story 2", path: "/stories/client-2.webp", size: "400x400px" },
      { id: "client-3", label: "Client Story 3", path: "/stories/client-3.webp", size: "400x400px" }
    ]
  }
];

export function ImageSettings() {
  const [uploading, setUploading] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState<string | null>(null);

  const handleFileSelect = async (imageId: string, imagePath: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(imageId);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", imagePath);

      // Upload to API route
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadSuccess(imageId);
      setTimeout(() => setUploadSuccess(null), 3000);

      // Refresh the page to show new image
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-8">
      {IMAGE_CATEGORIES.map((category) => (
        <Card key={category.id}>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="font-display text-xl">{category.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.images.map((image) => (
                <div key={image.id} className="space-y-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-secondary/30">
                    <Image
                      src={image.path}
                      alt={image.label}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{image.label}</Label>
                      {uploadSuccess === image.id && (
                        <Badge variant="default" className="bg-teal-500">
                          <Check className="mr-1 h-3 w-3" />
                          Uploaded
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{image.size}</p>

                    <label className="block">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={(e) => handleFileSelect(image.id, image.path, e)}
                        disabled={uploading === image.id}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={uploading === image.id}
                        onClick={(e) => {
                          e.preventDefault();
                          (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                        }}
                      >
                        {uploading === image.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Replace Image
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-gold-200 bg-gold-50/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <ImageIcon className="mt-0.5 h-5 w-5 text-gold-600" />
            <div>
              <h3 className="font-medium text-gold-900">Image Upload Guidelines</h3>
              <ul className="mt-2 space-y-1 text-sm text-gold-800">
                <li>• Use PNG or JPG format for best quality</li>
                <li>• Follow recommended dimensions for optimal display</li>
                <li>• Keep file sizes under 5MB for faster loading</li>
                <li>• Images are automatically optimized by Next.js</li>
                <li>• Changes appear immediately after upload</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
