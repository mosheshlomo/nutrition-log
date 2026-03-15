import { format, parseISO } from "date-fns";

export const MEAL_CATEGORIES = [
  "ארוחת בוקר",
  "חטיף",
  "ארוחת צהריים",
  "לפני אימון",
  "ארוחת ערב",
  "אחר",
] as const;

export type MealCategory = (typeof MEAL_CATEGORIES)[number];

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDisplayDate(iso: string): string {
  return format(parseISO(iso), "EEEE, MMMM d, yyyy");
}

export function formatShortDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function sumMacros(entries: { calories: number; protein: number; carbs: number; fat: number }[]) {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
