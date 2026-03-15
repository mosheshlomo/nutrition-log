"use client";

import { useState } from "react";
import { MEAL_CATEGORIES } from "@/lib/utils";
import type { LogEntry, FoodItem, MealTemplate } from "@/types";

interface EntryFormProps {
  date: string;
  defaultMeal?: string;
  initial?: Partial<LogEntry>;
  foods: FoodItem[];
  templates: MealTemplate[];
  onSave: (entry: Partial<LogEntry>) => void;
  onCancel: () => void;
  onSaveAsFood?: (data: Omit<FoodItem, "id" | "createdAt" | "updatedAt">) => void;
}

export default function EntryForm({
  date,
  defaultMeal = "ארוחת בוקר",
  initial,
  foods,
  onSave,
  onCancel,
  onSaveAsFood,
}: EntryFormProps) {
  const [meal, setMeal] = useState(initial?.meal ?? defaultMeal);
  const [foodName, setFoodName] = useState(initial?.foodName ?? "");
  const [quantity, setQuantity] = useState(initial?.quantity ?? "");
  const [calories, setCalories] = useState(String(initial?.calories ?? ""));
  const [protein, setProtein] = useState(String(initial?.protein ?? ""));
  const [carbs, setCarbs] = useState(String(initial?.carbs ?? ""));
  const [fat, setFat] = useState(String(initial?.fat ?? ""));
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [saveAsFood, setSaveAsFood] = useState(false);
  const [foodSearch, setFoodSearch] = useState("");
  const [showFoodPicker, setShowFoodPicker] = useState(false);

  const filteredFoods = foodSearch
    ? foods.filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase()))
    : foods.slice(0, 12);

  function applyFood(food: FoodItem) {
    setFoodName(food.name);
    setCalories(String(food.calories));
    setProtein(String(food.protein));
    setCarbs(String(food.carbs));
    setFat(String(food.fat));
    if (food.serving) setQuantity(food.serving);
    setShowFoodPicker(false);
    setFoodSearch("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!foodName.trim()) return;

    const entry: Partial<LogEntry> = {
      date,
      meal,
      foodName: foodName.trim(),
      quantity: quantity || null,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      notes: notes || null,
    };

    if (saveAsFood && onSaveAsFood) {
      onSaveAsFood({
        name: foodName.trim(),
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        serving: quantity || null,
        tags: null,
      });
    }

    onSave(entry);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* בחירת ארוחה */}
      <div>
        <label className="label">ארוחה</label>
        <div className="flex flex-wrap gap-1.5">
          {MEAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setMeal(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                meal === cat
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-brand-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* שם מזון + ספרייה */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="label mb-0">שם המזון</label>
          <button
            type="button"
            className="text-xs text-brand-600 hover:underline"
            onClick={() => setShowFoodPicker((v) => !v)}
          >
            {showFoodPicker ? "הסתר ספרייה" : "בחר מהספרייה"}
          </button>
        </div>

        {showFoodPicker && (
          <div className="mb-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
            <input
              className="input mb-2 text-xs"
              placeholder="חפש בספרייה..."
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              autoFocus
            />
            <div className="max-h-36 overflow-y-auto space-y-0.5">
              {filteredFoods.length === 0 && (
                <p className="text-xs text-gray-400 px-1">אין תוצאות</p>
              )}
              {filteredFoods.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => applyFood(f)}
                  className="w-full text-right px-2 py-1.5 rounded text-xs hover:bg-white hover:shadow-sm transition-all"
                >
                  <span className="font-medium text-gray-800">{f.name}</span>
                  <span className="text-gray-400 mr-2">{f.calories} קק״ל · {f.protein}ג׳ ח׳</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <input
          className="input"
          placeholder="לדוגמה: חזה עוף"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
          autoFocus={!showFoodPicker}
        />
      </div>

      {/* כמות */}
      <div>
        <label className="label">כמות / מנה (אופציונלי)</label>
        <input
          className="input"
          placeholder="לדוגמה: 200 גרם, כוס אחת, 2 כפות"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      {/* מאקרו */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div>
          <label className="label">קלוריות</label>
          <input
            className="input"
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </div>
        <div>
          <label className="label">חלבון (ג׳)</label>
          <input
            className="input"
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </div>
        <div>
          <label className="label">פחמימות (ג׳)</label>
          <input
            className="input"
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
        </div>
        <div>
          <label className="label">שומן (ג׳)</label>
          <input
            className="input"
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
        </div>
      </div>

      {/* הערות */}
      <div>
        <label className="label">הערות (אופציונלי)</label>
        <input
          className="input"
          placeholder="הערות..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* שמור כפריט */}
      {onSaveAsFood && !initial?.id && (
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={saveAsFood}
            onChange={(e) => setSaveAsFood(e.target.checked)}
            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          שמור לספריית המזון לשימוש חוזר
        </label>
      )}

      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1">
          {initial?.id ? "שמור שינויים" : "הוסף רשומה"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          ביטול
        </button>
      </div>
    </form>
  );
}
