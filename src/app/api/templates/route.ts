import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const templates = await prisma.mealTemplate.findMany({
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const template = await prisma.mealTemplate.create({
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
  return NextResponse.json(template, { status: 201 });
}
