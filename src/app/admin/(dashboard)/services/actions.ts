"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

export async function createService(data: {
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  published: boolean;
}) {
  await requireStaff();

  const service = await prisma.service.create({
    data: {
      ...data,
      processingTime: "10-15 business days" // Default value
    }
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return service;
}

export async function updateService(
  id: string,
  data: {
    name: string;
    slug: string;
    description: string | null;
    price: number | null;
    published: boolean;
  }
) {
  await requireStaff();

  const service = await prisma.service.update({
    where: { id },
    data
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath(`/services/${service.slug}`);
  return service;
}

export async function deleteService(id: string) {
  await requireStaff();

  await prisma.service.delete({
    where: { id }
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
}
