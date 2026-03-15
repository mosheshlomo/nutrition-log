import type { DailyTotals, UserSettings } from "@/types";
import { round1 } from "@/lib/utils";

interface Props {
  totals: DailyTotals;
  settings?: UserSettings | null;
}

function MacroBar({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target?: number | null;
  color: string;
}) {
  const pct = target ? Math.min((value / target) * 100, 100) : null;
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between gap-1 mb-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-gray-800">
          {round1(value)}
          {target ? (
            <span className="text-xs text-gray-400 font-normal"> / {target}</span>
          ) : null}
        </span>
      </div>
      {pct !== null && (
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function DailyTotals({ totals, settings }: Props) {
  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">סה״כ יומי</h2>
      </div>
      <div className="flex gap-4 flex-wrap">
        <MacroBar
          label="קלוריות"
          value={totals.calories}
          target={settings?.caloriesTarget}
          color="bg-amber-400"
        />
        <MacroBar
          label="חלבון"
          value={totals.protein}
          target={settings?.proteinTarget}
          color="bg-blue-400"
        />
        <MacroBar
          label="פחמימות"
          value={totals.carbs}
          target={settings?.carbsTarget}
          color="bg-green-400"
        />
        <MacroBar
          label="שומן"
          value={totals.fat}
          target={settings?.fatTarget}
          color="bg-rose-400"
        />
      </div>
    </div>
  );
}
