import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "all"; // all | entries | foods | templates
  const format = searchParams.get("format") || "json"; // json | csv

  const data: Record<string, unknown> = {};

  if (type === "all" || type === "entries") {
    data.entries = await prisma.logEntry.findMany({ orderBy: [{ date: "desc" }, { createdAt: "asc" }] });
  }

  if (type === "all" || type === "foods") {
    data.foods = await prisma.foodItem.findMany({ orderBy: { name: "asc" } });
  }

  if (type === "all" || type === "templates") {
    data.templates = await prisma.mealTemplate.findMany({
      include: { items: { orderBy: { sortOrder: "asc" } } },
      orderBy: { name: "asc" },
    });
  }

  if (format === "csv" && type !== "all") {
    let csv = "";
    if (type === "entries" && data.entries) {
      const entries = data.entries as Record<string, unknown>[];
      if (entries.length > 0) {
        csv = Object.keys(entries[0]).join(",") + "\n";
        csv += entries
          .map((e) =>
            Object.values(e)
              .map((v) => (typeof v === "string" && v.includes(",") ? `"${v}"` : v))
              .join(",")
          )
          .join("\n");
      }
    } else if (type === "foods" && data.foods) {
      const foods = data.foods as Record<string, unknown>[];
      if (foods.length > 0) {
        csv = Object.keys(foods[0]).join(",") + "\n";
        csv += foods
          .map((f) =>
            Object.values(f)
              .map((v) => (typeof v === "string" && v.includes(",") ? `"${v}"` : v))
              .join(",")
          )
          .join("\n");
      }
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="nutrition-${type}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="nutrition-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
