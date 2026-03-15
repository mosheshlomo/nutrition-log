import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  const foods = await prisma.foodItem.findMany({
    where: search ? { name: { contains: search } } : undefined,
    orderBy: { name: "asc" },
  });

  return NextResponse.json(foods);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const food = await prisma.foodItem.create({
    data: {
      name: body.name,
      calories: Number(body.calories) || 0,
      protein: Number(body.protein) || 0,
      carbs: Number(body.carbs) || 0,
      fat: Number(body.fat) || 0,
      serving: body.serving ?? null,
      tags: body.tags ?? null,
    },
  });
  return NextResponse.json(food, { status: 201 });
}
