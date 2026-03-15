"use client";

import type { LogEntry } from "@/types";
import { round1, sumMacros } from "@/lib/utils";
import EntryCard from "./EntryCard";

interface Props {
  meal: string;
  entries: LogEntry[];
  onAdd: (meal: string) => void;
  onEdit: (entry: LogEntry) => void;
  onDuplicate: (entry: LogEntry) => void;
  onDelete: (id: string) => void;
}

export default function MealSection({ meal, entries, onAdd, onEdit, onDuplicate, onDelete }: Props) {
  const totals = sumMacros(entries);

  return (
    <div className="card mb-3">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700">{meal}</h3>
          {entries.length > 0 && (
            <span className="text-xs text-gray-400">
              {round1(totals.calories)} קק״ל · {round1(totals.protein)}ג׳ חלבון
            </span>
          )}
        </div>
        <button
          onClick={() => onAdd(meal)}
          className="btn btn-ghost btn-sm text-brand-600 hover:bg-brand-50"
        >
          + הוסף
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="px-4 py-3 text-xs text-gray-400">אין רשומות</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
