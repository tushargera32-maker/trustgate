import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { BlogContent } from "./blog-content";

export const metadata = {
  title: "Blog Management | Admin",
  description: "Manage blog posts and content"
};

export const revalidate = 0;

async function getBlogPosts() {
  return await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      },
      _count: {
        select: { comments: true }
      }
    }
  });
}

export default async function BlogAdminPage() {
  await requireStaff();
  const posts = await getBlogPosts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent posts={posts} />
    </Suspense>
  );
}
