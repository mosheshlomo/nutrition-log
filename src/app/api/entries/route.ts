import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (date) {
    where.date = date;
  } else if (startDate || endDate) {
    where.date = {
      ...(startDate ? { gte: startDate } : {}),
      ...(endDate ? { lte: endDate } : {}),
    };
  }

  if (search) {
    where.foodName = { contains: search };
  }

  const entries = await prisma.logEntry.findMany({
    where,
    orderBy: [{ date: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = await prisma.logEntry.create({
    data: {
      date: body.date,
      meal: body.meal,
      foodName: body.foodName,
      quantity: body.quantity ?? null,
      calories: Number(body.calories) || 0,
      protein: Number(body.protein) || 0,
      carbs: Number(body.carbs) || 0,
      fat: Number(body.fat) || 0,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json(entry, { status: 201 });
}
