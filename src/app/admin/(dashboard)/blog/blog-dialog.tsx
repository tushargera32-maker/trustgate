"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "./actions";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string;
  category: string | null;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

interface BlogDialogProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  "Immigration News",
  "Visa Guides",
  "Travel Tips",
  "Success Stories",
  "Policy Updates",
  "Country Guides"
];

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export function BlogDialog({ post, open, onOpenChange }: BlogDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "DRAFT",
    category: "",
    featuredImage: "",
    seoTitle: "",
    seoDescription: ""
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        status: post.status,
        category: post.category || "",
        featuredImage: post.featuredImage || "",
        seoTitle: post.seoTitle || "",
        seoDescription: post.seoDescription || ""
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        status: "DRAFT",
        category: "",
        featuredImage: "",
        seoTitle: "",
        seoDescription: ""
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      seoTitle: prev.seoTitle || title
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        status: formData.status,
        category: formData.category || null,
        featuredImage: formData.featuredImage || null,
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null
      };

      if (post) {
        await updateBlogPost(post.id, data);
      } else {
        await createBlogPost(data);
      }

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Failed to save blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setLoading(true);
    try {
      await deleteBlogPost(post.id);
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert("Failed to delete blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {post ? "Edit Blog Post" : "Create New Blog Post"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="How to Apply for a UK Tourist Visa"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="how-to-apply-uk-tourist-visa"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  /blog/{formData.slug || "slug"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Brief summary shown in listings..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Write your blog post content here..."
                rows={12}
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featuredImage: e.target.value
                  }))
                }
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
          </div>

          {/* SEO Section */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">SEO Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))
                }
                placeholder="Optimized title for search engines"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {formData.seoTitle.length}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seoDescription: e.target.value
                  }))
                }
                placeholder="Meta description for search results"
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {formData.seoDescription.length}/160 characters
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="status" className="cursor-pointer">
                Publication Status
              </Label>
              <p className="text-sm text-muted-foreground">
                Current: {formData.status}
              </p>
            </div>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            {post && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : post ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
