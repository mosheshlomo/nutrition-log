"use client";

import { useEffect, useState } from "react";
import type { FoodItem, MealTemplate, TemplateItem } from "@/types";
import Modal from "@/components/ui/Modal";
import { round1 } from "@/lib/utils";

interface TemplateItemDraft {
  id?: string;
  foodItemId?: string | null;
  foodName: string;
  quantity: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

function TemplateForm({
  initial,
  foods,
  onSave,
  onCancel,
}: {
  initial?: MealTemplate;
  foods: FoodItem[];
  onSave: (data: { name: string; description: string; items: TemplateItemDraft[] }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [items, setItems] = useState<TemplateItemDraft[]>(
    initial?.items.map((i: TemplateItem) => ({
      id: i.id,
      foodItemId: i.foodItemId,
      foodName: i.foodName,
      quantity: i.quantity ?? "",
      calories: String(i.calories),
      protein: String(i.protein),
      carbs: String(i.carbs),
      fat: String(i.fat),
    })) ?? [{ foodName: "", quantity: "", calories: "", protein: "", carbs: "", fat: "" }]
  );
  const [foodSearch, setFoodSearch] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  function addItem() {
    setItems((prev) => [...prev, { foodName: "", quantity: "", calories: "", protein: "", carbs: "", fat: "" }]);
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, key: keyof TemplateItemDraft, val: string) {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [key]: val } : item)));
  }

  function applyFood(idx: number, food: FoodItem) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              foodItemId: food.id,
              foodName: food.name,
              quantity: food.serving ?? "",
              calories: String(food.calories),
              protein: String(food.protein),
              carbs: String(food.carbs),
              fat: String(food.fat),
            }
          : item
      )
    );
    setFoodSearch(null);
    setQuery("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ name: name.trim(), description: description.trim(), items });
  }

  const filteredFoods = query
    ? foods.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : foods.slice(0, 8);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">שם התבנית</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="לדוגמה: ארוחת ערב רגילה" autoFocus />
      </div>
      <div>
        <label className="label">תיאור (אופציונלי)</label>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="לדוגמה: עוף + אורז + סלט" />
      </div>

      <div>
        <label className="label">פריטים</label>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 p-3 relative">
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute top-2 left-2 text-gray-300 hover:text-red-400 text-sm"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="input flex-1"
                  placeholder="שם מזון"
                  value={item.foodName}
                  onChange={(e) => updateItem(idx, "foodName", e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => { setFoodSearch(foodSearch === idx ? null : idx); setQuery(""); }}
                  className="btn btn-ghost btn-sm shrink-0"
                >
                  ספרייה
                </button>
              </div>
              {foodSearch === idx && (
                <div className="mb-2 rounded border border-gray-200 bg-gray-50 p-2">
                  <input className="input mb-1.5 text-xs" placeholder="חפש..." value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
                  <div className="max-h-32 overflow-y-auto space-y-0.5">
                    {filteredFoods.map((f) => (
                      <button key={f.id} type="button" onClick={() => applyFood(idx, f)} className="w-full text-right px-2 py-1 text-xs rounded hover:bg-white">
                        <span className="font-medium">{f.name}</span>
                        <span className="text-gray-400 mr-2">{f.calories} קק״ל</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-5 gap-1.5">
                <div className="col-span-5 sm:col-span-1">
                  <input className="input text-xs" placeholder="כמות" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", e.target.value)} />
                </div>
                <div>
                  <input className="input text-xs" type="number" min="0" step="any" placeholder="קל׳" value={item.calories} onChange={(e) => updateItem(idx, "calories", e.target.value)} />
                </div>
                <div>
                  <input className="input text-xs" type="number" min="0" step="any" placeholder="ח׳" value={item.protein} onChange={(e) => updateItem(idx, "protein", e.target.value)} />
                </div>
                <div>
                  <input className="input text-xs" type="number" min="0" step="any" placeholder="פ׳" value={item.carbs} onChange={(e) => updateItem(idx, "carbs", e.target.value)} />
                </div>
                <div>
                  <input className="input text-xs" type="number" min="0" step="any" placeholder="ש׳" value={item.fat} onChange={(e) => updateItem(idx, "fat", e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2 mt-1 text-xs text-gray-400">
                <span>כמות</span><span>קל׳</span><span>חלבון</span><span>פחמימות</span><span>שומן</span>
              </div>
            </div>
          ))}
          <button type="button" onClick={addItem} className="btn-secondary btn-sm w-full">
            + הוסף פריט
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1">{initial ? "שמור שינויים" : "צור תבנית"}</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>ביטול</button>
      </div>
    </form>
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing?: MealTemplate }>({ open: false });

  async function load() {
    setLoading(true);
    const [t, f] = await Promise.all([
      fetch("/api/templates").then((r) => r.json()),
      fetch("/api/foods").then((r) => r.json()),
    ]);
    setTemplates(t);
    setFoods(f);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave(data: { name: string; description: string; items: TemplateItemDraft[] }) {
    const payload = {
      name: data.name,
      description: data.description,
      items: data.items.map((item, idx) => ({
        foodItemId: item.foodItemId ?? null,
        foodName: item.foodName,
        quantity: item.quantity || null,
        calories: Number(item.calories) || 0,
        protein: Number(item.protein) || 0,
        carbs: Number(item.carbs) || 0,
        fat: Number(item.fat) || 0,
        sortOrder: idx,
      })),
    };
    if (modal.editing) {
      await fetch(`/api/templates/${modal.editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setModal({ open: false });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק תבנית זו?")) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-gray-900">תבניות ארוחה</h1>
          <p className="text-sm text-gray-500">שמור ארוחות נפוצות לרישום בלחיצה אחת.</p>
        </div>
        <button onClick={() => setModal({ open: true })} className="btn-primary">
          + תבנית חדשה
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400 text-center py-8">טוען...</p>}
      {!loading && templates.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">
          אין תבניות עדיין. צור תבנית כדי לזרז את הרישום היומי.
        </p>
      )}

      <div className="space-y-3">
        {templates.map((t) => {
          const totalCal = t.items.reduce((s, i) => s + i.calories, 0);
          const totalP = t.items.reduce((s, i) => s + i.protein, 0);
          const totalC = t.items.reduce((s, i) => s + i.carbs, 0);
          const totalF = t.items.reduce((s, i) => s + i.fat, 0);
          return (
            <div key={t.id} className="card p-4 group">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  {t.description && <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>}
                  <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                    <span><span className="font-medium text-gray-700">{round1(totalCal)}</span> קק״ל</span>
                    <span>ח׳ <span className="font-medium text-gray-600">{round1(totalP)}ג׳</span></span>
                    <span>פ׳ <span className="font-medium text-gray-600">{round1(totalC)}ג׳</span></span>
                    <span>ש׳ <span className="font-medium text-gray-600">{round1(totalF)}ג׳</span></span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setModal({ open: true, editing: t })}
                    className="btn btn-ghost btn-sm"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="mt-2 space-y-0.5">
                {t.items.map((item) => (
                  <div key={item.id} className="flex items-baseline gap-2 text-xs text-gray-600 pr-1">
                    <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0 mt-1.5" />
                    <span>{item.foodName}</span>
                    {item.quantity && <span className="text-gray-400">({item.quantity})</span>}
                    <span className="text-gray-400 mr-auto">{round1(item.calories)} קק״ל</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.editing ? "ערוך תבנית" : "תבנית חדשה"}
        wide
      >
        <TemplateForm
          initial={modal.editing}
          foods={foods}
          onSave={handleSave}
          onCancel={() => setModal({ open: false })}
        />
      </Modal>
    </>
  );
}
