"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, Search, Edit, Eye, Calendar, User } from "lucide-react";
import Link from "next/link";
import { BlogDialog } from "./blog-dialog";
import { format } from "date-fns";

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
  publishedAt: Date | null;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
  };
  _count: {
    comments: number;
  };
}

export function BlogContent({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  const filtered = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || post.status === statusFilter;
    const matchesCategory =
      categoryFilter === "ALL" || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusCounts = {
    ALL: posts.length,
    PUBLISHED: posts.filter((p) => p.status === "PUBLISHED").length,
    DRAFT: posts.filter((p) => p.status === "DRAFT").length,
    ARCHIVED: posts.filter((p) => p.status === "ARCHIVED").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Content Management
          </p>
          <h1 className="mt-1 font-display text-3xl">Blog Posts</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Create and manage blog content
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedPost(null);
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All ({statusCounts.ALL})</SelectItem>
              <SelectItem value="PUBLISHED">
                Published ({statusCounts.PUBLISHED})
              </SelectItem>
              <SelectItem value="DRAFT">Draft ({statusCounts.DRAFT})</SelectItem>
              <SelectItem value="ARCHIVED">
                Archived ({statusCounts.ARCHIVED})
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat!}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No posts found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search || statusFilter !== "ALL" || categoryFilter !== "ALL"
                  ? "Try adjusting your filters"
                  : "Create your first blog post to get started"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {/* Thumbnail */}
                  {post.featuredImage && (
                    <div className="shrink-0 sm:w-32">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-24 w-full rounded-lg object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground font-mono">
                          {post.slug}
                        </p>
                      </div>
                      <Badge
                        variant={
                          post.status === "PUBLISHED"
                            ? "default"
                            : post.status === "DRAFT"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>

                    {post.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      {post.category && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {post.category}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {post.author.name || post.author.email}
                      </span>
                      {post.publishedAt && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(post.publishedAt), "MMM d, yyyy")}
                        </span>
                      )}
                      {post._count.comments > 0 && (
                        <span>{post._count.comments} comments</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 sm:flex-col">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2 sm:flex-none"
                      onClick={() => {
                        setSelectedPost(post);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>
                    {post.status === "PUBLISHED" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 gap-2 sm:flex-none"
                        asChild
                      >
                        {/* /blog/[slug] does not exist yet, so this opened a
                            blank 404 tab. Point at the index until the detail
                            route is built, then restore the slug link. */}
                        <Link
                          href="/blog"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Opens the public blog index — post detail pages are not built yet"
                        >
                          <Eye className="h-3.5 w-3.5" /> View live
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BlogDialog
        post={selectedPost}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
