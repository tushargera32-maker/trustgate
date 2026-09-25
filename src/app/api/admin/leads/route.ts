import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireStaff } from '@/lib/auth';

export async function GET(request: Request) {
  // Ensure only staff can list leads via API (optional, admin UI uses server side directly)
  await requireStaff();
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  await requireStaff();
  const data = await request.json();
  const { fullName, email, phone, hub, service, notes } = data;
  const lead = await prisma.lead.create({
    data: {
      fullName,
      email,
      phone: phone ?? null,
      countryOfInterest: hub ?? null,
      visaTypeInterest: service ?? null,
      source: "ADMIN_CREATE",
      stage: "NEW",
      notes: notes ?? null
    }
  });
  return NextResponse.json(lead);
}
