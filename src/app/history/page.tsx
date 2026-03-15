"use client";

import { useEffect, useState } from "react";
import { formatShortDate, sumMacros, round1 } from "@/lib/utils";
import type { LogEntry } from "@/types";
import Link from "next/link";

export default function HistoryPage() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (search) params.set("search", search);
    const data = await fetch(`/api/entries?${params}`).then((r) => r.json());
    setEntries(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = entries.reduce<Record<string, LogEntry[]>>((acc, e) => {
    (acc[e.date] ||= []).push(e);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  return (
    <>
      <div className="mb-5">
        <h1 className="text-lg font-bold text-gray-900 mb-1">היסטוריה</h1>
        <p className="text-sm text-gray-500">עיין וחפש ביומני העבר שלך.</p>
      </div>

      {/* סינון */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="label">חפש שם מזון</label>
          <input
            className="input"
            placeholder="לדוגמה: עוף"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
        </div>
        <div>
          <label className="label">מתאריך</label>
          <input
            type="date"
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label">עד תאריך</label>
          <input
            type="date"
            className="input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button onClick={load} className="btn-primary w-full sm:w-auto">
            חפש
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-gray-400 text-center py-8">טוען...</p>
      )}

      {!loading && dates.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">לא נמצאו רשומות.</p>
      )}

      <div className="space-y-4">
        {dates.map((d) => {
          const dayEntries = grouped[d];
          const totals = sumMacros(dayEntries);
          return (
            <div key={d} className="card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800">{formatShortDate(d)}</span>
                  <span className="text-xs text-gray-500">
                    {round1(totals.calories)} קק״ל · ח׳ {round1(totals.protein)}ג׳
                    · פ׳ {round1(totals.carbs)}ג׳ · ש׳ {round1(totals.fat)}ג׳
                  </span>
                </div>
                <Link
                  href={`/?date=${d}`}
                  className="text-xs text-brand-600 hover:underline"
                >
                  פתח ←
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {dayEntries.map((entry) => (
                  <div key={entry.id} className="flex items-baseline gap-2 px-4 py-2">
                    <span className="text-xs text-gray-400 w-24 shrink-0">{entry.meal}</span>
                    <span className="text-sm text-gray-800 flex-1">{entry.foodName}</span>
                    {entry.quantity && (
                      <span className="text-xs text-gray-400">{entry.quantity}</span>
                    )}
                    <span className="text-xs text-gray-500 shrink-0">{round1(entry.calories)} קק״ל</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
