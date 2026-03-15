"use client";

import { useEffect, useState } from "react";
import type { UserSettings } from "@/types";
import { MEAL_CATEGORIES } from "@/lib/utils";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [caloriesTarget, setCaloriesTarget] = useState("");
  const [proteinTarget, setProteinTarget] = useState("");
  const [carbsTarget, setCarbsTarget] = useState("");
  const [fatTarget, setFatTarget] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s: UserSettings) => {
        setSettings(s);
        setCaloriesTarget(s.caloriesTarget ? String(s.caloriesTarget) : "");
        setProteinTarget(s.proteinTarget ? String(s.proteinTarget) : "");
        setCarbsTarget(s.carbsTarget ? String(s.carbsTarget) : "");
        setFatTarget(s.fatTarget ? String(s.fatTarget) : "");
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caloriesTarget: caloriesTarget || null,
        proteinTarget: proteinTarget || null,
        carbsTarget: carbsTarget || null,
        fatTarget: fatTarget || null,
        mealOrder: settings?.mealOrder ?? MEAL_CATEGORIES.join(","),
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <div className="mb-5">
        <h1 className="text-lg font-bold text-gray-900">הגדרות</h1>
        <p className="text-sm text-gray-500">יעדי מאקרו יומיים אופציונליים והעדפות.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-md">
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">יעדי מאקרו יומיים (אופציונלי)</h2>
          <p className="text-xs text-gray-400 mb-4">
            מידעיים בלבד. פסי התקדמות יוצגו ביומן היומי שלך.
            השאר ריק כדי להסתיר יעדים.
          </p>
          <div className="space-y-3">
            <div>
              <label className="label">יעד קלוריות</label>
              <input
                className="input"
                type="number"
                min="0"
                value={caloriesTarget}
                onChange={(e) => setCaloriesTarget(e.target.value)}
                placeholder="לדוגמה: 2200"
              />
            </div>
            <div>
              <label className="label">יעד חלבון (גרם)</label>
              <input
                className="input"
                type="number"
                min="0"
                value={proteinTarget}
                onChange={(e) => setProteinTarget(e.target.value)}
                placeholder="לדוגמה: 180"
              />
            </div>
            <div>
              <label className="label">יעד פחמימות (גרם)</label>
              <input
                className="input"
                type="number"
                min="0"
                value={carbsTarget}
                onChange={(e) => setCarbsTarget(e.target.value)}
                placeholder="לדוגמה: 220"
              />
            </div>
            <div>
              <label className="label">יעד שומן (גרם)</label>
              <input
                className="input"
                type="number"
                min="0"
                value={fatTarget}
                onChange={(e) => setFatTarget(e.target.value)}
                placeholder="לדוגמה: 65"
              />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">קטגוריות ארוחה</h2>
          <p className="text-xs text-gray-400 mb-2">
            קטגוריות ברירת מחדל (לפי סדר): {MEAL_CATEGORIES.join(", ")}
          </p>
          <p className="text-xs text-gray-400">
            התאמת סדר הקטגוריות — בקרוב.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
        >
          {saving ? "שומר..." : saved ? "נשמר ✓" : "שמור הגדרות"}
        </button>
      </form>
    </>
  );
}
