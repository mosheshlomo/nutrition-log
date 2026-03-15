import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const template = await prisma.mealTemplate.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(template);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();

  // Update template + replace items
  await prisma.templateItem.deleteMany({ where: { templateId: params.id } });
  const template = await prisma.mealTemplate.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description ?? null,
      items: {
        create: (body.items || []).map(
          (
            item: {
              foodItemId?: string;
              foodName: string;
              quantity?: string;
              calories: number;
              protein: number;
              carbs: number;
              fat: number;
              sortOrder?: number;
            },
            idx: number
          ) => ({
            foodItemId: item.foodItemId ?? null,
            foodName: item.foodName,
            quantity: item.quantity ?? null,
            calories: Number(item.calories) || 0,
            protein: Number(item.protein) || 0,
            carbs: Number(item.carbs) || 0,
            fat: Number(item.fat) || 0,
            sortOrder: item.sortOrder ?? idx,
          })
        ),
      },
    },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(template);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.mealTemplate.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
