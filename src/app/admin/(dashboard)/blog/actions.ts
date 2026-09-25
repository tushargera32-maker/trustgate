"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string;
  category: string | null;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}) {
  const session = await requireStaff();

  const post = await prisma.blogPost.create({
    data: {
      ...data,
      authorId: session.user.id,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null
    }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return post;
}

export async function updateBlogPost(
  id: string,
  data: {
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
) {
  await requireStaff();

  const existingPost = await prisma.blogPost.findUnique({
    where: { id },
    select: { status: true, publishedAt: true }
  });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      publishedAt:
        data.status === "PUBLISHED" && !existingPost?.publishedAt
          ? new Date()
          : existingPost?.publishedAt
    }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return post;
}

export async function deleteBlogPost(id: string) {
  await requireStaff();

  await prisma.blogPost.delete({
    where: { id }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
