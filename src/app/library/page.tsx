"use client";

import { useEffect, useState } from "react";
import type { FoodItem } from "@/types";
import Modal from "@/components/ui/Modal";

function FoodForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<FoodItem>;
  onSave: (data: Partial<FoodItem>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [calories, setCalories] = useState(String(initial?.calories ?? ""));
  const [protein, setProtein] = useState(String(initial?.protein ?? ""));
  const [carbs, setCarbs] = useState(String(initial?.carbs ?? ""));
  const [fat, setFat] = useState(String(initial?.fat ?? ""));
  const [serving, setServing] = useState(initial?.serving ?? "");
  const [tags, setTags] = useState(initial?.tags ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      serving: serving || null,
      tags: tags || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label">שם המזון</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          placeholder="לדוגמה: חזה עוף"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div>
          <label className="label">קלוריות</label>
          <input className="input" type="number" min="0" step="any" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </div>
        <div>
          <label className="label">חלבון (ג׳)</label>
          <input className="input" type="number" min="0" step="any" value={protein} onChange={(e) => setProtein(e.target.value)} />
        </div>
        <div>
          <label className="label">פחמימות (ג׳)</label>
          <input className="input" type="number" min="0" step="any" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
        </div>
        <div>
          <label className="label">שומן (ג׳)</label>
          <input className="input" type="number" min="0" step="any" value={fat} onChange={(e) => setFat(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">מנה ברירת מחדל</label>
        <input className="input" value={serving} onChange={(e) => setServing(e.target.value)} placeholder="לדוגמה: 100 גרם, כוס אחת" />
      </div>
      <div>
        <label className="label">תגיות (מופרדות בפסיק)</label>
        <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="לדוגמה: חלבון,בשר" />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1">{initial?.id ? "שמור שינויים" : "הוסף מזון"}</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>ביטול</button>
      </div>
    </form>
  );
}

export default function LibraryPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing?: FoodItem }>({ open: false });

  async function load() {
    setLoading(true);
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const data = await fetch(`/api/foods${params}`).then((r) => r.json());
    setFoods(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave(data: Partial<FoodItem>) {
    if (modal.editing) {
      await fetch(`/api/foods/${modal.editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setModal({ open: false });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק פריט מזון זה?")) return;
    await fetch(`/api/foods/${id}`, { method: "DELETE" });
    await load();
  }

  const filtered = search
    ? foods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : foods;

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-gray-900">ספריית מזון</h1>
          <p className="text-sm text-gray-500">{foods.length} פריטים שמורים</p>
        </div>
        <button onClick={() => setModal({ open: true })} className="btn-primary">
          + הוסף מזון
        </button>
      </div>

      <div className="mb-4">
        <input
          className="input"
          placeholder="חפש בספריית המזון..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
      </div>

      {loading && <p className="text-sm text-gray-400 text-center py-8">טוען...</p>}

      {!loading && filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">
          אין פריטי מזון עדיין. הוסף כדי לזרז את הרישום.
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((food) => (
          <div key={food.id} className="card p-3 flex items-center gap-3 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-gray-800">{food.name}</span>
                {food.serving && <span className="text-xs text-gray-400">{food.serving}</span>}
              </div>
              <div className="flex flex-wrap gap-3 mt-0.5">
                <span className="text-xs text-gray-500"><span className="font-medium text-gray-700">{food.calories}</span> קק״ל</span>
                <span className="text-xs text-gray-400">ח׳ <span className="text-gray-600 font-medium">{food.protein}ג׳</span></span>
                <span className="text-xs text-gray-400">פ׳ <span className="text-gray-600 font-medium">{food.carbs}ג׳</span></span>
                <span className="text-xs text-gray-400">ש׳ <span className="text-gray-600 font-medium">{food.fat}ג׳</span></span>
              </div>
              {food.tags && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {food.tags.split(",").map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => setModal({ open: true, editing: food })}
                className="btn btn-ghost btn-sm"
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(food.id)}
                className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.editing ? "ערוך מזון" : "הוסף מזון"}
      >
        <FoodForm
          initial={modal.editing}
          onSave={handleSave}
          onCancel={() => setModal({ open: false })}
        />
      </Modal>
    </>
  );
}
