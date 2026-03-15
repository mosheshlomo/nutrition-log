"use client";

import { useEffect, useState, useCallback } from "react";
import { formatDisplayDate, todayISO, sumMacros, MEAL_CATEGORIES } from "@/lib/utils";
import type { LogEntry, FoodItem, MealTemplate, UserSettings } from "@/types";
import DailyTotals from "@/components/log/DailyTotals";
import MealSection from "@/components/log/MealSection";
import Modal from "@/components/ui/Modal";
import EntryForm from "@/components/forms/EntryForm";

export default function TodayPage() {
  const [date, setDate] = useState(todayISO());
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [entryModal, setEntryModal] = useState<{
    open: boolean;
    editing?: LogEntry;
    defaultMeal?: string;
  }>({ open: false });
  const [templateModal, setTemplateModal] = useState(false);
  const [selectedTemplateMeal, setSelectedTemplateMeal] = useState("ארוחת בוקר");

  const loadEntries = useCallback(async () => {
    const res = await fetch(`/api/entries?date=${date}`);
    setEntries(await res.json());
  }, [date]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [e, f, t, s] = await Promise.all([
      fetch(`/api/entries?date=${date}`).then((r) => r.json()),
      fetch("/api/foods").then((r) => r.json()),
      fetch("/api/templates").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]);
    setEntries(e);
    setFoods(f);
    setTemplates(t);
    setSettings(s);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const mealOrder = settings?.mealOrder
    ? settings.mealOrder.split(",")
    : [...MEAL_CATEGORIES];

  const grouped = mealOrder.reduce<Record<string, LogEntry[]>>((acc, meal) => {
    acc[meal] = entries.filter((e) => e.meal === meal);
    return acc;
  }, {});

  const totals = sumMacros(entries);

  async function handleSaveEntry(data: Partial<LogEntry>) {
    if (entryModal.editing) {
      await fetch(`/api/entries/${entryModal.editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setEntryModal({ open: false });
    await loadEntries();
  }

  async function handleSaveAsFood(data: Omit<FoodItem, "id" | "createdAt" | "updatedAt">) {
    await fetch("/api/foods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const f = await fetch("/api/foods").then((r) => r.json());
    setFoods(f);
  }

  async function handleDuplicate(entry: LogEntry) {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...entry, id: undefined, date }),
    });
    await loadEntries();
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק רשומה זו?")) return;
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    await loadEntries();
  }

  async function applyTemplate(template: MealTemplate, targetMeal: string) {
    await Promise.all(
      template.items.map((item) =>
        fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            meal: targetMeal,
            foodName: item.foodName,
            quantity: item.quantity,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
          }),
        })
      )
    );
    setTemplateModal(false);
    await loadEntries();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        טוען...
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900">
            {date === todayISO() ? "היום" : formatDisplayDate(date)}
          </h1>
          {date !== todayISO() && (
            <p className="text-xs text-gray-400">{date}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input w-auto text-sm"
          />
          <button
            onClick={() => setDate(todayISO())}
            className="btn-secondary btn-sm"
          >
            היום
          </button>
        </div>
      </div>

      {/* Daily totals */}
      <DailyTotals totals={totals} settings={settings} />

      {/* Quick action bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setEntryModal({ open: true, defaultMeal: "ארוחת בוקר" })}
          className="btn-primary"
        >
          + הוסף רשומה
        </button>
        <button
          onClick={() => setTemplateModal(true)}
          className="btn-secondary"
        >
          השתמש בתבנית
        </button>
      </div>

      {/* Meal sections */}
      {mealOrder.map((meal) => (
        <MealSection
          key={meal}
          meal={meal}
          entries={grouped[meal] || []}
          onAdd={(m) => setEntryModal({ open: true, defaultMeal: m })}
          onEdit={(entry) => setEntryModal({ open: true, editing: entry })}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      ))}

      {/* Add/Edit entry modal */}
      <Modal
        open={entryModal.open}
        onClose={() => setEntryModal({ open: false })}
        title={entryModal.editing ? "ערוך רשומה" : "הוסף רשומה"}
      >
        <EntryForm
          date={date}
          defaultMeal={entryModal.defaultMeal ?? entryModal.editing?.meal ?? "ארוחת בוקר"}
          initial={entryModal.editing}
          foods={foods}
          templates={templates}
          onSave={handleSaveEntry}
          onCancel={() => setEntryModal({ open: false })}
          onSaveAsFood={handleSaveAsFood}
        />
      </Modal>

      {/* Template modal */}
      <Modal
        open={templateModal}
        onClose={() => setTemplateModal(false)}
        title="השתמש בתבנית"
        wide
      >
        <div className="space-y-3">
          <div>
            <label className="label">הוסף לארוחה</label>
            <div className="flex flex-wrap gap-1.5">
              {MEAL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedTemplateMeal(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedTemplateMeal === cat
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-brand-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {templates.length === 0 && (
            <p className="text-sm text-gray-400">אין תבניות שמורות עדיין. צור תבניות בדף התבניות.</p>
          )}

          <div className="space-y-2">
            {templates.map((t) => {
              const totalCal = t.items.reduce((s, i) => s + i.calories, 0);
              const totalP = t.items.reduce((s, i) => s + i.protein, 0);
              return (
                <div key={t.id} className="card p-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                    {t.description && (
                      <p className="text-xs text-gray-400">{t.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {t.items.map((item) => (
                        <span
                          key={item.id}
                          className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                        >
                          {item.foodName}
                          {item.quantity && ` (${item.quantity})`}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round(totalCal)} קק״ל · {Math.round(totalP)}ג׳ חלבון
                    </p>
                  </div>
                  <button
                    onClick={() => applyTemplate(t, selectedTemplateMeal)}
                    className="btn-primary btn-sm shrink-0"
                  >
                    הוסף
                  </button>
                </div>
              );
            })}
          </div>

          <button
            className="btn-secondary w-full"
            onClick={() => setTemplateModal(false)}
          >
            ביטול
          </button>
        </div>
      </Modal>
    </>
  );
}
