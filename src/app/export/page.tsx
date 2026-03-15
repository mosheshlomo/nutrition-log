"use client";

import { useState } from "react";

interface ExportOption {
  label: string;
  description: string;
  type: string;
  format: string;
  filename: string;
}

const OPTIONS: ExportOption[] = [
  {
    label: "גיבוי מלא (JSON)",
    description: "כל הרשומות, ספריית המזון והתבניות בקובץ JSON אחד.",
    type: "all",
    format: "json",
    filename: "nutrition-backup.json",
  },
  {
    label: "רשומות יומן (JSON)",
    description: "כל רשומות היומן היומי.",
    type: "entries",
    format: "json",
    filename: "nutrition-entries.json",
  },
  {
    label: "רשומות יומן (CSV)",
    description: "כל רשומות היומן כגיליון אלקטרוני.",
    type: "entries",
    format: "csv",
    filename: "nutrition-entries.csv",
  },
  {
    label: "ספריית מזון (JSON)",
    description: "ספריית המזון השמורה שלך.",
    type: "foods",
    format: "json",
    filename: "nutrition-foods.json",
  },
  {
    label: "ספריית מזון (CSV)",
    description: "ספריית המזון השמורה שלך כגיליון אלקטרוני.",
    type: "foods",
    format: "csv",
    filename: "nutrition-foods.csv",
  },
  {
    label: "תבניות ארוחה (JSON)",
    description: "כל תבניות הארוחה השמורות עם הפריטים שלהן.",
    type: "templates",
    format: "json",
    filename: "nutrition-templates.json",
  },
];

export default function ExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleExport(opt: ExportOption) {
    const key = `${opt.type}-${opt.format}`;
    setDownloading(key);
    try {
      const url = `/api/export?type=${opt.type}&format=${opt.format}`;
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const date = new Date().toISOString().split("T")[0];
      a.download = opt.filename.replace(".", `-${date}.`);
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <>
      <div className="mb-5">
        <h1 className="text-lg font-bold text-gray-900">ייצוא וגיבוי</h1>
        <p className="text-sm text-gray-500">
          הורד את הנתונים שלך בפורמטים ניידים. גבה באופן קבוע לשמירה מקומית.
        </p>
      </div>

      <div className="space-y-2 max-w-xl">
        {OPTIONS.map((opt) => {
          const key = `${opt.type}-${opt.format}`;
          return (
            <div key={key} className="card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
              </div>
              <button
                onClick={() => handleExport(opt)}
                disabled={downloading === key}
                className="btn-secondary btn-sm shrink-0"
              >
                {downloading === key ? "..." : "↓ הורד"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 card p-4 max-w-xl">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">שחזור / ייבוא</h2>
        <p className="text-xs text-gray-500">
          לשחזור נתונים, השתמש בכלי Prisma Studio או ייבא ישירות למסד הנתונים.
          הרץ <code className="font-mono bg-gray-100 px-1 rounded">npm run db:studio</code> לעורך מסד נתונים בדפדפן.
          קובץ מסד הנתונים נמצא ב־<code className="font-mono bg-gray-100 px-1 rounded">prisma/dev.db</code>.
        </p>
      </div>
    </>
  );
}
