import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const food = await prisma.foodItem.findUnique({ where: { id: params.id } });
  if (!food) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(food);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const food = await prisma.foodItem.update({
    where: { id: params.id },
    data: {
      name: body.name,
      calories: body.calories !== undefined ? Number(body.calories) : undefined,
      protein: body.protein !== undefined ? Number(body.protein) : undefined,
      carbs: body.carbs !== undefined ? Number(body.carbs) : undefined,
      fat: body.fat !== undefined ? Number(body.fat) : undefined,
      serving: body.serving ?? null,
      tags: body.tags ?? null,
    },
  });
  return NextResponse.json(food);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.foodItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
