import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.userSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const settings = await prisma.userSettings.upsert({
    where: { id: "default" },
    update: {
      caloriesTarget: body.caloriesTarget !== undefined ? (body.caloriesTarget === "" ? null : Number(body.caloriesTarget)) : undefined,
      proteinTarget: body.proteinTarget !== undefined ? (body.proteinTarget === "" ? null : Number(body.proteinTarget)) : undefined,
      carbsTarget: body.carbsTarget !== undefined ? (body.carbsTarget === "" ? null : Number(body.carbsTarget)) : undefined,
      fatTarget: body.fatTarget !== undefined ? (body.fatTarget === "" ? null : Number(body.fatTarget)) : undefined,
      mealOrder: body.mealOrder,
    },
    create: { id: "default" },
  });
  return NextResponse.json(settings);
}
