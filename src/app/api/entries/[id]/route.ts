import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const entry = await prisma.logEntry.findUnique({ where: { id: params.id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const entry = await prisma.logEntry.update({
    where: { id: params.id },
    data: {
      meal: body.meal,
      foodName: body.foodName,
      quantity: body.quantity ?? null,
      calories: body.calories !== undefined ? Number(body.calories) : undefined,
      protein: body.protein !== undefined ? Number(body.protein) : undefined,
      carbs: body.carbs !== undefined ? Number(body.carbs) : undefined,
      fat: body.fat !== undefined ? Number(body.fat) : undefined,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json(entry);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.logEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
