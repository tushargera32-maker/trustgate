import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireStaff } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await requireStaff();
  const { id } = params;
  await prisma.lead.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await requireStaff();
  const { id } = params;
  const data = await request.json();
  const { fullName, email, phone, hub, service, notes, stage } = data;
  const updated = await prisma.lead.update({
    where: { id },
    data: {
      fullName,
      email,
      phone: phone ?? null,
      countryOfInterest: hub ?? null,
      visaTypeInterest: service ?? null,
      notes: notes ?? undefined,
      stage: stage ?? undefined,
    },
  });
  return NextResponse.json(updated);
}
