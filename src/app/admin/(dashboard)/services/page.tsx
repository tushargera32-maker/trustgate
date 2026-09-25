import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { ServicesContent } from "./services-content";

export const metadata = {
  title: "Services Management | Admin",
  description: "Manage visa services and packages"
};

export const revalidate = 0;

async function getServices() {
  return await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      country: true,
      _count: {
        select: { applications: true }
      }
    }
  });
}

export default async function ServicesAdminPage() {
  await requireStaff();
  const services = await getServices();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicesContent services={services} />
    </Suspense>
  );
}
