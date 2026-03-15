"use client";

import type { LogEntry } from "@/types";
import { round1 } from "@/lib/utils";

interface Props {
  entry: LogEntry;
  onEdit: (entry: LogEntry) => void;
  onDuplicate: (entry: LogEntry) => void;
  onDelete: (id: string) => void;
}

export default function EntryCard({ entry, onEdit, onDuplicate, onDelete }: Props) {
  return (
    <div className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 group transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm font-medium text-gray-800">{entry.foodName}</span>
          {entry.quantity && (
            <span className="text-xs text-gray-400">{entry.quantity}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-0.5">
          <span className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{round1(entry.calories)}</span> קק״ל
          </span>
          <span className="text-xs text-gray-400">
            ח׳ <span className="text-gray-600 font-medium">{round1(entry.protein)}ג׳</span>
          </span>
          <span className="text-xs text-gray-400">
            פ׳ <span className="text-gray-600 font-medium">{round1(entry.carbs)}ג׳</span>
          </span>
          <span className="text-xs text-gray-400">
            ש׳ <span className="text-gray-600 font-medium">{round1(entry.fat)}ג׳</span>
          </span>
        </div>
        {entry.notes && (
          <p className="text-xs text-gray-400 mt-0.5 italic">{entry.notes}</p>
        )}
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(entry)}
          className="btn btn-ghost btn-sm"
          title="ערוך"
        >
          ✎
        </button>
        <button
          onClick={() => onDuplicate(entry)}
          className="btn btn-ghost btn-sm"
          title="שכפל"
        >
          ⧉
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50"
          title="מחק"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
